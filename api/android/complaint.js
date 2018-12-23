const express = require('express');
const router = express.Router();
const CONSTANTS = require('../../globals').constants;
const db = require('../../db');
const PostedUser = require('../../models/postedUser').PostedUser;
const mongoose = require('mongoose');

let getOfficerById = async (officerObjectId, selectionValue) => {
    let getOfficerQuery = db.Officer.findOne({ _id: officerObjectId }).select(selectionValue);
    let getOfficerResult = await getOfficerQuery.exec();
    return getOfficerResult;
}

let getOfficerObjectByRoadCode = async (road_code) => {
    //find roadToOfficer entry for given road_code
    let findOfficerToRoadCodeEntryQuery = db.RoadToOfficer.findOne({ road_code: road_code });
    let findOfficerToRoadCodeEntryResult = await findOfficerToRoadCodeEntryQuery.exec();
    if(findOfficerToRoadCodeEntryResult != null)
        return findOfficerToRoadCodeEntryResult.officer;
    return -1;
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
        let roadCode = req.body.road_code;
        let name = req.body.name;
        let location = req.body.location;
            let lat = parseFloat(location[1]);
            let lon = parseFloat(location[0]);
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

        //creating new posted user
        let newPostedUser = new PostedUser({ userId: userId, url: url });
        
        // creating new complain
        let complaint = new db.RoadComplaint({
            road_code: roadCode,
            name: name,
            location: [lat, lon],
            grievType: griev_type,
            description: description });

        //find officer connected to perticular road by road code
        let officerObjectId = await getOfficerObjectByRoadCode(roadCode);

        //checking if officer for given road code is allocated or not
        if(officerObjectId == -1) {
            res.json({ success: false, data: "No Officer found on given road" }); return; 
        }

        //adding officer id in users.complaintOfficer

        await db.User.updateOne(
            { _id: userId },
            { $addToSet: { "complaintOfficers": officerObjectId } })
        .then(data =>{ 
            if(data) { 
                // console.log("officer id added to user.complaintOfficers")
            } else { res.json({ success: false, data: "User does not exists, try clearing app data" }); return -1; }
         })
        .catch(err => { console.log(err); res.json({ success: false, data: "Something went wrong" }); return -1; });

        //saving road complaint to officer
        await db.Officer.updateOne(
            { _id: officerObjectId }, //find officer document
            { $push: { complaints: complaint }, //push new complaint in document
              $inc: { newComplaints: 1 } }) //increament new complaint counter
            .then(data => { 
                // console.log("Complaint added to Officer's Complaints array"); 
            })
            .catch(err => { console.log(err); res.json({ success: false, data: "Something went wrong" }); return -1; });

        //adding user id in complaint.postedUsers
        await db.Officer.updateOne({ $and: [{ _id: officerObjectId },
                { complaints: { $elemMatch: { "_id": complaint._id } } }] },
                { $addToSet: { "complaints.$.postedUsers": newPostedUser } })
            .then(data => { 
                // console.log(1); 
            })
            .catch(err => { console.log(err); res.json({ success: false, data: "Something went wrong here" }); return -1;});

        let officer = await getOfficerById(officerObjectId, { "name": 1, "email": 1 })
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
            time: CONSTANTS.getFormatedDate(complaint.time)
        }
        await res.json(response);
        //task after posting complaint (eg. notifications)
        
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