const accountcontroller = require("../controllers/AccountController");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { allowRoles } = require("../middleware/role");
const { validateAccountCreation, validateAccountUpdate } = require("../utils/accountvalidation");


router.post(
  "/create",
  validateAccountCreation,
  authMiddleware,
  allowRoles("user", "admin"),
  accountcontroller.createAccount
);
router.get(
  "/my-account/",
  authMiddleware,
  allowRoles("user", "admin"),
  accountcontroller.getMyUserAccount
);
router.get(
  "/all",
  authMiddleware,
  allowRoles("admin"),
  accountcontroller.getAllAccounts
);
router.patch(
  "/update/:accountId",
  validateAccountUpdate,
  authMiddleware,
  allowRoles("user", "admin"),
  accountcontroller.updateAccount
);
router.delete(
  "/delete/:accountId",
  authMiddleware,
  allowRoles("user", "admin"),
  accountcontroller.deleteAccount
);

module.exports = router;