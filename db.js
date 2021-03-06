module.exports = {
    User: require('./models/user'),
    Officer: require('./models/officer'),
    OfficerHierarchy: require('./models/officerHierarchy'),
    RoadToOfficer: require('./models/roadToOfficer'),
    Otp: require('./models/otp'),
    PostedUser: require('./models/postedUser').PostedUser,
    RoadComplaint: require('./models/roadComplaint').RoadComplaint,
    UpdatedComplaint: require('./models/updatedComplaint').UpdatedComplaint,
    Road: require('./models/roads').Road,
    Grievance: require('./models/grievance').Grievance,
    Rejection: require('./models/rejection').Rejection
};
