'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.lock = undefined;

/**
加锁
const lock = await lock('locks:xxxxxx') */
var lock = exports.lock = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(resource, onlocked) {
        var ttl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
        var unlockErrorHandler = arguments[3];
        var options = arguments[4];
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        return _context.abrupt('return', (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
                            return new _bluebird2.default(function (resolve, reject) {
                                (0, _bluebird.using)(new _redlock2.default([client], options).disposer(resource, ttl, unlockErrorHandler || defaultUnlockErrorHandler), onlocked).then(resolve, reject);
                            });
                        }));

                    case 1:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function lock(_x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

exports.multi = multi;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _redlock = require('redlock');

var _redlock2 = _interopRequireDefault(_redlock);

var _connect = require('../connect');

var _index = require('./index.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var debug = require('debug')('mofier:kv:function');
var debugerror = require('debug')('mofier:kv:function:error');

/**
默认解锁失败错误处理 */
function defaultUnlockErrorHandler(err) {
    debugerror(err);
}
;
;

/***
批量操作
Usage:
```javascript
await multi([
['hset','keyname1','keyvalue1'],
['hset','keyname2','keyvalue2'],
]);
```*/
function multi(commands) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        var multi = client.multi(commands);
        return (0, _bluebird.promisify)(multi.exec.bind(multi))();
    });
}
;