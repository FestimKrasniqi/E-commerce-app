const {body, validationResult} = require('express-validator');

exports.validateUserRegistration = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage('Role must be either "user" or "admin"'),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage('Status must be either "active" or "inactive"'),

  body("profile.phone")
    .notEmpty()
    .isMobilePhone()
    .withMessage("Invalid phone number format"),

  body("profile.address")
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters long"),

  body("profile.city")
    .notEmpty()
    .isLength({ min: 4 })
    .withMessage("City must be at least 6 characters long"),

  body("profile.country")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Country must be at least 6 characters long"),

  body("profile.dateOfBirth")
    .notEmpty()
    .isDate()
    .isISO8601()
    .withMessage("Date of birth must be a valid ISO8601 date (YYYY-MM-DD)")
    .custom((value) => {
      const today = new Date();
      const dob = new Date(value);
      if (dob >= today) {
        throw new Error("Date of birth must be in the past");
      }
      const age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 18) {
        throw new Error("User must be at least 18 years old");
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
  },
];

exports.validateUserLogin = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

exports.validateForgetPassword = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

exports.validateResetPassword = [
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

exports.validateUserUpdate = [
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  body("email").optional().isEmail().withMessage("Invalid email format"),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage('Role must be either "user" or "admin"'),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage('Status must be either "active" or "inactive"'),

  body("profile.phone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number format"),

  body("profile.address")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters long"),

  body("profile.city")
    .optional()
    .isLength({ min: 4 })
    .withMessage("City must be at least 4 characters long"),

  body("profile.country")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Country must be at least 6 characters long"),

  body("profile.dateOfBirth")
    .optional()
    .isDate()
    .isISO8601()
    .withMessage("Date of birth must be a valid ISO8601 date (YYYY-MM-DD)")
    .custom((value) => {
      const today = new Date();
      const dob = new Date(value);
      if (dob >= today) {
        throw new Error("Date of birth must be in the past");
      }
      const age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 18) {
        throw new Error("User must be at least 18 years old");
      }

      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];



