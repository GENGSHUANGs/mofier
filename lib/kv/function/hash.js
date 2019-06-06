'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hset = hset;
exports.hsetnx = hsetnx;
exports.hget = hget;
exports.hgetall = hgetall;
exports.hdel = hdel;
exports.hkeys = hkeys;
exports.hexists = hexists;
exports.hincrby = hincrby;

var _bluebird = require('bluebird');

var _connect = require('../connect');

var _index = require('./index.js');

/**
将哈希表 key 中的字段 field 的值设为 value */
function hset(key, field, value) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.hset.bind(client))(key, field, value);
    });
}
;

/**
只有在字段 field 不存在时，设置哈希表字段的值 */
function hsetnx(key, field, value) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.hsetnx.bind(client))(key, field, value);
    });
}
;

/**
获取存储在哈希表中指定字段的值 */
function hget(key, field) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.hget.bind(client))(key, field);
    });
}
;

/**
获取在哈希表中指定 key 的所有字段和值 */
function hgetall(key) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.hgetall.bind(client))(key);
    });
}
;

/**
hash 删除字段 */
function hdel(key) {
    for (var _len = arguments.length, fields = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        fields[_key - 1] = arguments[_key];
    }

    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.hdel.bind(client)).apply(undefined, [key].concat(fields));
    });
}
;

/**
Redis Hkeys 命令用于获取哈希表中的所有字段名 */
function hkeys(key) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.hkeys.bind(client))(key);
    });
}
;

/**
hash 字段是否存在 */
function hexists(key, field) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.hexists.bind(client))(key, field);
    });
}
;

/**
为哈希表 key 中的指定字段的整数值加上增量 increment
return 执行 HINCRBY 命令之后，哈希表中字段的值 */
function hincrby(key, field, increment) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.hincrby.bind(client))(key, field, increment);
    });
}
;