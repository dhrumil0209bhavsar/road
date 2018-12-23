const mongoose = require('mongoose');

const updatedComplaintsSchema = mongoose.Schema({
    // _id: mongoose.SchemaTypes.ObjectId,
    complaint_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    complaint_status: {
        type: String,
        required: true
    },
    estimated_date: {
        type: String,
        required: true
    },
    comments: {
        type: [String]
    },
    time: {
        type: String,
        required: true
    }
});

module.exports = {
    UpdatedComplaint: mongoose.model('UpdatedComplaint', updatedComplaintsSchema),
    updatedComplaintsSchema: updatedComplaintsSchema
}