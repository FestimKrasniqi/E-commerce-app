const productController = require('../controllers/ProductController')
const express = require('express');
const router = express.Router();
const { allowRoles } = require('../middleware/role')
const {
  validateProduct,
  validateProductUpdate,
} = require("../utils/validation");
const authMiddleware = require('../middleware/auth');
const fileUpload = require('../middleware/multer');



router.get('/all',authMiddleware,allowRoles("admin"), productController.getAllProducts)
router.get('/:pid',authMiddleware,allowRoles("user","admin"),productController.getProductById)
router.post('/create',authMiddleware,allowRoles("admin"), fileUpload.single('image'), validateProduct, productController.createProduct)
router.patch('/update/:pid',authMiddleware,allowRoles("admin"), fileUpload.single('image'), validateProductUpdate, productController.updateProduct)
router.delete('/delete/:pid',authMiddleware,allowRoles("admin"), productController.deleteProduct)
router.get('/search',authMiddleware,allowRoles('admin','user'),productController.searchAndFilterProducts)

module.exports = router;