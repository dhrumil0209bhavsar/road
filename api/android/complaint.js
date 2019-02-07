const express = require('express');
const router = express.Router();
const CONSTANTS = require('../../globals').constants;
const db = require('../../db');
const PostedUser = require('../../models/postedUser').PostedUser;
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;

let getOfficerById = async (officerObjectId, selectionValue) => {
    let getOfficerQuery = db.Officer.findOne({ _id: officerObjectId }).select(selectionValue);
    let getOfficerResult = await getOfficerQuery.exec();
    return getOfficerResult;
}

let getOfficerObjectByRoadCode = async (road_code) => {
    console.log(road_code);
    db.RoadToOfficer.findOne({ "road_code": road_code })
        .then(data => {
            console.log();
            
        })
    //find roadToOfficer entry for given road_code
    // let findOfficerToRoadCodeEntryQuery = 
    // let findOfficerToRoadCodeEntryResult = await db.RoadToOfficer.findOne({ road_code: road_code });
    // if(findOfficerToRoadCodeEntryResult != null)
    //     return findOfficerToRoadCodeEntryResult.officer;
    return await db.RoadToOfficer.findOne({ "road_code": road_code });
}

let userIsValid = async userId => {
    let answer = false;
    await db.User.findOne({ _id: userId })
        .then(data => {
            if(data)
                answer = true
            else
                answer = false
        })
        .catch(err => {
            console.log(err);
        })
    return answer;
}

router.post('/postNewComplaint', async (req, res) => {    
    //get data from request    
    if (req.body.url && 
        req.body.road_code && 
        req.body.name && 
        req.body.griev_type && 
        req.body.location) {
        
        //store request data in local variables
        let roadCode = String(req.body.road_code);
        let name = req.body.name;
        let location = req.body.location;
            let lat = parseFloat(location[0]);
            let lon = parseFloat(location[1]);
        let description = req.body.description;
        let griev_type = req.body.griev_type;
        let url = CONSTANTS.HOST + "api/android/getImage?url=" + req.body.url;

        //get user id from token
        let userId = req.userData._id;

        //Here we need to check if nearby same complaint already exists or not
        //we have to ensure that..
        //  1) Complaint distance must not be greater than global.constant['MIN_COMPLAINT_DISTANCE']
        //  2) Complaint Must be in pending status
        
        //check a valid posted user
        if(!userIsValid(userId)){
            res.json({ success: false, data: "User not found! please clear data of app" });
            return;
        }       

        function addDays(theDate, days) {
            return new Date(theDate.getTime() + days*24*60*60*1000);
        }

        //let grievance = await db.Grievance.findOne({ name: griev_type });
        //let estimated_date = addDays(new Date(), parseInt(grievance.duration));

        //creating new posted user
        let newPostedUser = new PostedUser({ userId: userId, url: url });
        
        // creating new complain
        let complaint = new db.RoadComplaint({
            road_code: roadCode,
            name: name,
            location: [lon, lat],
            grievType: griev_type,
            description: description
            //estimated_completion: estimated_date
        });

        //find officer connected to perticular road by road code
        let officerObjectId = await getOfficerObjectByRoadCode(roadCode);
        console.log(">>>>", officerObjectId);
        
        //checking if officer for given road code is allocated or not
        if(officerObjectId == -1) {
            res.json({ success: false, data: "No Officer found on given road" }); return; 
        }

        function distance(lat1, lon1, lat2, lon2, unit) {
            if ((lat1 == lat2) && (lon1 == lon2)) {
                return 0;
            }
            else {
                var radlat1 = Math.PI * lat1/180;
                var radlat2 = Math.PI * lat2/180;
                var theta = lon1-lon2;
                var radtheta = Math.PI * theta/180;
                var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                if (dist > 1) {
                    dist = 1;
                }
                dist = Math.acos(dist);
                dist = dist * 180/Math.PI;
                dist = dist * 60 * 1.1515;
                if (unit=="K") { dist = dist * 1.609344 }
                if (unit=="N") { dist = dist * 0.8684 }
                return dist;
            }
        }

        console.log("officer id", officerObjectId);
        console.log("Object ID ", officerObjectId);
        //duplicate complaints here
        await db.Officer.findOne({ "_id": ObjectId(officerObjectId.officer) })
            .then(async data => {
                let officer = data
                // let complaints = await data.complaints.map(item => {
                //     return {
                //         distance: distance(lat, lon, item.location[0], item.location[1], "K"),
                //         ...item 
                //     }
                // })


                // console.log("---------------------");
                // console.log("distance added");
                // console.log(complaints);
                // console.log("---------------------");
                
                console.log("data", data);
                

                let complaints = await data.complaints.filter((item) => {
                    console.log("---------------------");
                    console.log(item.grievType == griev_type, item.grievType, griev_type,  item.complaint_status.toLowerCase() == "pending",  item.complaint_status.toLowerCase(), "pending", item.distance < CONSTANTS.MIN_RADIUS, distance(lat, lon, item.location[0], item.location[1], "K"), CONSTANTS.MIN_RADIUS);
                    
                    
                    return item.complaint_status.toLowerCase() == "pending" && item.grievType == griev_type && (distance(lat, lon, item.location[0], item.location[1], "K") < CONSTANTS.MIN_RADIUS)
                })

                console.log("---------------------");
                console.log("filtered");
                console.log(complaints.length);
                console.log("---------------------");

                if(complaints.length >= 1) {
                    console.log("Posting duplicate complaint");
                    let sortedComplaints = await complaints.sort((a, b) => {
                        return a.distance > b.distance
                    })

                    let finalComplaint = sortedComplaints[0]

                    console.log("---------------------");
                    console.log("final complaint");
                    console.log(finalComplaint);
                    console.log("---------------------");

                    await db.Officer.updateOne({ $and: [{ _id: officerObjectId },
                        { complaints: { $elemMatch: { "_id": finalComplaint._id } } }] },
                        { $addToSet: { "complaints.$.postedUsers": newPostedUser },
                          $inc: { newComplaints: 1 }
                    })
                    .then(data => { 
                        // console.log(1);
                        let response = {
                            success: true,
                            _id: finalComplaint._id,
                            url: newPostedUser.url,
                            location: finalComplaint.location,
                            complaint_status: finalComplaint.complaint_status,
                            comments: finalComplaint.comments,
                            road_code: finalComplaint.road_code,
                            name: finalComplaint.name,
                            griev_type: finalComplaint.grievType,
                            description: finalComplaint.description,
                            officer_id: officerObjectId,
                            officer_email: officer.email,
                            officer_name: officer.name,
                            complaint_upload_time: CONSTANTS.getFormatedDate(new Date())//newPostedUser.time)
                        }
                        console.log("---------------------");
                        console.log("response");
                        console.log(response);
                        console.log("---------------------");
                        res.json(response); 
                    })
                    .catch(err => { console.log(err); res.json({ success: false, data: "Something went wrong here" }); return -1;});                    
                } else  {
                    console.log("Posting new complaint");
                    //adding officer id in users.complaintOfficer
                    await db.User.updateOne(
                        { _id: userId },
                        { $addToSet: { "complaintOfficers": officerObjectId } })
                    .then(data =>{ 
                        if(data) { 
                            console.log("0 officer id added to user.complaintOfficers")
                        } else { res.json({ success: false, data: "User does not exists, try clearing app data" }); return -1; }
                    })
                    .catch(err => { console.log(err); res.json({ success: false, data: "Something went wrong" }); return -1; });

                    //saving road complaint to officer
                    await db.Officer.updateOne(
                        { _id: officerObjectId }, //find officer document
                        { $push: { complaints: complaint }, //push new complaint in document
                        $inc: { newComplaints: 1, pending: 1 }, }) //increament new complaint counter
                        .then(data => { 
                            console.log("1 Complaint added to Officer's Complaints array"); 
                        })
                        .catch(err => { console.log(err); res.json({ success: false, data: "Something went wrong" }); return -1; });

                    //adding user id in complaint.postedUsers
                    await db.Officer.updateOne({ $and: [{ _id: officerObjectId },
                            { complaints: { $elemMatch: { "_id": complaint._id } } }] },
                            { $addToSet: { "complaints.$.postedUsers": newPostedUser } })
                        .then(data => { 
                            console.log("2 posted user added"); 
                        })
                        .catch(err => { console.log(err); res.json({ success: false, data: "Something went wrong here" }); return -1;});

                    //send response to user
                    
                    let response = {
                        success: true,
                        _id: complaint._id,
                        url: newPostedUser.url,
                        location: complaint.location,
                        complaint_status: complaint.complaint_status,
                        comments: complaint.comments,
                        road_code: complaint.road_code,
                        name: complaint.name,
                        griev_type: complaint.grievType,
                        description: complaint.description,
                        officer_id: officerObjectId,
                        officer_email: officer.email,
                        officer_name: officer.name,
                        complaint_upload_time: CONSTANTS.getFormatedDate(new Date())//complaint.time)
                    }
                    await res.sendStatus(200).json(response);
                    console.log("res", response);
                    console.log("3 respone sent");
                    //task after posting complaint (eg. notifications)
                }
            })
            .catch(err => {
                console.log(err);
                res.json({ success: false, data: "Something went wrong 123" }); return -1;
            })
        
    } else {
        //Here Requiered parameter is not in request.body
        res.json({
            success: false,
            data: "Required Parameters not found"
        });
    }
});

router.get('/notifications', async (req, res) => {
    await db.User.findOne({ "_id" : mongoose.Types.ObjectId(req.userData._id)}).lean()
        .then(async data => {         
            res.json(data.updatedComplaints);
            await db.User.updateOne(
                { "_id": mongoose.Types.ObjectId(req.userData._id) },
                { "$set" : { "updatedComplaints": [] } }
            )
        })
        .catch(err => {
            res.json({
                success: false,
                data: err.message
            })
        })
})

module.exports = router;
