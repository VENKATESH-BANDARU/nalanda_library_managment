const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class Helpers {
    async hashPasscode(passcode) {
        let password = await bcrypt.hashSync(passcode, 12);
        return password
    }

    async comparePasscode(old, current) {
        let verifyPassword = await bcrypt.compareSync(old, current);
        return this.comparePasscode
    }

    async generateToke(payload, secret) {
        let token = await jwt.sign(payload, secret, { expiresIn: '1d' });
        return token
    }

    createMessage(data) {
        let message = "Success"
        let statusCode = 201
        return { message, statusCode, data }
    }

    successMessage(data) {
        let message = "Success"
        let statusCode = 200
        return { message, statusCode, data }
    }

    failureMessage(data) {
        let message = "Failure"
        let statusCode = 400
        return { message, statusCode, data }
    }

    notFoundMessage(data) {
        let message = "Failure"
        let statusCode = 404
        return { message, statusCode, data }
    }

    accessDeniedfailureMessage(data) {
        let message = "Failed";
        let StatusCode = 403;
        if (data == "jwt expired") {
            return { message, StatusCode: 401, data };
        }
        return { message, StatusCode, data };
    }
}

module.exports = new Helpers();