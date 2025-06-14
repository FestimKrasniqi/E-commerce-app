const mongoose = require('mongoose');

require("dotenv").config();

console.log(process.env.MONGO_URI)
// const MONGO_URI =  "mongodb://localhost:27017/Ecommerce";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit the process with failure
    }
}

module.exports = connectDB;