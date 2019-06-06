'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.get = get;
exports.set = set;
exports.del = del;
exports.incr = incr;
exports.incrby = incrby;

var _bluebird = require('bluebird');

var _connect = require('../connect');

var _index = require('./index.js');

var _key2 = require('./key');

/**
获取数据 */
function get(key) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.get.bind(client))(key);
    });
}
;

/**
设置数据 */
function set(key, value, expireIn) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        var p = (0, _bluebird.promisify)(client.set.bind(client))(key, value);
        if (typeof expireIn === 'undefined' || expireIn === null) {
            return p;
        }
        return p.then(function () {
            return (0, _key2.expire)(key, expireIn);
        });
    });
}
;

/**
删除数据 */
function del() {
    for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
        keys[_key] = arguments[_key];
    }

    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.del.bind(client)).apply(undefined, keys);
    });
}

/**
键值自增长 */
function incr(key) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.incr.bind(client))(key);
    });
}
;

/**
键值自增长自定的值
@return 加上指定的增量值之后， key 的值 */
function incrby(key, incrment) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.incrby.bind(client))(key, incrment);
    });
}
;