'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.keys = keys;
exports.expire = expire;
exports.exists = exists;

var _bluebird = require('bluebird');

var _connect = require('../connect');

var _index = require('./index.js');

/**
获取所有的key */
function keys(pattern) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.keys.bind(client))(pattern);
    });
}
;

/**
设置数据的生命周期 */
function expire(key, seconds) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.expire.bind(client))(key, seconds);
    });
}
;

/**
判断key 是否存在 */
function exists(key) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.exists.bind(client))(key) === 1;
    });
}
;