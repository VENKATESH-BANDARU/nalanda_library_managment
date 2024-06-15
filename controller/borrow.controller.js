const borrowModel = require('../models/borrow.model');
const bookModel = require('../models/book.model');
const Helpers = require('../Helpers/helper');
const { validationResult } = require('express-validator');


class BorrowBooks {
    async booksBorrow(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { bookId } = req.body;
        const userId = req.user.id;
        try {
            const book = await bookModel.findById(bookId);
            if (!book) return res.status(200).json(Helpers.notFoundMessage('Book not found'));

            if (book.copies < 1) {
                return res.status(200).json(Helpers.failureMessage('No copies available'));
            }

            const borrow = await new borrowModel({ userId: userId, bookId: bookId }).save();

            book.copies -= 1;
            await book.save();

            res.status(200).json(Helpers.successMessage(borrow));
        } catch (error) {
            res.status(400).json(Helpers.failureMessage(error.message));
        }
    }

    async returnBook(req, res) {
        const { id } = req.params;

        try {
            const borrow = await borrowModel.findById(id);
            if (!borrow) return res.status(200).json(Helpers.notFoundMessage('Borrow record not found'));

            borrow.returnDate = new Date();
            await borrow.save();

            const book = await bookModel.findOne(borrow.bookId);
            book.copies += 1;
            await book.save();

            res.status(200).json(Helpers.successMessage(borrow));
        } catch (error) {
            console.log(error)
            res.status(400).json(Helpers.failureMessage(error.message));
        }
    }

    async borrowHistory(req, res) {
        const { page = 1, limit = 10 } = req.query;
        const userId = req.user.id;
        try {
            const history = await borrowModel.find({ userId: userId }).populate('bookId')
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();;
            const total = await borrowModel.countDocuments({ userId: userId });
            res.status(200).json(Helpers.successMessage({ history, total }));
        } catch (error) {
            res.status(400).json(Helpers.failureMessage(error.message));
        }
    }

    async mostBorrowedBooks(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;

            const result = await borrowModel.aggregate([
                {
                    $group: {
                        _id: '$bookId',
                        count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: 'books',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'book'
                    }
                },
                { $unwind: '$book' },
                {
                    $sort: {
                        count: -1
                    }
                },
                { $skip: skip },
                { $limit: limit }
            ]);
            res.status(200).json(Helpers.successMessage(result));
        } catch (error) {
            res.status(400).json(Helpers.failureMessage(error.message));
        }
    }

    async mostActiveMembers(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;

            const result = await borrowModel.aggregate([
                {
                    $group:
                    {
                        _id: '$userId',
                        count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'user',
                        pipeline: [
                            {
                                $project: {
                                    token: 0, password: 0
                                }
                            }
                        ]
                    }
                },
                { $unwind: '$user' },
                {
                    $sort:
                    {
                        count: -1
                    }
                },
                { $skip: skip },
                { $limit: limit }
            ]);
            res.status(200).json(Helpers.successMessage(result));
        } catch (error) {
            res.status(400).json(Helpers.failureMessage(error.message));
        }
    }

    async bookAvailability(req, res) {
        try {
            const totalBooks = await bookModel.countDocuments();
            const borrowedBooks = await borrowModel.aggregate([
                {
                    $group:
                    {
                        _id: '$bookId',
                        count:
                        {
                            $sum: 1
                        }
                    }
                },
            ]);
            const borrowedCount = borrowedBooks.reduce((acc, curr) => acc + curr.count, 0);
            const availableBooks = totalBooks - borrowedCount;
            res.status(200).json(Helpers.successMessage({
                totalBooks,
                borrowedBooks: borrowedCount,
                availableBooks,
            }));
        } catch (error) {
            res.status(400).json(Helpers.failureMessage(error.message));
        }
    }
}

module.exports = new BorrowBooks();