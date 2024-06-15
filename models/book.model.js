const mongoose = require('mongoose');
const Schema = mongoose.Schema

const bookModel = new Schema({
    title: {
        type: String,
        default: null,
    },
    author: {
        type: String,
        default: null,
    },
    ISBN: {
        type: String,
        default: null,
    },
    publicationDate: {
        type: Date,
        default: null,
    },
    genre: {
        type: String,
        default: null,
    },
    copies: {
        type: Number,
        default: null,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', bookModel);