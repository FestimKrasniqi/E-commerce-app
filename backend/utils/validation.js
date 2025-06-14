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


exports.validateProduct = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  body("category").notEmpty().withMessage("Category is required"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

exports.validateProductUpdate = [
  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  body("description")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),

  body("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


exports.validateCreateOrder = [
  body("products")
    .isArray({ min: 1 })
    .withMessage("Products must be an array with at least one item"),
  body("products.*.product")
    .notEmpty()
    .withMessage("Product name is required")
    .isString()
    .withMessage("Product name must be a string"),
  body("products.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be an integer of at least 1"),

  body("shippingInfo.address")
    .optional()
    .isString()
    .withMessage("Address must be a string"),
  body("shippingInfo.city")
    .optional()
    .isString()
    .withMessage("City must be a string"),
  body("shippingInfo.postalCode")
    .optional()
    .isString()
    .withMessage("Postal code must be a string"),
  body("shippingInfo.country")
    .optional()
    .isString()
    .withMessage("Country must be a string"),

  body("paymentInfo.method")
    .optional()
    .isString()
    .withMessage("Payment method must be a string"),

  body("status")
    .optional()
    .isIn(["pending", "processing", "shipped", "delivered", "cancelled"])
    .withMessage("Invalid order status"),

  body("deliveredAt")
    .optional()
    .isISO8601()
    .withMessage("DeliveredAt must be a valid date")
    .custom((value) => {
      const deliveredDate = new Date(value);
      const now = new Date();
      if (deliveredDate <= now) {
        throw new Error("DeliveredAt must be a future date");
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];


exports.validateUpdateOrder = [
  body("products")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Products must be an array with at least one item"),
  body("products.*.product")
    .optional()
    .notEmpty()
    .withMessage("Product name is required")
    .isString()
    .withMessage("Product name must be a string"),
  body("products.*.quantity")
    .optional()
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be an integer of at least 1"),

  body("shippingInfo.address")
    .optional()
    .isString()
    .withMessage("Address must be a string"),
  body("shippingInfo.city")
    .optional()
    .isString()
    .withMessage("City must be a string"),
  body("shippingInfo.postalCode")
    .optional()
    .isString()
    .withMessage("Postal code must be a string"),
  body("shippingInfo.country")
    .optional()
    .isString()
    .withMessage("Country must be a string"),

  body("paymentInfo.method")
    .optional()
    .isString()
    .withMessage("Payment method must be a string"),

  body("status")
    .optional()
    .isIn(["pending", "processing", "shipped", "delivered", "cancelled"])
    .withMessage("Invalid order status"),

  body("deliveredAt")
    .optional()
    .isISO8601()
    .withMessage("DeliveredAt must be a valid date"),
    // .custom((value) => {
    //   const deliveredDate = new Date(value);
    //   const now = new Date();
    //   if (deliveredDate <= now) {
    //     throw new Error("DeliveredAt must be a future date");
    //   }
    //   return true;
    // }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

exports.validateCreateReview = [
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("comment")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Comment must be less than 500 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

exports.validateUpdateReview = [
  body("rating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("comment")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Comment must be less than 500 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];





