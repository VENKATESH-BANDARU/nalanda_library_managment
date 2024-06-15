const userModel = require('../models/user.model');
const bookModel = require('../models/book.model');
const borrowModel = require('../models/borrow.model');
const Helpers = require('../Helpers/helper');


module.exports = {
    Query: {
        users: async () => {
            return await userModel.find();
        },
        books: async (parent, { page = 1, limit = 10, title, author, ISBN, publicationDate, genre, copies }) => {
            const query = {};
            if (title) query.title = { $regex: title, $options: 'i' }
            if (author) query.author = { $regex: author, $options: 'i' }
            if (ISBN) query.ISBN = { $regex: ISBN, $options: 'i' }
            if (publicationDate) query.publicationDate = { $regex: publicationDate, $options: 'i' }
            if (genre) query.genre = { $regex: genre, $options: 'i' }
            if (copies) query.copies = { $regex: copies, $options: 'i' }

            return await bookModel.find(query)
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();
        },
        borrowHistory: async (parent, args, { user }) => {
            if (!user) throw new Error('Not authenticated');
            return await borrowModel.find({ user: user.id }).populate('book');
        },
    },
    Mutation: {
        register: async (parent, { name, email, password }) => {
            let user = await userModel.findOne({ email });
            if (user) {
                throw new Error('User already exists');
            }

            user = await new userModel({ name, email, password }).save();

            const payload = {
                id: userData._id,
                role: userData.role
            };

            const token = Helpers.generateToke(payload, process.env.USER_JWT_SECRET);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            let user = await userModel.findOne({ email });
            if (!user) {
                throw new Error('Invalid credentials');
            }

            const isMatch = await Helpers.comparePasscode(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

            const token = Helpers.generateToke(payload, process.env.USER_JWT_SECRET);

            return { token, user };
        },
        addBook: async (parent, { title, author, ISBN, publicationDate, genre, copies }) => {
            const book = await new bookModel({ title, author, ISBN, publicationDate, genre, copies }).save();
            return book;
        },
        updateBook: async (parent, { id, title, author, ISBN, publicationDate, genre, copies }) => {
            let book = await bookModel.findById(id);
            if (!book) {
                throw new Error('Book not found');
            }

            book.title = title || book.title;
            book.author = author || book.author;
            book.ISBN = ISBN || book.ISBN;
            book.publicationDate = publicationDate || book.publicationDate;
            book.genre = genre || book.genre;
            book.copies = copies || book.copies;

            await book.save();
            return book;
        },
        deleteBook: async (parent, { id }) => {
            let book = await bookModel.findById(id);
            if (!book) {
                throw new Error('Book not found');
            }

            await bookModel.remove();
            return 'Book removed';
        },
        borrowBook: async (parent, { bookId }, { user }) => {
            if (!user) throw new Error('Not authenticated');

            const book = await bookModel.findById(bookId);
            if (!book) {
                throw new Error('Book not found');
            }

            if (book.copies < 1) {
                throw new Error('No copies available');
            }

            const borrow = new borrowModel({ user: user.id, book: bookId });
            await borrow.save();

            book.copies -= 1;
            await book.save();

            return borrow;
        },
        returnBook: async (parent, { borrowId }, { user }) => {
            if (!user) throw new Error('Not authenticated');

            const borrow = await borrowModel.findById(borrowId);
            if (!borrow) {
                throw new Error('Borrow record not found');
            }

            borrow.returnDate = new Date();
            await borrow.save();

            const book = await bookModel.findById(borrow.book);
            book.copies += 1;
            await book.save();

            return borrow;
        },
    },
};
