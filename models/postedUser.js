const mongoose = require('mongoose');
const user = require('./user');

const postedUserSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = {
    PostedUser: mongoose.model('PostedUser', postedUserSchema),
    postedUserScheme: postedUserSchema
};