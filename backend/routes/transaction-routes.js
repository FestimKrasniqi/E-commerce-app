const transactioncontroller = require('../controllers/TransactionController');
const express = require('express')
const router = express.Router()
const authMiddleware = require("../middleware/auth");
const { allowRoles } = require("../middleware/role");
const {validateTransaction} = require('../utils/transactionvalidation');

router.post('/create', validateTransaction, authMiddleware, allowRoles('admin','user'), transactioncontroller.createTransaction);
router.get('/all/:accountId', authMiddleware, allowRoles('admin','user'), transactioncontroller.getTransactions );

module.exports = router;