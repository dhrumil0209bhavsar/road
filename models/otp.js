const mongoose = require('mongoose');
const constants = require('../globals').constants;

const OtpSchema = mongoose.Schema({
    phoneNo: {
        type: String,
        required: true,
        unique: true
    },
    otpNo: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: constants.OTP_EXPIRATION });
module.exports = mongoose.model('Otp', OtpSchema);