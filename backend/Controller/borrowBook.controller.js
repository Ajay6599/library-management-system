const { bookModel } = require("../Model/book.model");
const { borrowBookModel } = require("../Model/borrowBook.model");
const { studAdminModel } = require("../Model/stud-admin.model");

const borrowBookController = {
    borrowBook: async (req, res) => {
        const { userEmail, book_Id } = req.body;
        // console.log("Book Details");
        // console.log(book_Id);

        try {
            // find the book by its id;
            const book = await bookModel.findById(book_Id);

            // Check if the book exists or not
            if (!book) return res.status(400).send({
                success: false,
                msg: 'Book not found'
            });

            const user = await studAdminModel.findOne({ email: userEmail });
            console.log(user);

            if (!user) return res.status(400).send({
                success: false,
                msg: 'User not found'
            });

            // Check if there are enough available copies
            if (book.copiesAvailable === 0) {
                // book.status = 'Checked Out';
                return res.status(400).send({
                    success: false,
                    msg: 'Not enough available copies to borrow.'
                });
            }

            // Check isAlreadyBookBorrowed or not
            const isAlreadyBorrowed = user.borrowedBooks.find(
                (book) => book.bookId.toString() === book_Id && book.returned === false
            )

            if (isAlreadyBorrowed) {
                return res.status(400).json({
                    success: false,
                    message: 'You have already book borrowed.'
                });
            }

            // Check if the user has already borrowed 3 or more books
            // const borrowedBooksCount = await borrowBookModel.countDocuments({
            //     user: { id: user._id },
            //     status: { $ne: 'Return' }
            // });
            // console.log(borrowedBooksCount);
            // const returnBooks = await borrowBookModel.countDocuments({ status: "Return"});
            // console.log("returnBooks", returnBooks);

            // if ((borrowedBooksCount - returnBooks) >= 3) {
            //     return res.status(400).json({
            //         success: false,
            //         message: 'You cannot borrow more than 3 books at a time.'
            //     });
            // };

            user.borrowedBooks.push({
                bookId: book._id,
                bookTitle: book.title,
                borrowDate: new Date(),
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            })

            await user.save();

            // Create a new borrow record
            const borrow = new borrowBookModel({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                book: book_Id,
                // unit: 1,
                borrowDate: new Date(),
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });

            // Save the borrow record
            await borrow.save();

            // Update the book's available copies and borrowed count
            book.copiesAvailable -= 1;
            book.borrowedCount += 1;

            // 🔄 Automatically update status if no copies left
            book.status = book.copiesAvailable === 0 ? 'CheckedOut' : 'Available';

            // Save the updated book
            await book.save();

            return res.status(201).json({
                success: true,
                message: 'Book borrowed successfully!',
                borrow,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Server error while borrowing the book.',
            });
        }
        // const borrowedBooksCount = user.borrowedBooks.filter(
        //     (book) => book.returned === false
        // ).length;

        // if (borrowedBooksCount >= 3) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'You cannot borrow more than 3 books at a time.',
        //     });
        // }

    },
    returnBook: async (req, res) => {
        const { book_Id } = req.params; // Assuming you are sending borrowId in URL params
        const { userEmail, isReturn } = req.body;

        if (typeof isReturn !== 'boolean') {
            return res.status(400).send({
                success: false,
                msg: 'Invalid value for isReturn. It must be a boolean.'
            });
        }

        try {
            // find the book by its id;
            const book = await bookModel.findById(book_Id);

            // Check if the book exists or not
            if (!book) return res.status(400).send({
                success: false,
                msg: 'Book not found'
            });

            const user = await studAdminModel.findOne({ email: userEmail });
            console.log(user);

            if (!user) return res.status(400).send({
                success: false,
                msg: 'User not found'
            });

            const borrowBook = user.borrowedBooks.find(
                (book) => book.bookId.toString() === book_Id && book.returned === false
            )

            if (!borrowBook) {
                return res.status(400).json({
                    success: false,
                    message: 'You have not borrowed this book.'
                });
            }
            borrowBook.returned = isReturn;
            await user.save();

            // Update the book's available copies and borrowed count
            if (isReturn) {
                book.copiesAvailable += 1;
                book.borrowedCount -= 1;
            }

            // Save the updated book
            await book.save();

            // Find the borrow record by ID
            const borrow = await borrowBookModel.findOne({
                book: book_Id,
                'user.email': userEmail,
                returnDate: null,
            });

            if (!borrow) {
                return res.status(404).json({
                    success: false,
                    message: 'Borrow record not found.',
                });
            }

            // Set the return date
            if (isReturn) {
                borrow.returnDate = new Date();
                await borrow.save();
            }

            // Check if the user is the one who borrowed the book
            // if (borrow.user.toString() !== req.userAuth.id) {
            //     return res.status(403).json({
            //         success: false,
            //         message: 'You do not have permission to return this book.',
            //     });
            // }

            return res.status(200).json({
                success: true,
                message: isReturn ? 'Book returned successfully!' : 'Book return canceled.',
                borrow,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Server error while returning the book.',
            });
        }
    },
    getBorrowedBooks: async (req, res) => {
        try {
            // Get all borrow records for the logged-in user
            const borrowedBooks = await borrowBookModel.find().populate('book');

            console.log(borrowedBooks);

            if (!borrowedBooks.length) {
                return res.status(404).json({
                    success: false,
                    message: 'No borrowed books found.',
                });
            }

            return res.status(200).json({
                success: true,
                borrowedBooks,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Server error while fetching borrowed books.',
            });
        }
    },
    getBorrowedBooksByUser: async (req, res) => {
        try {
            const { borrowedBooks } = req.userAuth;

            return res.status(200).json({
                success: true,
                borrowedBooks,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Server error while fetching borrowed books.',
            });
        }
    },
    getBookDetails: async (req, res) => {
        const { borrowId } = req.params;
        try {
            // Find a specific borrow record by ID
            const borrow = await borrowBookModel.findById(borrowId).populate('book');

            if (!borrow) {
                return res.status(404).json({
                    success: false,
                    message: 'Borrow record not found.',
                });
            }

            return res.status(200).json({
                success: true,
                borrow,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Server error while fetching the borrow record.',
            });
        }
    },
}

module.exports = { borrowBookController };