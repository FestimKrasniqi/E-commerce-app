const reviewController = require('../controllers/ReviewController')
const express = require('express');
const authMiddleware = require('../middleware/auth');
const { allowRoles } = require('../middleware/role');
const {validateCreateReview, validateUpdateReview} = require('../utils/validation')
const router = express.Router();

router.post('/:productId',authMiddleware,allowRoles('user','admin'),validateCreateReview,reviewController.createReview)
router.get('/all',authMiddleware,allowRoles('admin'),reviewController.getAllReviews)
router.get('/my',authMiddleware,allowRoles('user','admin'),reviewController.getMyReviews)
router.patch('/update/:reviewId',authMiddleware,allowRoles('user','admin'),validateUpdateReview,reviewController.updateReview)
router.delete('/delete/:reviewId',authMiddleware,allowRoles('user','admin'),reviewController.deleteReview)

module.exports = router;