const express = require('express');
const router = express.Router();
const CONSTANTS = require('../../globals').constants;
const db = require('../../db');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
const getFormatedDate = CONSTANTS.getFormatedDate;

router.get('/newComplaintsCount', async (req, res) => {
    await db.Officer.findOne(
        { "_id": mongoose.Types.ObjectId(req.userData._id)})
        .then(data => {
            res.json({
                success: true,
                data: data.newComplaints
            })
            return;
        })
        .catch(err => {
            console.log(err);
            res.json({
                success: false,
                data: err
            })
            return;
        })
})

router.post('/updateComplaint', async (req, res) => {
    const complaint_id = req.body.complaint_id;
    const complaint_status = req.body.complaint_status;
    const isEmergency = req.body.isEmergency;
    const estimated_completion = new Date(req.body.estimated_completion);
    const comment = req.body.comment;
    
    console.log(comment);
    
    

    await db.Officer.findOneAndUpdate(
        { "_id": mongoose.Types.ObjectId(req.userData._id),
          "complaints._id": mongoose.Types.ObjectId(complaint_id) },
        { 
            $set: {
                "complaints.$.isEmergency": isEmergency, 
                "complaints.$.complaint_status": complaint_status,
                "complaints.$.estimated_completion": estimated_completion,
                "complaints.$.comments": (comment == null) ? []: [comment]
            },
            // $push: { "complaints.$.comments": comment }
        }
    )
    .then(async data => {

        await db.Officer.aggregate([
            { "$match": { "_id": mongoose.Types.ObjectId(req.userData._id) } },
            { "$unwind": "$complaints" },
            { "$match": { "complaints._id":  mongoose.Types.ObjectId(complaint_id) } },
            { "$project": { "complaints": 1 } }
        ])
            .then(async data => {
                await data[0].complaints.postedUsers.forEach(async postedUser => {
                    console.log(postedUser);                   
                    let updatedUserComplaint = new db.UpdatedComplaint({
                        _id: complaint_id,
                        complaint_status: complaint_status,
                        estimated_date: getFormatedDate(estimated_completion),
                        comments: [comment],
                        time: getFormatedDate(new Date()),
                    })
                    
                    await db.User.updateOne(
                        { "_id":  mongoose.Types.ObjectId(postedUser.userId) },
                        { $addToSet: { "updatedComplaints": updatedUserComplaint } }
                    )
                    .then(data => {
                        console.log(data);
                    })
                    .catch(err => {
                        console.log(err);                        
                        res.json({
                            success: false,
                            data: err
                        })
                    })
                })

                await res.json({
                    success: true,
                    data: "ok"
                })
                
            })
            .catch(err => {
                console.log(err);
                res.json({
                    success: false,
                    data: "Something went wrong"
                })                
            })
    })
    .catch(err => {
        res.json({
            success: false,
            data: err.message
        })
    })
});

router.post('/viewComplaint', async (req, res) => {
    const complaint_id = req.body.complaint_id;
    if (complaint_id) {

        //Alternative query
        // await db.Officer.find(
        //     { _id: req.userData._id },
        //     { complaints: { $elemMatch: { "complaints._id":  complaint_id } }
        // })

        await db.Officer.aggregate([
            { "$match": { "_id": mongoose.Types.ObjectId(req.userData._id) } },
            { "$unwind": "$complaints" },
            { "$match": { "complaints._id":  mongoose.Types.ObjectId(complaint_id) } },
            { "$project": { "complaints": 1 } }
        ])
            .then(data => {
                res.json({
                    success: true,
                    data: data[0].complaints
                });
            })
            .catch(err => {
                console.log(err);
                res.json({
                    success: false,
                    data: "Something went wrong"
                })                
            })
    } else {
        res.json({
            success: false,
            data: "Complaint ID required"
        })
    }
});

router.get('/getComplaints', async (req, res) => {
    //check if response should go paginated or not
    let isPaginated = req.query.isPaginated || "1";
    let withPagination = () => {
        if(isPaginated == "1") {
            //get page number and page size
            let page = parseInt(req.query.page) || 0;
            let size = parseInt(req.query.size) || 5;
            //return projection to main query
            return { _id: 1, complaints: { $slice: [ page * size, size ] } }
        }
        return { _id: 1, complaints: 1}
    }
    
    await db.Officer.findOne(
        { "_id": req.userData._id },
        withPagination() )//pagination preprocess)
        .then(data => {
            //send data
            setTimeout(() => {
                res.json({
                    success: true,
                    length: data.complaints.length,//send length
                    complaints: data.complaints.reverse()//array of complaints
                })
            }, 1000);

            db.Officer.findOneAndUpdate(
                { "_id": mongoose.Types.ObjectId(req.userData._id)},
                { $set: { "newComplaints": 0 } })
                .then(data => {
                    console.log(data);                    
                    return;
                })
                .catch(err => {
                    console.log(err)
                    return;
                })
        })
        .catch(err => {
            console.log(err);            
            res.json({
                success: false,
                data: "Something went wrong"
            });
        });
});


router.get('/getJrOfficerComplaints', async (req, res) => {
    
    let officerIds = req.query.officerIds;
    if(officerIds)
        officerIds = officerIds.split(';');
    else
        officerIds = [];
    officerIds = [...officerIds, req.userData._id];

    let officerIdQuery = officerIds => {
        return officerIds.map(officerId => {
            return { _id: officerId }
        });
    }

    console.log(officerIds)

    console.log(officerIdQuery(officerIds));
    
    
    await db.Officer.find(
        { "$or" : officerIdQuery(officerIds) },
        { _id: 1, complaints: 1})
            .then(data => {
                resData = [];
                for(let i = 0;i< data.length; i++) {
                    resData.push(...data[i].complaints);
                }

                // data.forEach(data => { resData.push(...data.complaints); });
                console.log(resData, resData.length);
                
                res.json({
                    success: true,
                    length: resData.length,//send length
                    complaints: resData//array of complaints
                });
            })
            .catch(err => {
                console.log(err);            
                res.json({
                    success: false,
                    data: "Something went wrong"
                });
            });
});


router.get('/pageComplaints', (req, res) => {
    console.log(req.query);

    // db.Officer.findById(req.userData._id, (err, data) => {
    //     console.log(data.complaints);
    // });

    // default parameters
    let size = 2;
    let page = 1;
    let road = 1;
    let q = {};

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
            q = req.query.q;
        }

        if (req.query.road) {
            road = req.query.road;
        }

        let options = {
            sort: { date: -1 },
            page: page,
            limit: size,
        }

        //show complaints
        db.Officer.findById(req.userData._id, (err, data) => {
            if (!err) {
                if (data) {

                    if (data.complaints.length <= 0) {
                        res.json({
                            success: true,
                            data: "No complaints found for officer"
                        });
                    }
                    else {
                        //getting road codes under officer
                        db.RoadToOfficer.find({ officer: req.userData._id }, (err, data) => {
                            if (!err) {
                                if (data) {
                                    console.log(data[road].road_code);

                                    let query = { $and: [{}, { road_code: data[road].road_code }] };
                                    db.RoadComplaint.paginate(query, options, (err, data) => {
                                        if (!err) {
                                            if (data) {
                                                //console.log('Got #complaints = ' + data.docs[0].complaints.length);
                                                console.log(data);

                                                if (data.docs.length <= 0) {
                                                    res.json({
                                                        success: true,
                                                        data: "You Have no complaints here"
                                                    });
                                                } else {
                                                    res.json({
                                                        success: true,
                                                        data: data.docs
                                                    });
                                                }
                                            } else {
                                                console.log('No data found');
                                                res.json({
                                                    success: false,
                                                    data: "It's lonely here...no complaints found!"
                                                });
                                            }
                                        } else {
                                            console.log('Database error while querying...');
                                            console.log(err);
                                        }
                                    });
                                }
                            }
                        });

                    }

                } else {
                    res.json({
                        success: false,
                        data: "Officer not found"
                    });
                }
            }
        });
    }
})

router.post('/forewordComplaint', async (req, res) => {
    if(req.body.officerId && req.body.complaint_id) {

        await db.Officer.aggregate([
            { "$match": { "_id": mongoose.Types.ObjectId(req.userData._id) } },
            { "$unwind": "$complaints" },
            { "$match": { "complaints._id":  mongoose.Types.ObjectId(req.body.complaint_id) } },
            { "$project": { "complaints": 1 } }
        ])
            .then(async data => {
                let complaint = data[0].complaints;
                await db.Officer.updateOne(
                    { _id: req.body.officerId }, //find officer document
                    { $push: { complaints: complaint }, //push new complaint in document
                      $inc: { newComplaints: 1 } }) //increament new complaint counter
                    .then(async data => { 
                        await db.Officer.updateOne(
                            { "_id": mongoose.Types.ObjectId(req.userData._id) },
                            { "$pull": { complaints: { "_id": mongoose.Types.ObjectId(req.body.complaint_id) } } }
                        )
                            .then(async data => {
                                res.json({
                                    success: true,
                                    data: data
                                })
                            })
                        // console.log("Complaint added to Officer's Complaints array"); 
                    })
                    .catch(err => { console.log(err); res.json({ success: false, data: "Something went wrong" }); return -1; });
            })
            .catch(err => {
                console.log(err);
                res.json({
                    success: false,
                    data: "Something went wrong"
                })                
            })
        
    } else {
        res.json({
            success: false
        })
    }
})

module.exports = router;