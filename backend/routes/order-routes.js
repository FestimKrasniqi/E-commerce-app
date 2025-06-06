const orderController = require('../controllers/OrderController');
const express = require('express');
const authMiddleware = require('../middleware/auth');
const { allowRoles } = require('../middleware/role');
const router = express.Router();
const {validateCreateOrder,validateUpdateOrder} = require('../utils/validation')


router.get('/all',authMiddleware,allowRoles('admin'),orderController.getAllOrders);
router.get('/orderinfo/:oid',authMiddleware,allowRoles('admin','user'),orderController.getOrderById)
router.get('/myorders',authMiddleware,allowRoles('user','admin'),orderController.getMyOrder);
router.post(
  "/create",
  validateCreateOrder,authMiddleware,
  allowRoles("user", "admin"),
  orderController.createOrder
);
router.delete('/delete/:oid',authMiddleware,allowRoles('user','admin'),orderController.deleteOrder);
router.patch('/update/:oid',validateUpdateOrder,authMiddleware,allowRoles('user','admin'),orderController.updateOrder);

module.exports = router;