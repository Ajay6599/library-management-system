const express = require('express');
const { lmsAuthMiddleware } = require('../Middleware/lmsAuth.middleware');
const { borrowBookController } = require('../Controller/borrowBook.controller');

const borrowRouter = express.Router();

const { authT, authR } = lmsAuthMiddleware;

borrowRouter.post('/borrow', authT, authR(['Admin']), borrowBookController.borrowBook);
borrowRouter.put('/returnBook/:book_Id', authT, authR(['Admin']), borrowBookController.returnBook);
borrowRouter.get('/all-borrowed-books', authT, authR(['Admin']), borrowBookController.getBorrowedBooks);
borrowRouter.get('/user-borrowed-books', authT, authR(['Student']), borrowBookController.getBorrowedBooksByUser);
borrowRouter.get('/borrowed-books/:id', authT, authR(['Admin, Student']), borrowBookController.getBookDetails);

module.exports = { borrowRouter };