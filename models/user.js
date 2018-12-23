const mongoose = require('mongoose');
const Officer = require('./officer');
const updatedComplaintsSchema = require('./updatedComplaint').updatedComplaintsSchema;

const user = mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    email: {
        type: String,
        required: false
    },
    updatedComplaints: {
        type: [ updatedComplaintsSchema ],
        required: false,
        default: []
    },
    complaintOfficers: {
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'Officer',
        default: []
    },
    time: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('User', user);