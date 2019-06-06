'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.disconnect = exports.connect = undefined;

var _connect = require('./connect');

Object.defineProperty(exports, 'connect', {
    enumerable: true,
    get: function get() {
        return _connect.connect;
    }
});
Object.defineProperty(exports, 'disconnect', {
    enumerable: true,
    get: function get() {
        return _connect.disconnect;
    }
});

var _function = require('./function');

Object.keys(_function).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _function[key];
        }
    });
});
exports.setup = setup;


/**
设置redis
@return {function} ready function */
function setup(setting) {
    (0, _connect.setup)(setting);
    return _function.exists.bind(undefined, '__ready_key');
}
;