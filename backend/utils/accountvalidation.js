const {body, validationResult} = require('express-validator');

exports.validateAccountCreation = [
    body('accountType')
        .notEmpty()
        .withMessage('Account type is required')
        .isIn(['savings', 'checking', 'current', 'fixed'])
        .withMessage('Account type must be either "savings", "current", "checking" or "fixed"'),

    body('balance')
        .optional()
        .isNumeric()
        .withMessage('Balance must be a number')
        .custom((value) => value >= 0)
        .withMessage('Balance cannot be negative'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

exports.validateAccountUpdate = [
    body('accountType')
        .optional()
        .isIn(['saving', 'checking', 'current', 'fixed'])
        .withMessage('Account type must be either "saving", "current", "checking" or "fixed"'),

    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]