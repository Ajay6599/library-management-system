const mongoose = require('mongoose');

let studAdminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Student'],
        required: true,
        default: "Student"
    },
    borrowedBooks: [
        {
            bookId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'BorrowBooks'
            },
            returned: {
                type: Boolean,
                default: false
            },
            bookTitle: String,
            borrowDate: Date,
            dueDate: Date,
        }
    ]
}, {versionKey: false, timeStamps: true});

let studAdminModel = mongoose.model('LmsUsers', studAdminSchema);

module.exports = { studAdminModel };