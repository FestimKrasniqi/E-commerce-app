const mongoose = require("mongoose");


const reviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    product: {
        type: mongoose.Schema.Types.ObjectId, ref: "Product"
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    comment: {
        type: String,
        max: 500,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model("Review", reviewSchema);