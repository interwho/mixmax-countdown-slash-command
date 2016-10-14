'use strict';

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("BASE_IMAGE_URI", 'http://justinpaulin.com/image.gif?time=');