const router = require('express').Router();
const BorrowBooks = require('../controller/borrow.controller');
const BorrowValidation = require('../validators/borrow.validation')


router.route('/borrow').post(BorrowValidation.bookBorrowValidation(), BorrowBooks.booksBorrow);
router.route('/return/:id').post(BorrowBooks.returnBook);
router.route('/borrow/history').get(BorrowBooks.borrowHistory);
router.route('/borrowed_books').get(BorrowBooks.mostBorrowedBooks);
router.route('/user/active').get(BorrowBooks.mostActiveMembers);
router.route('/book/availability').get(BorrowBooks.bookAvailability);


module.exports = router;