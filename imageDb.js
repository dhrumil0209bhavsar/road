var mongoose = require('mongoose');
const CONSTANTS = require('./globals').constants;

mongoose.set('useCreateIndex', true);
mongoose.connect(CONSTANTS['mongoImage'], { useNewUrlParser: true });
mongoose.Promise = global.Promise;

const imageSchema = mongoose.Schema({
    img: { 
        data: Buffer, 
        contentType: String 
    },
    name: {
        type: String,
        required: true
    }
});

module.exports = {
    Image: mongoose.model('Image', imageSchema),
    imageSchema: imageSchema
}

// module.exports = exports = mongoose;