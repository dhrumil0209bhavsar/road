//required imports
const path = require('path');
const express = require('express');
const router = express.Router(); //get the express router
const verify = require('../../middlewares/aurthorization').verify; //middleware to verify access token
// const CONSTANTS = require('../../globals').constants; //global constants

//Here are all routes of API
router.get('/getImage',async (req, res) => {
    res.setHeader("Content-type", "image/jpg");
    try{
        res.sendFile(path.resolve(__dirname + "/../../images/") + "/" + req.query.url)
    } catch(e) {
        console.error(e); 
        res.sendStatus(404);
        return;
    }
})

router.use('/', require('./androidTest')); //mock routes
router.use('/', require('./otp')); //Otp routes

//using jwt authorization for any routes other than login and signup
//hereby all routes required jwt token
router.use(verify);
//Only general user can access links
router.use((req, res, next) => {
    if(req.userData.aurthorizationUserRole == 'user') { 
        next(); 
    }
    else { 
        res.json({ 
            success: false, 
            data: "Requested user in not aurthorized" 
        }) 
    }
});
router.use('/', require('./fileUpload')); //file upload
router.use('/', require('./complaint')); //Posting User Complaint
router.get('/data', (req, res) => { res.json(req.userData); }); //Checking token data from jwt (for testing perpose only)

module.exports = router;