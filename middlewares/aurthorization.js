const jwt = require('jsonwebtoken');

let verify = (req, res, next) => {
    let header = req.headers['auth'];

    if (typeof header === 'undefined') {
        //send forbidden error, message : token not found
        res.sendStatus(403);
        return;
    } else {
        let head = header.split(" ");
        let token = head[1];
        //validate
        jwt.verify(token, require('../globals').constants['SECRET_KEY'], (err, data) => {
            if (err) {
                //send error message
                res.sendStatus(403);
                return;
            } else {
                req.userData = data;          
                next();
            }
        });
    }
}

module.exports = {
    verify: verify
}