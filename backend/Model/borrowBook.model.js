const mongoose = require("mongoose");

const borrowBookSchema = mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LmsUsers',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
    },
    book: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Book'
    },
    unit: {
        type: Number,
        // required: true,
        default: 1
    },
    borrowDate: {
        type: Date,
        default: Date.now()
    },
    dueDate: {
        type: Date,
        required:true
    },
    returnDate: {
        type: Date,
        default: null
    },
}, {versionKey: false, timestamps: true});

const borrowBookModel = mongoose.model('BorrowBooks', borrowBookSchema);

module.exports = { borrowBookModel };