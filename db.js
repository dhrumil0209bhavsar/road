const mongoose = require('mongoose');
const CONSTANTS = require('./globals').constants;

mongoose.set('useCreateIndex', true);
mongoose.connect(CONSTANTS['mongoDBURL'], { useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {
    User: require('./models/user'),
    Officer: require('./models/officer'),
    OfficerHierarchy: require('./models/officerHierarchy'),
    RoadToOfficer: require('./models/roadToOfficer'),
    Otp: require('./models/otp'),
    PostedUser: require('./models/postedUser').PostedUser,
    RoadComplaint: require('./models/roadComplaint').RoadComplaint,
    UpdatedComplaint: require('./models/updatedComplaint').UpdatedComplaint,
    Road: require('./models/roads').Road
};
