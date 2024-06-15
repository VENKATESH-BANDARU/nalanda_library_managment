const mongoose = require('mongoose');
const Schema = mongoose.Schema

const borrowModel = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        default: null,
    },
    borrowDate: {
        type: Date,
        default: Date.now,
    },
    returnDate: {
        type: Date,
        default: null
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Borrow', borrowModel);
