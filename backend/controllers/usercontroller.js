const user = require('../models/User');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res)  => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await user.findOne({ email});
        if(existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new user({
          name,
          email,
          password,
          role : role || 'user', // Default to 'user' if no role is provided
        });
        await newUser.save();
        const token = jwt.sign(
          { id: newUser._id},
          "SECRETTOKEN",
          { expiresIn: "1h" }
        );

        res.status(201).json({
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
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

        const token = jwt.sign({ id: existingUser._id, role: existingUser.role}, 'SECRETTOKEN', { expiresIn: '1h' });
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



module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    getAllUsers
};