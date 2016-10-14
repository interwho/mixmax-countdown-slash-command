'use strict';

// Lookahead API
module.exports = function(req, res) {
  var time = req.query.text.trim();

  // Check if time is blank
  if (!time) {
    res.json([{
      title: '<i>(enter a countdown time in hh:mm:ss format)</i>',
      text: ''
    }]);
    return;
  }

  // Check if time is in a valid format
  var timeRegex = /\d+:([0-5]\d):([0-5]\d)/;
  if (!timeRegex.test(time)) {
    res.json([{
      title: '<i>(invalid format - must be in hh:mm:ss from now)</i>',
      text: ''
    }]);
    return;
  }

  // Otherwise, time is valid
  res.json([{
    title: '',
    text: time
  }]);
};
