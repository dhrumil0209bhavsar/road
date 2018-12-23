//required imports
const express = require('express');
const formidable = require('formidable');

const db = require('../../db');
//get the express router
const router = express.Router();
//middleware to verify access token
const verify = require('../../middlewares/aurthorization').verify;
//global constants
const CONSTANTS = require('../../globals').constants;

let size = 0;
let time = 0;


router.post('/imageUpload', function (req, res){
    if(time) {
        res.json({
            success: false
        });
    } else {
        var form = new formidable.IncomingForm({
            uploadDir: __dirname,
            keepExtensions: true
        });
        form.parse(req);
        form.on('fileBegin', function (name, file){
            file.path = __dirname + "/../../images/" + file.name;
        });
        form.on('file', function (name, file){
            res.json({
                success: true,
                data: file.name
            });
        });
    }
});

module.exports = router;