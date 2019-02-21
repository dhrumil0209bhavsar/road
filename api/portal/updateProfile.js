const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const CONSTANTS = require('../../globals').constants;
const db = require('../../db');
const mongoose = require('mongoose');


// officer update profile route
router.post('/updateProfile', async (req, res) => {

    let officerID;

    if(req.query.byId == "1") {
        officerID = req.query.officerID;

        await db.RoadToOfficer.deleteMany({ "officer": mongoose.Types.ObjectId(officerID) })

        req.body.road_code.forEach(async road_code => {
            let road = new db.RoadToOfficer({
                road_code: road_code,
                officer: officerID
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

    } else {
        officerID = req.userData._id;
    }

    await db.Officer.findOne(
        { "_id": mongoose.Types.ObjectId(officerID) })
        .then(async data => {
            if (bcrypt.compareSync(req.body.password, data.password)) {
                await db.Officer.updateOne(
                    { "_id": officerID },
                    {
                        name: req.body.name,
                        email: req.body.email,
                        phoneNo: req.body.phoneNo,
                        password: req.body.newPassword === "" ? data.password : bcrypt.hashSync(req.body.newPassword, 10),
                        isUpdated: true
                    })
                    .then(data => {
                        res.json({
                            success: true,
                            data: "Your profile details has been updated"
                        });                        
                    })
                    .catch(err => {    
                        console.log(err);                
                        res.json({ success: false, data: "Something went wrong" });
                    });
            } else {
                res.json({
                    success: false,
                    data: "Incorrect Password, Please check"
                });
            }
        })
        .catch(err => {        
            console.log(err);            
            res.json({ success: false, data: "Something went wrong" });
        });
});



module.exports = router;