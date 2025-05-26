const usercontroller = require('../controllers/usercontroller');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { allowRoles } = require("../middleware/role");


router.post('/register', usercontroller.registerUser);
router.post('/login', usercontroller.loginUser);
router.get('/profile/:uid', authMiddleware, allowRoles('user', 'admin'), usercontroller.getUserProfile);
router.get('/all', authMiddleware, allowRoles("admin"), usercontroller.getAllUsers);

module.exports = router;