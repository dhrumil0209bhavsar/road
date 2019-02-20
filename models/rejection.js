const mongoose = require('mongoose');

const rejectionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});

module.exports = {
    Rejection: mongoose.model('Rejection', rejectionSchema),
    rejectionSchema: rejectionSchema
}
