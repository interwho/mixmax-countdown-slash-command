'use strict';
const fs = require('fs');
const path = require('path');
const GIFEncoder = require('gifencoder');
const Canvas = require('canvas');
const moment = require('moment');

/**
  Modified from: https://github.com/Nooshu/node-countdown-gif/blob/master/countdown-generator/index.js
*/
module.exports = {
    /**
     * Initialise the GIF generation
     * @param {string} time
     * @param {number} width
     * @param {number} height
     * @param {string} color
     * @param {string} bg
     * @param {string} name
     * @param {number} frames
     * @param {requestCallback} cb - The callback that is run once complete.
     */
    init: function(time, width=150, height=30, color='FF0000', bg='FFFFFF', name='default', frames=300, cb){
        // Set some sensible upper / lower bounds
        this.width = this.clamp(width, 150, 500);
        this.height = this.clamp(height, 30, 500);
        this.frames = this.clamp(frames, 1, 300);
        
        this.bg = '#' + bg;
        this.textColor = '#' + color;
        this.name = name;
        
        // loop optimisations
        this.halfWidth = Number(this.width / 2);
        this.halfHeight = Number(this.height / 2);
        
        this.encoder = new GIFEncoder(this.width, this.height);
        this.canvas = new Canvas(this.width, this.height);
        this.ctx = this.canvas.getContext('2d');
        
        // calculate the time difference (if any)
        let timeResult = this.time(time);
        
        // start the gif encoder
        this.encode(timeResult, cb);
    },
    /**
     * Limit a value between a min / max
     * @link http://stackoverflow.com/questions/11409895/whats-the-most-elegant-way-to-cap-a-number-to-a-segment
     * @param number - input number
     * @param min - minimum value number can have
     * @param max - maximum value number can have
     * @returns {number}
     */
    clamp: function(number, min, max){
        return Math.max(min, Math.min(number, max));
    },
    /**
     * Calculate the diffeence between timeString and current time
     * @param {string} timeString
     * @returns {string|Object} - return either the date passed string, or a valid moment duration object
     */
    time: function (timeString) {
        // grab the current and target time
        let target = moment(timeString, moment.ISO_8601);
        let current = moment();
        
        // difference between the 2 (in ms)
        let difference = target.diff(current);
        
        // either the date has passed, or we have a difference
        if(difference <= 0){
            return 'Date has passed!';
        } else {
            // duration of the difference
            return moment.duration(difference);
        }
    },
    /**
     * Encode the GIF with the information provided by the time function
     * @param {string|Object} timeResult - either the date passed string, or a valid moment duration object
     * @param {requestCallback} cb - the callback to be run once complete
     */
    encode: function(timeResult, cb){
        let enc = this.encoder;
        let ctx = this.ctx;
        let tmpDir = process.cwd() + '/tmp/';

        // create the tmp directory if it doesn't exist
        if (!fs.existsSync(tmpDir)){
            fs.mkdirSync(tmpDir);
        }
        
        let filePath = tmpDir + this.name + '.gif';
        
        // pipe the image to the filesystem to be written
        let imageStream = enc
                .createReadStream()
                    .pipe(fs.createWriteStream(filePath));
        // once finised, generate or serve
        imageStream.on('finish', () => {
            // only execute callback if it is a function
            typeof cb === 'function' && cb();
        });
        
        // estimate the font size based on the provided width
        let fontSize = Math.floor(this.width / 6) + 'px';
        let fontFamily = 'monospace'; // monospace works slightly better
        
        // set the font style
        ctx.font = [fontSize, fontFamily].join(' ');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // start encoding gif with following settings
        enc.start();
        enc.setRepeat(0);
        enc.setDelay(1000);
        enc.setQuality(100);

        // if we have a moment duration object
        if(typeof timeResult === 'object'){
            for(let i = 0; i < this.frames; i++){
                // extract the information we need from the duration
                let days = Math.floor(timeResult.asDays());
                let hours = Math.floor(timeResult.asHours());
                let minutes = Math.floor(timeResult.asMinutes()) - (hours * 60);
                let seconds = Math.floor(timeResult.asSeconds()) - (hours * 60 * 60) - (minutes * 60);
                
                // make sure we have at least 2 characters in the string
                hours = (hours.toString().length == 1) ? '0' + hours : hours;
                minutes = (minutes.toString().length == 1) ? '0' + minutes : minutes;
                seconds = (seconds.toString().length == 1) ? '0' + seconds : seconds;
                
                // build the date string
                let string = [hours, ':', minutes, ':', seconds].join('');
                
                // paint BG
                ctx.fillStyle = this.bg;
                ctx.fillRect(0, 0, this.width, this.height);
                
                // paint text
                ctx.fillStyle = this.textColor;
                ctx.fillText(string, this.halfWidth, this.halfHeight);
                
                // add finalised frame to the gif
                enc.addFrame(ctx);
                
                // remove a second for the next loop
                timeResult.subtract(1, 'seconds');
            }
        } else {
            // Date has passed so only using a string
            
            // BG
            ctx.fillStyle = this.bg;
            ctx.fillRect(0, 0, this.width, this.height);
            
            // Text
            ctx.fillStyle = this.textColor;
            ctx.fillText('00:00:00', this.halfWidth, this.halfHeight);
            enc.addFrame(ctx);
        }
        
        // finish the gif
        enc.finish();
    }
};
