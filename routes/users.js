const router = require('express').Router();
const Users = require('../controller/user.controller');
const UserValidation = require('../validators/user.validation');

router.route('/register').post(UserValidation.userRegisterValidation(), Users.userRegistration);
router.route('/login').post(UserValidation.userLoginValidation(), Users.userLogin);


module.exports = router;
