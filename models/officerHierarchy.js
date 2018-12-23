const mongoose = require('mongoose');
const Officer = require('./officer');


const officerHierarchy = mongoose.Schema({
    senior_officer: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Officer',
        required: true
    },
    junior_officer: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Officer',
        required: true
    }
});

module.exports = mongoose.model('OfficerHierarchy', officerHierarchy);