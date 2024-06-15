const { check } = require('express-validator');

class BorrowValidation {
    bookBorrowValidation() {
        const fields = [
            check('bookId').trim().isMongoId().notEmpty().withMessage('Book ID is required.')
        ]
        return fields
    }
}

module.exports = new BorrowValidation();