'use strict';
const constants = require("./constants");
const express = require('express');
const path = require('path');

// Define cache folders
const tmpDir = __dirname + '/tmp/';
const publicDir = __dirname + '/public/';

// Initialize image generator
const CountdownGenerator = require('./api/image');

// Initialize the server
const app = express();

// Cache Routes
app.use(express.static(publicDir));
app.use(express.static(tmpDir));

// API Routes
app.get('/typeahead', require('./api/typeahead'));
app.get('/resolver', require('./api/resolver'));

// Image Route
app.get('/image.gif', function (req, res) {
    let {time, width, height, color, bg, name, frames} = req.query;

    // Time isn't set
    if(!time){
        throw Error('Time parameter is required.');
    }

    CountdownGenerator.init(time, width, height, color, bg, name, frames, () => {
        let filePath = tmpDir + 'default.gif';
        res.sendFile(filePath);
    });
});

// Start the server
app.listen(process.env.PORT || constants.PORT);

module.exports = app;
