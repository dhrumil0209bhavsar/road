//required imports
const express = require('express');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const Nexmo = require('nexmo');

const db = require('../../db');
//get the express router
const router = express.Router();
//middleware to verify access token
const verify = require('../../middlewares/aurthorization').verify;
//global constants
const CONSTANTS = require('../../globals').constants;


const nexmo = new Nexmo({
    apiKey: 'd5b1bf5f',
    apiSecret: 'JMG0uYB3gbm8PJVZ'
  }, { debug: true });
  

async function findAndRemoveExistingPhoneEntry(phoneNo) {
    let query = db.Otp.deleteMany({ phoneNo: phoneNo });
    let result = await query.exec();
    return result;
}

//OTP ROUTE
router.post('/otp',async (req, res) => {
    if(!req.body.phoneNo) {
        console.error("Error : \"phoneNo\" not found in request");
        res.json({
            success: false,
            data: "Phone number required"
        });
        return;
    }
    let phoneNo = req.body.phoneNo;

    //check if phoneNo already exists
    await findAndRemoveExistingPhoneEntry(phoneNo);

    //generate otp here
    let tempOtp = 1111;//Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    // console.log(tempOtp);



    nexmo.message.sendSms(
        '917984047414', phoneNo, "Your marg sahayak otp is " + tempOtp, { type: 'unicode' },
        (err, responseData) => {
          if(err) {
            console.log(err);
          } else {
            console.log(responseData);
          }
    });
    
    //send otp here
    let otp = new db.Otp({
        phoneNo: phoneNo,
        otpNo: tempOtp,
    })

    otp.save((err, data) => {
        if(err) {
            console.error(err);            
            res.json({
                success: false,
                data: "Error occurred while saving otp please try again"
            });
            return;
        }
        //on otp send, send response to client
        res.json({
            success: true
        });
    });
});

let sendUserToken = (req, res, data, isNewUser) => {
    let isUser = isNewUser;
    jwt.sign(data, CONSTANTS['SECRET_KEY'], (err, token) => {
        if(err) {
            console.error("Error occurred while generating token", err);
            res.json({
                success: false,
                data: "Error occurred while generating token"
            });
            return;
        }
        //send token in response           
        res.json({
            success: true,
            isNewUser: isUser,
            data: token,
        });
    }); 
}

router.post('/otp-verify', (req, res) => {
    if(!(req.body.phoneNo && req.body.otpNo)) {
        res.json({
            success: false,
            data: "\"phoneNo\" or \"otpNo\" is missing"
        })
        return;
    }

    //find entry in Otp table
    db.Otp.findOne({
        "phoneNo": req.body.phoneNo,
        "otpNo": req.body.otpNo
    }, (err, data) => {
        if(err) {   
            console.error("Error occurred while finding otp entry", err);
            res.json({
                success: false,
                data: "Error occurred while finding otp entry"
            })
            return;
        }

        //here we have to check if otp entry is found or not
        if(!data) {
            res.json({
                success: false,
                data: "Invalid OTP (Please try resend otp)"
            })
            return;
        }
        
        //here lies great legit user....
        //or a new muggle...

        //find existing user from db
        db.User.findOne({
            phoneNo: req.body.phoneNo
        },async (err, data) => {                        
            if(err) {
                console.error("error on getting user : ", err);
                res.json({
                    success: false,
                    data: "Error occurred while searching user in database"
                })
                return;
            }

            if(!data || ( !data.name || !data.email )) {

                await db.User.deleteMany({ phoneNo: req.body.phoneNo });

                //signup user here
                let newUser = new db.User({
                    phoneNo: req.body.phoneNo,
                    verified: true
                });
                newUser.save((err, data) => {
                    if(err) {
                        console.error("error on signup new user : ", err);
                        res.json({
                            success: false,
                            data: "Error occurred while saving new user"
                        })
                        return;
                    } else {
                        if(data) {
                            let user = {
                                _id: data._id,
                                phoneNo: data.phoneNo,
                                aurthorizationUserRole: 'user'
                            };
                            sendUserToken(req, res, user, true);                                       
                        }
                    }
                });
            } else {
                //user found
                let user = {
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    phoneNo: data.phoneNo,
                    aurthorizationUserRole: 'user'
                };
                //sending user name instead of isNewUser boolean
                sendUserToken(req, res, user, user.name);
            }
        });
    });
});

router.use(verify);

//route is for user form of name and email
router.post('/signup', (req, res) => {   
    if(req.body.name && req.body.email) {
        db.User.updateOne({
            _id: req.userData._id
        },
        {
            $set: {
                name: req.body.name,
                email: req.body.email
            }
        }, (err, data) => {
            if(err) {
                console.error("error on signup user : ", err);
                res.json({
                    success: false,
                    data: "Error occurred while updating user"
                })
                return;
            }
            db.User.findOne({
                _id: req.userData._id
            }, (err, data) => {
                let user = {
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    phoneNo: data.phoneNo,
                    aurthorizationUserRole: 'user'
                };
                sendUserToken(req, res, user, true);
            });         
        });
    } else {
        res.json({
            success: false,
            data: "Parameter Required : name & email"
        })
    }
});


module.exports = router;