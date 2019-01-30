const mongoose = require('mongoose');

const grievanceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    duration: {
        type: Number,
        required: true
    }
});

module.exports = {
    Grievance: mongoose.model('Grievance', grievanceSchema),
    grievanceSchema: grievanceSchema
}
