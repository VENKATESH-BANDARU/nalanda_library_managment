const path = require('path');
const mongoose = require(path.resolve('config', 'db.js'));
const Schema = mongoose.Schema
const Helpers = require('../Helpers/helper');
const { Role: { ADMIN, MEMBER } } = require('../Helpers/constants');

const userModel = new Schema({
    name: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        default: null,
        unique: true,
    },
    password: {
        type: String,
        default: null,
    },
    role: {
        type: Number,
        enum: [ADMIN, MEMBER], // 1 => Admin, 2 => Member
        default: 2,
    },
    token: {
        type: String,
        default: null,
    }
}, {
    timestamps: true
});

userModel.pre("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
        let hash = await Helpers.hashPasscode(this.password);
        this.password = hash
        next()
    } else {
        return next()
    }
});

module.exports = mongoose.model('User', userModel);
