const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../../db');
const verify = require('../../middlewares/aurthorization').verify;

router.use(verify);

router.post('/officer/complaints/', (req, res) => {
    console.log(req.query);

    // showing complaints
    let size = 2;  // <size> responses at a time
    let page = 1;
    if (req.query.pageNo) {
        page = parseInt(req.query.pageNo);
        console.log('using request page no...');
    }
    if (page < 0 || page === 0) {
        console.log('invalid page error');
        res.json({
            success: false,
            data: "Invalid Page No."
        });
    } else {
        if (req.query.q) {
            db.RoadToOfficer.find({ officer: req.userData._id }, (err, data) => {
                console.log(data);
                if (!err) {
                    if (data) {
                        db.RoadComplaint.paginate({ $and: [q, { "road_code": data.road_code }] }, { page: page, limit: size }, (err, data) => {
                            if (!err) {
                                if (data) {
                                    if (data.docs.length <= 0) {
                                        res.json({
                                            success: true,
                                            data: "You Have no complaints here"
                                        });
                                    } else {
                                        res.json({
                                            success: true,
                                            data: data.docs
                                        })
                                    }
                                } else {
                                    console.log('No data found');
                                    res.json({
                                        success: false,
                                        data: "It's lonely here...no complaints found!"
                                    });
                                }
                            } else {
                                console.log('Database error while querying paginate');
                            }
                        });
                    } else {
                        console.log('Permission denied');
                        req.json({
                            success: false,
                            data: "Permission Denied"
                        });
                    }
                } else {
                    console.log('Database error while validating officer');
                }
            });
        } else {
            db.RoadToOfficer.find({ officer: req.userData._id }, (err, data) => {
                console.log(data);
                if (!err) {
                    if (data) {
                        console.log(data[0].road_code);
                        db.RoadComplaint.find({}, (err, data) => {
                            console.log(data);
                        });
                        db.RoadComplaint.paginate({ $and: [{}, { road_code: data[0].road_code }] }, { page: page, limit: size }, (err, data) => {
                            if (!err) {
                                if (data) {
                                    console.log('sending data ' + data.docs.length);

                                    if (data.docs.length <= 0) {
                                        res.json({
                                            success: true,
                                            data: "You Have no complaints here"
                                        });
                                    } else {
                                        res.json({
                                            success: true,
                                            data: data.docs
                                        })
                                    }
                                } else {
                                    console.log('No data found');
                                    res.json({
                                        success: false,
                                        data: "It's lonely here...no complaints found!"
                                    });
                                }
                            } else {
                                console.log('Database error while querying default query');
                                console.log(err);
                            }
                        });
                    } else {
                        console.log('Permission denied');
                        req.json({
                            success: false,
                            data: "Permission Denied"
                        });
                    }
                } else {
                    console.log('Database error while validating officer');
                }
            });
        }
    }
});

module.exports = router;