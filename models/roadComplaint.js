const mongoose = require('mongoose');
const postedUserSchema = require('./postedUser').postedUserSchema;
const mongoosePaginate = require('mongoose-paginate');

const roadComplaintSchema = mongoose.Schema({
    // _id: mongoose.SchemaTypes.ObjectId,
    road_code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    grievType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        require: true
    },
    location: {
        type: Array,
        type: [Number],
        required: true
    },
    complaint_status: {
        type: String,
        enum: [
            'Pending',
            'Approved',
            'Rejected',
            'In Progress',
            'Completed'
        ],
        default: 'Pending',
        required: true
    },
    estimated_completion: {
        type: Date,
        required: false
    },
    isEmergency: {
        type: Boolean,
        required: true,
        default: false
    },
    comments: {
        type: [String],
        default: []
    },
    postedUsers: {
        type: Array,
        ref: 'PostedUser',
        required: false,
        type: [postedUserSchema],
        required: false
    },
    time: {
        type: Date,
        default: Date.now
    }
});



roadComplaintSchema.plugin(mongoosePaginate);
module.exports = {
    RoadComplaint: mongoose.model('RoadComplaint', roadComplaintSchema),
    roadComplaintSchema: roadComplaintSchema
}