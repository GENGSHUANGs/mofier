'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.error = error;
exports.v2 = v2;

var _util = require('util');

function error(message, args, localizedMessage) {
    if (Object.prototype.toString.call(args) === '[object String]') {
        localizedMessage = args;
        args = undefined;
    }
    var err = new Error(message);
    err.arguments = args;
    err.localizedMessage = localizedMessage ? localizedMessage.replace(/\{([\w\.]*)\}/g, function (str, key) {
        var val = (args || {})[key];
        return typeof val === 'undefined' || val === null ? '' : val;
    }) : undefined;
    return err;
}
;

function v2(code, args, localizedMessage) {
    if (Object.prototype.toString.call(args) === '[object String]') {
        localizedMessage = args;
        args = undefined;
    }
    localizedMessage = localizedMessage && localizedMessage.replace(/\{([\w\.]*)\}/g, function (str, key) {
        var val = (args || {})[key];
        return typeof val === 'undefined' || val === null ? '' : val;
    });
    var e = new Error(code + '(' + localizedMessage + '):' + (args && (0, _util.inspect)(args, { colors: true }).replace(/\s+/g, ' ')));
    e.code = code;
    e.arguments = args;
    e.localizedMessage = localizedMessage;
    return e;
}
;

error.v2 = v2;