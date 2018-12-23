const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CONSTANTS = require('../../globals').constants;
const db = require('../../db');
const mongoose = require('mongoose');


// officer login route
router.post('/login', (req, res) => {
    if(!(req.body.phoneNo && req.body.password)) {
        res.json({
            success: false,
            data: "\"phoneNo\" and \"password\" required"
        });
        return
    }
    
    let phoneNo = req.body.phoneNo,
        password = req.body.password;

    // search for officer in db.Officer
    db.Officer.findOne({ phoneNo }, (err, data) => {
        if(err) {
            res.json({
                success: false,
                data: "Error occurred while finding officer"
            });
            return;
        }
        if(data) {
            // comparing password using bcryptjs
            if (bcrypt.compareSync(password, data.password)) {
                let user = {
                    _id: data._id,
                    phoneNo: data.phoneNo,
                    role: data.role,
                    aurthorizationUserRole: 'officer'
                };

                let loginType = data.role === 'Admin' ? 'admin' : 'officer'
                sendUserToken(req, res, user, loginType, data.role);
            } else {
                res.json({
                    success: false,
                    data: "Incorrect Password, Please check"
                });
            }
        } else {
            // phone no. not found in db.Officers
            res.json({
                success: false,
                data: "Please check your phone number or password and try again"
            });
        }
    });
});

// generating token
let sendUserToken = (req, res, data, loginType, officerRole) => {
    //let isUser = isNewUser;
    jwt.sign(data, CONSTANTS['SECRET_KEY'], (err, token) => {
        if (err) {
            console.log("Error on generating token (line no : 62", err);
            res.json({
                success: false,
                data: "Unknown Error"
            });
        } else {
            //send token in response
            res.json({
                success: true,
                data: token,
                role: officerRole,
                loginType: loginType
            });
        }
    });
}

// signup route
router.post('/signup', async (req, res) => {

    // check for all entered fields in request body
    if (req.body.name && req.body.email && req.body.phoneNo && req.body.password && req.body.role) {
        let name = req.body.name;
        let email = req.body.email;
        let phoneNo = req.body.phoneNo;
        let password = req.body.password;
        let role = req.body.role;

        if(role !== 'Admin') {
            if(role !== 'Chief Engineer' && !req.body.srOfficerId) {
                res.json({
                    success: false,
                    data: "\"srOfficerId\" not found"
                });
                return;
            }

            if(role === 'Section Officer' && !req.body.road_code) {
                res.json({
                    success: false,
                    data: "\"road_code\" not found"
                });
                return;
            }
        }

        // creating new user - Officer
        let user = new db.Officer({
            name: name,
            email: email,
            phoneNo: phoneNo,
            password: bcrypt.hashSync(password, 10),
            role: role,
        })

        // check if the entered phone no. already exists in db.Officers
        await db.Officer.findOne({ phoneNo: phoneNo })
            .then(data => {
                if(data) {
                    res.json({
                        success: false,
                        data: 'Phone number "' + phoneNo + '" already exists'
                    });
                    return;
                } else {
                    user.save()
                        .catch(err => {
                            console.log(err);
                            res.json({
                                success: false,
                                data: "Error Occurred while saving new user"
                            });
                            return;
                        })
                }
            })
            .catch(err => {
                console.log(err);
                res.json({
                    success: false,
                    data: "Error Occurred while saving new user"
                });
                return;
            })

        if(role === 'Section Officer') {

            // creating new roadToOfficer
            req.body.road_code.forEach(async road_code => {
                let road = new db.RoadToOfficer({
                    road_code: road_code,
                    officer: user._id
                })
    
                await db.RoadToOfficer.findOne({ "road_code": road_code })
                    .then(async data => {
                        if(!data) {
                            await road.save()
                                    .catch(err => {
                                        console.log(err);                    
                                        res.json({
                                            success: false,
                                            data: "Error Occurred while saving the road"
                                        });
                                        return;
                                    });
                        }
                    })
                    .catch(err => {
                        console.log(err);                    
                        res.json({
                            success: false,
                            data: "Error Occurred while allocating the road"
                        });
                        return;
                    })
            });
        }

        if(role === 'Chief Engineer' || role === 'Admin') {
            res.json({
                success: true,
                data: "New user saved to Officer",
                Officer_id: user._id
            });
            return;
        }

        let srOfficerId = mongoose.Types.ObjectId(req.body.srOfficerId);

        let connection = new db.OfficerHierarchy({
            senior_officer: srOfficerId,
            junior_officer: user._id
        });

        await connection.save()
            .then(data => {
                res.json({
                    success: true,
                    data: "New user saved to Officer",
                    Officer_id: user._id
                });
            })
            .catch(err => {
                console.log(err);
                res.json({
                    success: false,
                    data: "Error Occurred while adding hierarchy"
                });
                return;
            })
    } else {
        res.json({
            success: false,
            data: "Please  enter all credentials and try again..."
        });
    }
});


module.exports = router;