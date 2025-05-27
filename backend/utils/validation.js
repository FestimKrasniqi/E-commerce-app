const {body, validationResult} = require('express-validator');

exports.validateUserRegistration = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),

    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either "user" or "admin"'),

    body('status')
        .optional()
        .isIn(['active', 'inactive', 'banned'])
        .withMessage('Status must be either "active", "inactive", or "banned"'),

    body('profile.phone')
        .optional()
        .isMobilePhone()
        .withMessage('Invalid phone number format'),

    body('profile.address')
        .optional()
        .isLength({ min: 5 })
        .withMessage('Address must be at least 5 characters long'),

    body('profile.city')
        .optional()
        .isLength({ min: 6 })
        .withMessage('City must be at least 6 characters long'),
    
    body('profile.country')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Country must be at least 6 characters long'),

    body('profile.dateOfBirth')
        .optional()
        .isDate()
        .custom((value) => {
            const today = new Date();
            const dob = new Date(value);
            if (dob >= today) {
                throw new Error('Date of birth must be in the past');
            }
            return true;
        })
         .withMessage('Invalid date format'),
        
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }


]

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


