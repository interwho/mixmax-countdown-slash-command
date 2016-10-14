'use strict';

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("PORT", '80');
define("BASE_URL", 'http://45.79.132.130:' + this.PORT);
define("BASE_IMAGE_URI", this.BASE_URL + '/image.gif?time=');
