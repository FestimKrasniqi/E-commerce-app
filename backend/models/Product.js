const mongoose = require("mongoose");
const Order = require('./Order')
const Review = require('./Review')

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
    },

    description: {
      type: String,
      required: true,
      minLength: 10,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

ProductSchema.pre("findOneAndDelete", async function (next) {
  const product = await this.model.findOne(this.getFilter());
  if (!product) return next();

  // Delete reviews associated with this product
  await Review.deleteMany({ product: product._id });

  // Pull the product from all orders
  await Order.updateMany(
    { "products.product": product._id },
    { $pull: { products: { product: product._id } } }
  );

  // Optionally, delete orders that have no products left
  await Order.deleteMany({ products: { $size: 0 } });

  next();
});

module.exports = mongoose.model("Product", ProductSchema);
