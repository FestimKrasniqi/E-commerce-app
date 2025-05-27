const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({ 
    senderAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },

    receiverAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    type: {
        type: String,
        enum: ['transfer', 'deposit', 'withdrawal'],
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
        required: true
    },

    description: {
        type: String,
        trim: true,
        maxlength: 500
    },

    transactionDate: {
        type: Date,
        default: Date.now,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);