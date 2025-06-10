const Review = require('../models/Review')
const Product = require('../models/Product')

const createReview = async (req,res) => {
    try {
        const {productId} = req.params;
        const {rating,comment} = req.body;
        const userId = req.user.id;

        const product = await Product.findById(productId)
        if(!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        const existingReview = await Review.findOne({product: productId,user: userId});
        if(existingReview) {
            return res.status(400).json({ message: "You already reviewed this product" });
        }

        const review = new Review({ user: userId, product: productId, rating, comment });
    await review.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error: error.message });
  }
    
}

const getAllReviews = async (req,res) => {
    try {
      const review = await Review.find()
        .populate("user", "name")
        .populate("product", "name");
      res.status(200).json(review);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching reviews", error: error.message });
    }
}

const updateReview = async (req,res) => {
    try {
        const {rating,comment} = req.body;
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
          return res.status(404).json({ message: "Review not found" });
        }

        if (review.user.toString() !== req.user.id) {
          return res
            .status(403)
            .json({ message: "Not authorized to delete this review" });
        }

        if(rating) {
            review.rating = rating
        }
        if(comment) {
            review.comment = comment
        }

        const updateReview = await review.save();
        res.status(200).json(updateReview)
    } catch (error) {
        res
          .status(500)
          .json({ message: "Error updating review", error: error.message });
    }
}

const deleteReview = async (req,res) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if(!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if(review.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this review" });
        }

        await review.deleteOne();
        res.status(200).json({ message: "Review deleted" });
      } catch (error) {
        res.status(500).json({ message: "Error deleting review", error: error.message });
      
    }
}

const getMyReviews = async (req,res) => {
    try {
      const reviews = await Review.find({ user: req.user.id }).populate(
        "product",
        "name"
      );
      res.status(200).json(reviews);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching your reviews", error: error.message });
    }
}

module.exports = {
    createReview,
    getAllReviews,
    updateReview,
    deleteReview,
    getMyReviews
}