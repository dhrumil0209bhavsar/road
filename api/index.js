const express = require('express');
const router = express.Router();

//Here are all routes of API

router.get('/', (req, res) => {
    res.json({
        message: "Welcome to API"
    });
});

router.use('/android', require('./android'));
router.use('/portal', require('./portal'));


module.exports = router;