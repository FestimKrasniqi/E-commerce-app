const user = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const registerUser = async (req, res)  => {
    const { name, email, password, role, status, profile} = req.body;

    try {
        const existingUser = await user.findOne({ email});
        if(existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new user({
          name,
          email,
          password,
          role : role || 'user',
          status: status || 'active',
          profile: {
            phone: profile?.phone || '',
            address: profile?.address || '',
            city: profile?.city || '',
            country: profile?.country || '',
            dateOfBirth: profile?.dateOfBirth || null
          }
        });
        await newUser.save();
        const token = jwt.sign(
          { id: newUser._id},
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.status(201).json({
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
          profile: newUser.profile,
          token: token,
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await user.findOne({ email });
        

        const isPasswordValid = await existingUser.matchPassword(password);
        if (!existingUser || !isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: existingUser._id, role: existingUser.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
        res
          .status(200)
          .json({
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            token: token,
          });


    }

      catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error' });
      }

    

}

const getUserProfile = async (req, res) => {
    const userId = req.params.uid;

    try {
        const existingUser = await user.findById(userId).select('-password');
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(existingUser);

} catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }

}

const getAllUsers = async (req, res) => {
    try {
        const users = await user.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const forgetPassword = async (req, res) => {
    const { email} = req.body;

    try {
      const existingUser = await user.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

        // Set reset token and expiration time

      existingUser.resetPasswordToken = resetPasswordToken;
      existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      await existingUser.save();

      // console.log(process.env.RESET_PASSWORD);

      const resetUrl = `${process.env.RESET_PASSWORD}/${resetToken}`;

      console.log("🔑 Reset Token (use this in Postman):", resetToken);

      
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.USER_EMAIL || "",
          pass: process.env.USER_PASSWORD || "",
        },
      });

      await transporter.sendMail({
        to: existingUser.email,
        subject: "Password Reset Request",
        text: `You are receiving this email because you (or someone else) has requested the reset of a password. Please click on the following link, or paste this into your browser to complete the process: \n\n ${resetUrl} \n\n If you did not request this, please ignore this email and your password will remain unchanged.`,
      });

      res.status(200).json({ message: "Reset link sent to your email" });
    } catch (error) {
        console.error('Error in forget password:', error);
        res.status(500).json({ message: 'Server error' });
    }

}

const resetPassword = async (req, res) => {
    const {token} = req.params;
    const { password } = req.body;

    try {
        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
        const existingUser = await user.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        existingUser.password = password;
        existingUser.resetPasswordToken = undefined;
        existingUser.resetPasswordExpires = undefined;
        await existingUser.save();
        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const logout = (req, res) => {
    // Invalidate the token on the client side
    res.status(200).json({ message: 'Logged out successfully' });
}

const updatedUser = async (req,res) => {

const userId = req.params.uid;
const requestedId = req.user.id;

if(userId.toString() !== requestedId.toString() && req.user.role !== 'admin') {
  return res
    .status(403)
    .json({ message: "Not authorized to update this user" });
}

try {
  const updateFields = {
    name: req.body.name,
    email: req.body.email,
    profile: {
      phone: req.body.profile?.phone,
      address: req.body.profile?.address,
      city: req.body.profile?.city,
      country: req.body.profile?.country,
      dateOfBirth: req.body.profile?.dateOfBirth
    }
  };

  const updatedUser = await user
    .findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    )
    .select("-password");

    res.status(200).json(updatedUser);


} catch (error) {
  console.error("Error updating user:", error);
  res.status(500).json({ message: "Server error" });
}


}

const deleteUser = async (req, res) => {
  const userId = req.params.uid;
  const requesterId = req.user.id;
  const isAdmin = req.user.role === "admin";

  if (requesterId.toString() !== userId.toString() && !isAdmin) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this user" });
  }

  try {
    const deletedUser = await user.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const countUsers = async (req,res) => {
  try {
    const count = await user.countDocuments();
    
    return res.status(200).json(count)
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    getAllUsers,
    forgetPassword,
    resetPassword,
    logout,
    updatedUser,
    deleteUser,
    countUsers
};