const express = require('express');
const { lmsAuthMiddleware } = require('../Middleware/lmsAuth.middleware');
const { bookController } = require('../Controller/book.controller');

const bookRouter = express.Router();

const {authT, authR} = lmsAuthMiddleware;

bookRouter.post('/add', authT, authR(['Admin']), bookController.addBook);
bookRouter.post('/add/bulk-books', authT, authR(['Admin']), bookController.addBulkBooks);
bookRouter.get('/', bookController.getAllBooks);
bookRouter.get('/:id', bookController.getBookById);
bookRouter.put('/:id', authT, authR(['Admin']), bookController.updateBookById);
bookRouter.delete('/:id', authT, authR(['Admin']), bookController.deleteBookById);

module.exports = { bookRouter };