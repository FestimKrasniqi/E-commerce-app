const { body, validationResult } = require("express-validator");

exports.validateTransaction = [
  body("amount")
    .notEmpty()
    .isNumeric()
    .custom((value) => value > 0)
    .withMessage("Amount cannot be negative"),

  body("type")
    .notEmpty()
    .isIn(["transfer", "deposit", "withdrawal"])
    .withMessage("Type must be transfer, deposit, or withdrawal"),

  body("description")
    .notEmpty()
    .isLength({ max: 500 })
    .trim()
    .withMessage("Description max length is 500 characters"),

  body("transactionDate")
    .notEmpty()
    .isDate()
    .custom((value) => {
      const dob = new Date(value);
      if (dob >= today) {
        throw new Error("Transaction date cannot be in the future.");
      }
      return true;
    })
    .withMessage("Invalid date format"),




    (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }


];