'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pad = pad;
exports.padRight = padRight;
var SPACES = {};

for (var i = 0; i < 100; i++) {
    var strs = [];
    for (var x = 0; x < i; x++) {
        strs.push(' ');
    }
    SPACES[i] = strs.join('');
}
;

function pad(str) {
    var len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

    var _len = String(str).length;
    if (_len > len) {
        return str;
    }

    return '' + SPACES[len - _len] + str;
}
;

function padRight(str) {
    var len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

    var _len = String(str).length;
    if (_len > len) {
        return str;
    }

    return '' + str + SPACES[len - _len];
}
;