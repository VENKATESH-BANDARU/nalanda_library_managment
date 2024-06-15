const router = require('express').Router();
const userRoute = require('./users');
const bookRoute = require('./book');
const borrowRoute = require('./borrow');
const { userVerifyToken } = require('../middleware/auth');

router.use('/user', userRoute);
router.use('/book', userVerifyToken, bookRoute);
router.use('/', userVerifyToken, borrowRoute);

module.exports = router;
