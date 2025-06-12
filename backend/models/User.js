const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Order = require('./Order')
const Review = require('./Review')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

   status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
   },

   profile: {
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    }
   },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error);
    }

})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre("findOneAndDelete", async function (next) {
  const user = await this.model.findOne(this.getFilter());
  if (!user) return next();

  await Order.deleteMany({ user: user._id });
  await Review.deleteMany({ user: user._id });

  next();
});

userSchema.pre("save", async function (next) {
  // Only run if setting role to admin
  if (this.role !== "admin") return next();

  // If this user is already admin (updating self), allow it
  if (!this.isNew && this.isModified("role") === false) return next();

  // Count existing admins
  const adminCount = await mongoose
    .model("User")
    .countDocuments({ role: "admin" });

  if (adminCount > 0) {
    const error = new Error("There can be only one admin user");
    return next(error);
  }

  next();
});


module.exports = mongoose.model('User', userSchema);