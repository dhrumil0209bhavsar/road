const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
const db = require('../../db');
const ObjectId = require('mongodb').ObjectID;

router
    .get('/grienvances', async (req, res) => {
        db.Grievance.findOne({}, function(err, data) {
            console.log(err, data);
        })
        db.Grievance.find({})
            .then(data => {
                res.json({
                    success: true,
                    data: data
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
    .post('/grienvances', async (req, res) => {
        try {
            let grienvance = new db.Grievance({
                name: req.body.name,
                duration: parseInt(req.body.duration)
            })
    
            grienvance.save()
                .then(data => {
                    console.log(data);
                    
                    res.json({
                        success: true,
                        data: "done"
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
        } catch(err) {
            console.log(err);
            res.json({
                success: false,
                data: err
            })
            return;
        }
    })
    .put('/grienvances', async (req, res) => {
        try {
            db.Grievance.findOneAndUpdate(
                { _id: ObjectId(req.body._id) },
                { name: req.body.name, duration: parseInt(req.body.duration) })
                .then(data => {
                    res.json({
                        success: true,
                        data: data
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
        } catch(err) {
            console.log(err);
            res.json({
                success: false,
                data: err
            })
            return;
        }
    })
    .delete('/grienvances', async (req, res) => {
        try {
            db.Grievance.findOneAndDelete(
                { _id: ObjectId(req.body._id) })
                .then(data => {
                    res.json({
                        success: true,
                        data: data
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
        } catch(err) {
            console.log(err);
            res.json({
                success: false,
                data: err
            })
            return;
        }
    })


router
    .get('/rejections', async (req, res) => {
        db.Rejection.find({})
            .then(data => {
                res.json({
                    success: true,
                    data: data
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
    .post('/rejections', async (req, res) => {
        try {
            let rejection = new db.Rejection({
                name: req.body.name,
            })
    
            rejection.save()
                .then(data => {
                    res.json({
                        success: true,
                        data: "done"
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
        } catch(err) {
            console.log(err);
            res.json({
                success: false,
                data: err
            })
            return;
        }
    })
    .put('/rejections', async (req, res) => {
        try {
            db.Rejection.findOneAndUpdate(
                { _id: ObjectId(req.body._id) },
                { name: req.body.name })
                .then(data => {
                    res.json({
                        success: true,
                        data: data
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
        } catch(err) {
            console.log(err);
            res.json({
                success: false,
                data: err
            })
            return;
        }
    })
    .delete('/rejections', async (req, res) => {
        try {
            db.Rejection.findOneAndDelete(
                { _id: ObjectId(req.body._id) })
                .then(data => {
                    res.json({
                        success: true,
                        data: data
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
        } catch(err) {
            console.log(err);
            res.json({
                success: false,
                data: err
            })
            return;
        }
    })

module.exports = router;