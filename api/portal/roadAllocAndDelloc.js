const express = require('express');
const router = express.Router();
const db = require('../../db');

//allocation road to officers
router.post('/allocate_road', (req, res) => {

    // db.RoadToOfficer.find({}, (err, data) => {
    //     console.log(data);
    // });

    if (req.body.road_code) {
        let road_code = req.body.road_code;

        // creating new roadToOfficer
        let road = new db.RoadToOfficer({
            road_code: road_code,
            officer: req.userData._id
        })

        db.RoadToOfficer.findOne({ "road_code": road_code }, (err, data) => {
            if (!err) {
                if (data) {
                    console.log('not allocated');
                    res.json({
                        success: false,
                        data: 'Road "' + road_code + '" already allocated'
                    });
                }
                else {
                    //allocate road to officer
                    road.save((err, data) => {
                        if (!err) {
                            // new road saved successfully
                            //console.log('allocated');
                            res.json({
                                success: true,
                                data: "Road added successfully",
                            });
                        } else {
                            res.json({
                                success: false,
                                data: "Error Occurred while allocating the road"
                            });
                        }
                    });
                }
            }
        });
    } else {
        res.json({
            success: false,
            data: "Road Code Required"
        });
    }
});

// de-allocating roads from officers
router.post('/deallocate_road', (req, res) => {
    if (req.body.road_code) {
        let roadCode = req.body.road_code;
        db.RoadToOfficer.findOne({ road_code: roadCode }, (err, data) => {
            if (!err) {
                if (!data) {
                    // road code doesn't exist in record
                    res.json({
                        success: false,
                        data: 'Road "' + roadCode + '" not found'
                    });
                } else {
                    // de-allocate road
                    db.RoadToOfficer.remove({ road_code: roadCode }, (err, data) => {
                        if (!err) {
                            if (data) {
                                res.json({
                                    success: true,
                                    data: 'Road "' + roadCode + '" removed successfully'
                                });
                            } else {
                                res.json({
                                    success: false,
                                    data: 'An error occurred while removing'
                                });
                            }
                        }
                    });
                }
            }
        });
    } else {
        res.json({
            success: false,
            data: "Road Code Required"
        });
    }
});


module.exports = router;