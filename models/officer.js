const mongoose = require('mongoose');
// const roadComplaintSchema = require('./roadComplaint').roadComplaintSchema;
const mongoosePaginate = require('mongoose-paginate');

const officer = mongoose.Schema({

    //personal details
    name:               { type: String, required: true },
    phoneNo:            { type: String, required: true, unique: true },
    email:              { type: String, required: true },
    password:           { type: String, required: false, default: "$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW", },
    role:               { type: String, required: true, enum: [ 'Section Officer', 'Deputy Executive Engineer', 'Executive Engineer', 'Superintending Engineer', 'Chief Engineer', 'Admin' ] },
    
    //portal details
    nextWarningDate:    { type: Date, required: false },
    complaints:         { type: Array, default: [] },
    total:              { type: Number, default: 0 },
    newComplaints:      { type: Number, default: 0 },
    pending:            { type: Number, default: 0 },
    emergency:          { type: Number, default: 0 },
    completed:          { type: Number, default: 0 },
    isUpdated:          { type: Boolean, default: false },

    //new fields
    roadCode:               { type: String, required: true },
    fileName:               { type: String, required: true },


}, { timestamps: true });

officer.index({ "complaints.location": "2dsphere" });
officer.plugin(mongoosePaginate);
module.exports = mongoose.model('Officer', officer);