const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("DB connected succesfully"))
    .catch((error) => console.log(error));

module.exports = mongoose