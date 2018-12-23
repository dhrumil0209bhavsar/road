const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');


const roadToOfficer = mongoose.Schema({
    road_code: {
        type: String,
        required: true
    },
    officer: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Officer',
        required: true
    }
});

roadToOfficer.plugin(mongoosePaginate);
module.exports = mongoose.model('RoadToOfficer', roadToOfficer);
