const userModel = require('../models/user.model');
const Helpers = require('../Helpers/helper');
const { validationResult } = require('express-validator');


class Users {
    async userRegistration(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password, role } = req.body;
        try {
            let userData = await userModel.findOne({ email });
            if (userData) return res.status(200).json(Helpers.failureMessage('User already exists'));

            userData = await new userModel({ name, email, password, role }).save();
            res.status(200).json(Helpers.createMessage("User registration successfully"));
        } catch (error) {
            res.status(400).json(Helpers.failureMessage(error.message));
        }
    }

    async userLogin(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            let userDetails = await userModel.findOne({ email });
            if (!userDetails) return res.status(200).json(Helpers.failureMessage('Invalid credentials'));

            const verify = await Helpers.comparePasscode(password, userDetails.password);
            if (!verify) return res.status(200).json(Helpers.failureMessage('Invalid credentials'));

            const payload = {
                id: userDetails._id,
                role: userDetails.role
            };

            let accessToken = await Helpers.generateToke(payload, process.env.USER_JWT_SECRET);
            userDetails.token = accessToken
            userDetails = await userDetails.save();
            res.status(200).json(Helpers.successMessage(accessToken))
        } catch (error) {
            res.status(400).json(Helpers.failureMessage(error.message));
        }
    }
}

module.exports = new Users();