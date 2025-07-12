const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    yearOfPublication: {
        type: Number,
        required: true
    },
    copiesAvailable: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ['Available', 'CheckedOut'],
        required: true,
        default: 'Available'
    },
    language: {
        type: String,        
        default: 'English'
    },
    borrowedCount: {
        type: Number,
        default: 0
    },
}, {versionKey: false});

const bookModel = mongoose.model('Book', bookSchema);

module.exports = { bookModel };