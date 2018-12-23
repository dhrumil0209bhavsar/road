const mongoose = require('mongoose');
const roadComplaintSchema = require('./roadComplaint').roadComplaintSchema;
const mongoosePaginate = require('mongoose-paginate');

const officer = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [
            'Section Officer',
            'Deputy Executive Engineer',
            'Executive Engineer',
            'Superintending Engineer',
            'Chief Engineer',
            'Admin'
        ],
        required: true
    },
    nextWarningDate: {
        type: Date,
        required: false
    },
    complaints: {
        type: Array,
        default: []
    },
    newComplaints: {
        type: Number,
        default: 0
    }

}, {
        timestamps: true
    }
);

officer.index({ "complaints.location": "2dsphere" });
officer.plugin(mongoosePaginate);
module.exports = mongoose.model('Officer', officer);