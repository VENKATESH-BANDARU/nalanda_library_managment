const router = require('express').Router();
const Books = require('../controller/book.controller');
const BooksValidation = require('../validators/books.validation');

router.route('/add').post(BooksValidation.bookAddValidation(), Books.addBook);
router.route('/get').get(Books.getAllBooks);
router.route('/update').post(Books.updateBook);
router.route('/single/:id').get(Books.singleBook);
router.route('/delete/:id').delete(Books.deleteBook);

module.exports = router;
