const usercontroller = require('../controllers/UserController');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { allowRoles } = require("../middleware/role");
const {
    validateUserRegistration,
    validateUserLogin,
    validateForgetPassword,
    validateResetPassword
} = require('../utils/validation');


router.post('/register', validateUserRegistration, usercontroller.registerUser);
router.post('/login',validateUserLogin, usercontroller.loginUser);
router.get('/profile/:uid', authMiddleware, allowRoles('user', 'admin'), usercontroller.getUserProfile);
router.get('/all', authMiddleware, allowRoles("admin"), usercontroller.getAllUsers);
router.post('/forget-password',validateForgetPassword, usercontroller.forgetPassword);
router.post('/reset-password/:token', validateResetPassword, usercontroller.resetPassword);
// router.post('/logout', authMiddleware,  usercontroller.logoutUser);

module.exports = router;