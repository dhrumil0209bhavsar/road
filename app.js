const express = require('express');
const formidable = require('formidable');
const bodyParser = require('body-parser');

app = express();
// app.use((re))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Allow any ip to send requests
app.use(async (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credential', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD, OPTIONS');
    next();
});

app.use((req, res, next) => {
    if(req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    console.log(req.method + " : " + req.url + " : ");
    next();
});


app.use('/api/', require('./api'));

module.exports = app;
