'use strict';
const constants = require("../constants");
const moment = require('moment');

// Resolver API
module.exports = function(req, res) {
  var time = req.query.text.trim();

  // Check if time is blank
  if (!time) {
    res.status(400).send('No time sent!');
    return;
  }

  // Check if time is in a valid format
  var timeRegex = /\d+:([0-5]\d):([0-5]\d)/;
  if (!timeRegex.test(time)) {
    res.status(400).send('Invalid time sent!');
    return;
  }

  // Generate the ISO-formatted datetime
  var timeArray = time.split(':');
  var endTime = moment().add(timeArray[0], 'hours').add(timeArray[1], 'minutes').add(timeArray[2], 'seconds');

  // Generate the HTML and return
  var html = '<img style="max-width:100%;" src="' + constants.BASE_SERVER_URI + endTime + '" width="150px"/>';
  res.json({
    body: html
  });
};