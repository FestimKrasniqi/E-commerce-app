const express = require('express');
const connectDB = require('./config/db');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/user-routes');
const productRoutes = require('./routes/product-routes');
const orderRoutes = require('./routes/order-routes')
const revieRoutes = require('./routes/review-routes')
const path = require("path");

connectDB();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/uploads/images", express.static(path.join("uploads","images")));

app.use('/api/users', userRoutes);
app.use('/api/products',productRoutes);
app.use('/api/orders/',orderRoutes);
app.use('/api/reviews',revieRoutes)



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

