const express = require('express');
const connectDB = require('./config/db');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/user-routes');


connectDB();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

