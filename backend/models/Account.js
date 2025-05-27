const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({ 

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    accountType: {
        type: String,
        enum: ['savings', 'current', 'fixed'],
        default: 'checking',
        required: true
    },

    balance: {
        type: Number,
        default: 0,
        required: true
    },


}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);