const express = require('express');
const router = express.Router();
const db = require('../../db');
const mongoose = require('mongoose');
const verify = require('../../middlewares/aurthorization').verify;
const CONSTANTS = require('../../globals').constants;

//Here are all routes of Portal API

// home route
router.get('/', (req, res) => { 
    res.json({
        success: true,
        data: "THIS IS INDEX OF PORTAL API"
    });
});

router.get('/testOfficers', async (req, res) => {
    // if(req.userData.role !== CONSTANTS.officersHierarchy[0]) {
        await db.Officer.find({})
            .then(data => {
                res.json(data)
            })
            .catch(err => console.log(err))
    // }
});

// router.post('/forewordComplaint')
//     .then((req, res) => {
//         console.log("done")
//     })


router.use('/', require('./authenticate'));//login and signup officers
router.use('/', require('./hierarchy'));//some operations on hierarchy of officer
router.use(verify);//jwt verification
//Only officer or admin user can access links
router.use((req, res, next) => {
    if(req.userData.aurthorizationUserRole == 'officer') {
        next();
    } else {
        res.json({
            success: false,
            data: "Requested user in not aurthorized"
        });
        return;
    }
});

router.get('/getUserInfo', async (req, res) => {
    await db.Officer.findOne(
        { "_id": req.userData._id })
        .select({ name: 1, email: 1, phoneNo: 1 })
        .then(data => {
            //send data            
            res.json({ success: true, data: data });
        })
        .catch(err => {        
            res.json({ success: false, data: "Something went wrong" });
        });
});

router.get('/getOfficerRoads', async (req, res) => {
    
    if(req.query.officerId) {
        await db.RoadToOfficer.find(
            { "officer": mongoose.Types.ObjectId(req.query.officerId) }
        )
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
    }
});

router.get('/getAllJrdIds', async (req, res) => {

    let officerId = req.userData._id;
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
                .select({ "_id": 1, "name": 1, "email": 1, "phoneNo": 1, "role": 1 })
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

    await getJrs(officerId, mCallback);

});

router.get('/getSrIdsForeword', async (req, res) => {
    let officers = [];
    let officerId = req.userData._id;
    let officerRoleIndex = CONSTANTS.officersHierarchy.indexOf(req.userData.role);
    let officerRole = CONSTANTS.officersHierarchy[++officerRoleIndex];
    // let officerRole = req.userData.role;
    console.log(CONSTANTS.officersHierarchy, officerRoleIndex)

    if(officerRole == CONSTANTS.officersHierarchy[CONSTANTS.officersHierarchy.length - 1]) {
        res.json({
            success: true,
            data: officers
        })
        return;
    }

    // officerRole = CONSTANTS.officersHierarchy[++officerRoleIndex]


    function findSeniorRecursive(officerRoleIndex){
        if(officerRoleIndex == CONSTANTS.officersHierarchy.length - 1){
            officers.push({
                id: officerId,
                role: officerRole,
            });
            res.json({
                success: true,
                data: officers
            })
            return 0;
        }

        db.OfficerHierarchy.findOne(
            { "junior_officer": mongoose.Types.ObjectId(officerId) }
        )
            .then(data => {
                officers.push({
                    id: data.senior_officer,
                    role: officerRole,
                });
                officerRoleIndex++;
                officerId = data.senior_officer;
                officerRole = CONSTANTS.officersHierarchy[officerRoleIndex];
                console.log(officerId, officerRole, officerRoleIndex)
                findSeniorRecursive(officerRoleIndex);
            })   
    }

    findSeniorRecursive(officerRoleIndex);

    // while( officerRoleIndex != CONSTANTS.officersHierarchy.length - 1) {
    //     db.OfficerHierarchy.findOne(
    //         { "junior_officer": mongoose.Types.ObjectId(officerId) }
    //     )
    //         .then(data => {
    //             console.log("then")
    //             officers.push({
    //                 id: data.senior_officer,
    //                 role: officerRole
    //             });
    //             officerRoleIndex++;
    //             officerId = data.senior_officer;
    //             officerRole = CONSTANTS.officersHierarchy[officerRole];
    //         })

    //     console.log("while")
    // }
})

router.use('/', require('./roadAllocAndDelloc'));//road allocation and deallocation to officer
router.use('/', require('./paginate'));//paginated queries
router.use('/', require('./complaint'));//all complaint of officers
router.use('/', require('./updateProfile'));

module.exports = router;