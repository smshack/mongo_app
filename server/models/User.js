const mongoose = require('mongoose');

const UserSchemma = new mongoose.Schema({
    username: { type: String, required: true },
    name: {
        first: { type: String, required: true },
        last: { type: String, required: true }
    },
    age: Number,
    email: String
}, { timestapms: true })

const User = mongoose.model('user', UserSchemma);
module.exports = { User };