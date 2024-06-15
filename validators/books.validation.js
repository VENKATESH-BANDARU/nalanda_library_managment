const { check } = require('express-validator');

class BooksValidation {
    bookAddValidation() {
        const fields = [
            check('title').trim().isString().notEmpty().withMessage('Title is required'),
            check('author').trim().isString().notEmpty().withMessage('Author is required.'),
            check('ISBN').trim().isString().notEmpty().withMessage('ISBN is required.'),
            check('publicationDate').trim().isDate().notEmpty().withMessage('Publication date is required.'),
            check('genre').trim().isString().notEmpty().withMessage('Genre is required.'),
            check('copies').trim().isNumeric().notEmpty().withMessage('Copies is required.'),
        ]
        return fields
    }
}

module.exports = new BooksValidation();