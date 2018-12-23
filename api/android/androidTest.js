const express = require('express');
//get the express router
const router = express.Router();
const getFormatedDate = require('../../globals/').constants.getFormatedDate;

//mock routes for android testing

router.get('/test', (req, res) => {
    res.json({
        id: 1,
        name: "nishant sir"
    })
});

router.get('/test2', (req, res) => {

});

router.get('/test2', (req, res) => {
    res.json([
        {
            _id: "kfoifjdsf",
            road_code: "CS1",
            name: "nihant marg",
            description: "Hey....!",
            location: [72.234234, 23.232342],
            complaint_status: "pending",
            estimated_time: new Date(2018, 09, 19),
            comment: [ ],
            time: new Date(2018, 09, 18)
        },
        {
            _id: "kfoifjdsf",
            road_code: "CS2",
            name: "dhrumil marg",
            description: "Hey....!",
            location: [72.234234, 23.232342],
            complaint_status: "approved",
            estimated_time: new Date(2018, 09, 19),
            comment: [ ],
            time: new Date(2018, 09, 18)
        },
        {
            _id: "kfoifjdsf",
            road_code: "CS1",
            name: "Unknown marg",
            description: "Hey....!",
            location: [72.234234, 23.232342],
            complaint_status: "pending",
            estimated_time: new Date(2018, 09, 19),
            comment: [ ],
            time: new Date(2018, 09, 18)
        }]);
});

let urls = [
    "https://ucarecdn.com/5f4ad9d1-6d81-4a31-abfa-7369496b781e/",
    "https://ucarecdn.com/08771177-43f2-4690-a779-44704e97d8d6/",
    "https://ucarecdn.com/fc2b70a8-888b-4561-aeb1-02ffcc9de253/",
    "https://ucarecdn.com/2af19597-2dd3-4dbc-a22a-f60256c91e6d/"
];

let complaint_status_values = [
    'Pending',
    'Approved',
    'Rejected',
    'In Progress',
    'Completed'
];

let Greivance_types = [
    'POT HOLES',
    'FALLEN TREE',
    'DAMAGE BRIDGE',
    'SHARP CURVE'
]

let road_codes = [
    'CS1',
    'CS2',
    'CS3',
    'NS1',
    'NS2',
    'NS3',
    'NS4'
];

router.get('/test3', (req, res) => {
    // res.sendStatus(Math.floor(Math.random() * (599 - 201 + 1) + 201));
    let random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    res.json({
        _id: "kfoifjdsf",
        road_code: road_codes[random(0, road_codes.length - 1)],
        url: urls[random(0, urls.length-1)],// + random(10, 300) + "/" + random(10, 300) + "/?random&kaushik="+ random(1, 999),
        name: "nihant marg",
        griev: Greivance_types[random(0, Greivance_types.length - 1)],
        description: "Hey....!",
        location: [72.234234, 23.232342],
        complaint_status: complaint_status_values[random(0, complaint_status_values.length - 1)],
        estimated_time: getFormatedDate(new Date(2018, 09, 30)),
        comment: [ ],
        time: getFormatedDate(new Date(2018, random(1, 12), random(1, 29)))
    });
});

router.get('/testLate', (req, res) => {
    setTimeout(() => {
        res.json({
            "status": "done"
        });
    }, 3000);
});

router.get('/notifications2', (req, res) => {
    // res.sendStatus(Math.floor(Math.random() * (599 - 201 + 1) + 201));
    let random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    res.json([
        {
            _id: random(100, 10000),
            complaint_status: "pending",
            estimated_date: getFormatedDate(new Date(2018, 09, 30)),
            comment: [ ],
            time: getFormatedDate(new Date(2018, 09, 18)),
            officer_id: 1,
            officer_email: "kaushik@gmail.com",
            officer_name: "kaushik"
        },
        {
            _id: random(100, 1000),
            complaint_status: "approved",
            estimated_date: getFormatedDate(new Date(2018, 09, 30)),
            comment: [ ],
            time: getFormatedDate(new Date(2018, 09, 18)),
            officer_id: 1,
            officer_email: "kaushik@gmail.com",
            officer_name: "kaushik"
        },
        {
            _id: random(100, 1000),
            complaint_status: "pending",
            estimated_date: getFormatedDate(new Date(2018, 09, 30)),
            comment: [ ],
            time: getFormatedDate(new Date(2018, 09, 18)),
            officer_id: 1,
            officer_email: "kaushik@gmail.com",
            officer_name: "kaushik"
        }
    ]);
});


//end mock routes

module.exports = router;