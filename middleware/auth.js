const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const Helpers = require('../Helpers/helper');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


class TokenVerification {
    async userVerifyToken(req, res, next) {
        try {
            if (req.headers && req.headers.authorization) {
                let token = req.headers.authorization.split(" ")[1];
                if (!token) return res.status(200).json(Helpers.failureMessage("No token"));
                let verify = jwt.verify(token, process.env.USER_JWT_SECRET);

                if (!verify) return res.status(200).json(Helpers.failureMessage("Access denied"));
                let id = verify.id;
                if (ObjectId.isValid(id)) {
                    let userData = await UserModel.findById(verify.id);
                    if (!userData) return res.status(200).json(Helpers.failureMessage("Enter valid token"));
                    if (token !== userData.token) {
                        return res.status(401).json({
                            message: "Failed",
                            StatusCode: 403,
                            data: "Use latest token"
                        });
                    }
                    req.user = userData;
                    next();
                }
            } else {
                return res.status(200).json(Helpers.failureMessage("Access denied"));
            }
        } catch (error) {
            return res.status(200).json(Helpers.failureMessage(error.message));
        }
    }
}
module.exports = new TokenVerification();