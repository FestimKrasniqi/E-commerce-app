const express = require('express');
const connectDB = require('./config/db');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');

connectDB();
dotenv.config();

app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

