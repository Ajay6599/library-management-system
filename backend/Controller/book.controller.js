const { bookModel } = require('../Model/book.model');
const mongoose = require('mongoose');

const bookController = {
    addBook: async(req, res) => {
        const { title,
            author,
            imageUrl,
            isbn,
            category,
            publisher,
            yearOfPublication,
            copiesAvailable,
            status,
            language } = req.body;

        try {
            let newBook = new bookModel({
                title,
                author,
                imageUrl,
                isbn,
                category,
                publisher,
                yearOfPublication,
                copiesAvailable,
                status,
                language,
            });

            console.log(newBook);
            await newBook.save();
            return res.status(200).send({msg: "Book has added successfully", addBook: newBook});
        } catch (error) {
            return res.status(500).send({msg:"Something went wrong while adding the new book", errors:error.message});
        }
    },
    addBulkBooks: async (req, res) => {
        try {
            let newBook = new bookModel.insertMany(req.body);
            await newBook.save();
            return res.status(200).send({msg: "All books have added successfully", addBook: newBook});
        } catch (error) {
            return res.status(400).send({msg:"Something went wrong while adding the new book", errors:error.message});
        }
    },
    getAllBooks: async(req, res) => {
        try {
            const getBooks = await bookModel.find();
            return res.status(200).send({avlBooks: getBooks});
        } catch (error) {
            return res.status(400).send({msg:"Something went wrong while adding the new book", errors:error.message});
        }
    },
    getBookById: async (req, res) => {
        const { id } = req.params;

        try {
            const getBook = await bookId.findById(id);

            if(!getBook) return res.status(200).send({msg: "Invalid Book id"});
            return res.status(200).send({avlBooks: getBook});
        } catch (error) {
            return res.status(400).send({Error: error});
        }
    },
    updateBookById:async (req, res) => {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ msg: 'Invalid book ID' });
        }

        try {
            await bookModel.findByIdAndUpdate(id, req.body);
            return res.status(200).send({ msg:"Book has updated successfully" });
        } catch (error) {
            return res.status(400).send({ msg:"Something went wrong while updating the book", Error:error.message });
        }
    },
    deleteBookById:async (req, res) => {
        const { id } = req.params;
        // console.log(id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ msg: 'Invalid book ID' });
        }

        try {
            let deletedBook = await bookModel.findByIdAndDelete(id);

            if(!deletedBook) {
                return res.status(404).send({msg: "Book Not Found"});
            }

            return res.status(200).send({msg:"Book has been deleted successfully"});
        } catch (error) {
            return res.status(500).send({msg:"Something went wrong while deleted the book", Error:error.message});
        }
    }
};

module.exports = { bookController };