const mongoose = require('mongoose');


const roadSchema = mongoose.Schema({
    road_code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    }
});

module.exports = {
    Road: mongoose.model('Road', roadSchema),
    roadSchema: roadSchema
}
