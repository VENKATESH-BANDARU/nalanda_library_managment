const { check } = require('express-validator');
const { Role: { ADMIN, MEMBER } } = require('../Helpers/constants')

class UserValidation {

    isEmailValid(value) {
        if (!value) {
            return false;
        }
        const atIndex = value.indexOf('@');
        return atIndex > 0 && atIndex === value.lastIndexOf('@') && atIndex < value.length - 1;
    };

    isValidEmailProvider(value) {
        const validProviders = ['gmail.com', 'gmail.in', 'yahoo.com', 'yahoo.in', 'outlook.com', 'outlook.in', 'hotmail.com', 'aol.com'];
        const emailDomain = value.split('@')[1];
        return validProviders.includes(emailDomain);
    };

    userRegisterValidation() {
        const fields = [
            check('name').trim().isString().notEmpty().withMessage('Name is required'),
            check('email').trim().isEmail().normalizeEmail({ gmail_remove_dots: false }).notEmpty().custom(this.isEmailValid)
                .custom(this.isValidEmailProvider).withMessage('A valid email is required.'),
            check('password').trim().isLength({ min: 6 }).notEmpty()
                .withMessage('Password is required and should be at least 6 characters long.'),
            check('role').trim().isIn([ADMIN, MEMBER]).optional()
                .withMessage(`Role must be either ${ADMIN} for Admin or ${MEMBER} for Member.`)
        ]
        return fields
    }

    userLoginValidation() {
        const field = [
            check('email').trim().isEmail().normalizeEmail({ gmail_remove_dots: false }).notEmpty().withMessage('A valid email is required.'),
            check('password').trim().isLength({ min: 6 }).notEmpty().withMessage('Password is required and should be at least 6 characters long.')
        ]
        return field
    }
}

module.exports = new UserValidation();