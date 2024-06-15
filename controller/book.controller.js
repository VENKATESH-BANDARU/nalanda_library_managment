const bookModel = require('../models/book.model');
const borrowModel = require('../models/borrow.model');
const Helpers = require('../Helpers/helper');
const { validationResult } = require('express-validator');


class Books {
    async addBook(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { title, author, ISBN, publicationDate, genre, copies } = req.body;
        try {
            if (req.user.role === 2) return res.status(200).json(Helpers.accessDeniedfailureMessage("Access denied"));
            let book = await bookModel.findOne({ ISBN: { $regex: new RegExp(ISBN, 'i') } });
            if (book) return res.status(200).json(Helpers.notFoundMessage("ISBN already saved in database"));
            const bookData = await new bookModel({ title, author, ISBN, publicationDate, genre, copies }).save();
            res.status(200).json(Helpers.createMessage("Book added successfully"))
        } catch (error) {
            console.log(error)
            res.status(400).json(Helpers.failureMessage(error.message));
        }
    }

    async updateBook(req, res) {
        const body = req.body;
        try {
            if (req.user.role === 2) return res.status(200).json(Helpers.accessDeniedfailureMessage("Access denied"));
            let bookData = await bookModel.findById(body.id);
            if (!bookData) return res.status(200).json(Helpers.notFoundMessage("Book not found"));
            let book = await bookModel.findOne({ _id: { $ne: body.id }, ISBN: { $regex: new RegExp(body.ISBN, 'i') } });
            if (book && body.ISBN) return res.status(200).json(Helpers.notFoundMessage("ISBN already saved in database"));
            bookData = await bookModel.findByIdAndUpdate(body.id, body, { new: true });
            res.status(200).json(Helpers.successMessage("Book data Updated"));
        } catch (error) {
            console.log(error)
            res.status(400).json(Helpers.failureMessage(error.message));
        }
    }

    async getAllBooks(req, res) {
        const { page = 1, limit = 10, title, author, ISBN, publicationDate, genre, copies } = req.query;

        const query = {};
        if (title) query.title = { $regex: title, $options: 'i' }
        if (author) query.author = { $regex: author, $options: 'i' }
        if (ISBN) query.ISBN = { $regex: ISBN, $options: 'i' }
        if (publicationDate) query.publicationDate = { $regex: publicationDate, $options: 'i' }
        if (genre) query.genre = { $regex: genre, $options: 'i' }
        if (copies) query.copies = { $regex: copies, $options: 'i' }

        try {
            const booksData = await bookModel.find(query)
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();
            let total = await bookModel.countDocuments(query);
            res.status(200).json(Helpers.successMessage({ booksData, total }));
        } catch (error) {
            console.log(error)
            res.status(400).json(Helpers.failureMessage(error.message));
        }
    }

    async singleBook(req, res) {
        const { id } = req.params;
        try {
            const book = await bookModel.findById(id);
            if (!book) return res.status(200).json(Helpers.notFoundMessage("Book not found"));
            res.status(200).json(Helpers.successMessage(book));
        } catch (error) {
            res.status(400).json(Helpers.failureMessage(error.message));
        }
    }

    async deleteBook(req, res) {
        const { id } = req.params;
        try {
            if (req.user.role === 2) return res.status(200).json(Helpers.accessDeniedfailureMessage("Access denied"));
            const borrow = await borrowModel.findOne({ bookId: id });
            if (borrow && borrow.returnDate === null) return res.status(200).json(Helpers.failureMessage("User not return the book, You have to delete after user return the book."))
            const book = await bookModel.findByIdAndDelete(id);
            if (!book) return res.status(200).json(Helpers.notFoundMessage("Book not found"));
            const borrowBook = await borrowModel.findOneAndDelete({ bookId: id });
            res.status(200).json(Helpers.successMessage("Book deleted"));
        } catch (error) {
            res.status(400).json(Helpers.failureMessage(error.message));
        }
    }
}

module.exports = new Books();