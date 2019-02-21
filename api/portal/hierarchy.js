const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = require('../../db');
const CONSTANTS = require('../../globals').constants;

let getOfficerObjectByPhoneNo = async (phoneNo) => {
    //find roadToOfficer entry for given phone No
    let findOfficerQuery = db.Officer.findOne({ phoneNo: phoneNo });
    let findOfficerResult = await findOfficerQuery.exec();
    return findOfficerResult;
}

router.post('/setHierarchy', async (req, res) => {
    //checking for request params - senior_id and junior_id
    if (req.body.seniorNo && req.body.juniorNo) {
        let seniorNo = req.body.seniorNo;
        let juniorNo = req.body.juniorNo;

        // finding officers
        let senior = await getOfficerObjectByPhoneNo(seniorNo);
        let junior = await getOfficerObjectByPhoneNo(juniorNo);

        // creating new hierarchy
        let hierarchy = new db.OfficerHierarchy({
            senior_officer: senior,
            junior_officer: junior
        });

        //saving complaint to roadComplaintSchema
        if (junior && senior) {
            hierarchy.save((err, data) => {
                // we have both officers
                // setting relationship between them
                if (!err) {
                    if (data) {
                        console.log('hierarchy saved');
                        res.json({
                            success: true,
                            data: data.junior_officer.name + ' is now under ' + data.senior_officer.name
                        });
                    } else {
                        // might never be incurred
                        // included just for safety
                        res.json({
                            success: false,
                            data: "No data"
                        });
                    }
                } else {
                    res.json({
                        success: false,
                        data: "DB error occurred"
                    });
                }
            });
        } else {
            // junior or senior officer not found
            res.json({
                success: false,
                data: "Invalid junior or senior"
            });
        }

    } else {
        // missing credentials in req.body
        res.json({
            success: false,
            data: 'Please enter all credentials and try again...'
        });
    }
});


router.post('/getHierarchy', async (req, res) => {
    console.log(req.body);

    //check for required parameters in req.body
    if (req.body.phoneNo) {

        let junior = await getOfficerObjectByPhoneNo(req.body.phoneNo);
        //console.log(junior);

        //check if officer exists
        if (junior) {
            db.OfficerHierarchy.findOne({ junior_officer: junior }, (err, data) => {
                if (!err) {
                    if (data) {
                        //console.log(data.senior_officer);
                        db.Officer.findById(data.senior_officer, (err, data) => {
                            if (!err) {
                                if (data) {
                                    res.json({
                                        success: true,
                                        data: data.name
                                    });
                                }else{
                                    res.json({
                                        success: false,
                                        data: 'Senior Officer not found!'
                                    });
                                }
                            }
                        });

                    } else {
                        res.json({
                            success: false,
                            data: "This officer doesn't seem to have a senior"
                        });
                    }
                }
            });
        } else {
            console.log("invalid officer");

            res.json({
                success: false,
                data: 'Entered officer does not exist'
            })
        }

    } else {
        res.json({
            success: false,
            data: 'please enter no. of junior officer'
        });
    }
});

router.get('/getSeniorIds', async (req, res) => {
    if(!req.query.role) {
        res.json({
            success: false,
            data: '"role" required'
        });
        return;
    }
    let role = req.query.role;
    let rolesIndex = CONSTANTS.officersHierarchy.indexOf(role);

    if(rolesIndex < 0) {
        res.json({
            success: false,
            data: 'Invalid role'
        });
        return;
    }

    if(rolesIndex >= 4) {
        res.json({
            success: false,
            data: 'Officer is on top of the hierarchy'
        });
        return;
    }

    await db.Officer.find({ role: CONSTANTS.officersHierarchy[rolesIndex+1] })
    .select({ _id: 1, name: 1, role: 1 })
    .then(data => {
        console.log(data);
        res.json({
            success: true,
            data: data
        })        
    })
    .catch(err => {
        console.log(err);
        res.json({
            success: false,
            data: err
        })        
    })
});

router.get('/roads', async (req, res) => {
    await db.Road.find({ _id: { $exists: 1 } })
        .then(data => {
            res.json({
                success: true,
                data: data
            })
        })
        .catch(err => {
            console.log(err);
            res.json({
                success: false,
                data: err
            })            
        })
});


router.get('/getAllJrIds', async (req, res) => {

    let officerId = req.query.officerId;
    let officerWithData = [];
    let officers = [];
    let lvl = 0;

    let getJrs = async (id,callback) => {
        await db.OfficerHierarchy.find({ senior_officer: mongoose.Types.ObjectId(id) })
        .then(async data => {
            
            let ids = await data.map(data => {
                officers.push(String(data.junior_officer))
                return String(data.junior_officer);
            })
            lvl += ids.length;

            if(ids.length == 0 && lvl == 1) {
                callback();
                return 0;
            } else {
                ids.forEach(async id => {
                    await getJrs(id,callback);
                    lvl--;
                });
            }
        })
    }

    async function mCallback() {

        let promises = [];
        let mp = await officers.forEach(officer => {
            promises.push(db.Officer.findOne({ _id: mongoose.Types.ObjectId(officer) })
                .select({ 
                    "_id": 1, "name": 1, "email": 1, "phoneNo": 1, "role": 1,
                    "newComplaints": 1, "pending": 1, "emergency": 1, "completed": 1, "total": 1
                })
                .then(data => {
                    officerWithData.push(data);
                }));
        })

        Promise.all(promises)
            .then(() => {
                res.json({
                    success: true,
                    data: officerWithData
                })
            });
    }

    officers.push(officerId)
    await getJrs(officerId, mCallback);

});

module.exports = router;