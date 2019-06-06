'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.rpush = rpush;
exports.lpop = lpop;
exports.llen = llen;
exports.lrange = lrange;

var _bluebird = require('bluebird');

var _connect = require('../connect');

var _index = require('./index.js');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
链表右push */
function rpush(key, value) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.rpush.bind(client))(key, value);
    });
}
;

/**
链表左pop*/
function lpop(key, processor) {
    var _this = this;

    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(client) {
            var _lpop, next;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _lpop = (0, _bluebird.promisify)(client.lpop.bind(client));

                            if (processor) {
                                _context2.next = 3;
                                break;
                            }

                            return _context2.abrupt('return', _lpop(key));

                        case 3:
                            next = function () {
                                var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    var val;
                                    return regeneratorRuntime.wrap(function _callee$(_context) {
                                        while (1) {
                                            switch (_context.prev = _context.next) {
                                                case 0:
                                                    _context.next = 2;
                                                    return _lpop(key);

                                                case 2:
                                                    val = _context.sent;

                                                    if (!(typeof val === 'undefined' || val === null)) {
                                                        _context.next = 5;
                                                        break;
                                                    }

                                                    return _context.abrupt('return');

                                                case 5:
                                                    _context.next = 7;
                                                    return processor(val);

                                                case 7:
                                                    _context.next = 9;
                                                    return next();

                                                case 9:
                                                case 'end':
                                                    return _context.stop();
                                            }
                                        }
                                    }, _callee, _this);
                                }));

                                return function next() {
                                    return _ref2.apply(this, arguments);
                                };
                            }();

                            _context2.next = 6;
                            return next();

                        case 6:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this);
        }));

        return function (_x) {
            return _ref.apply(this, arguments);
        };
    }());
}
;

/**
获取链表长度 */
function llen(key) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.llen.bind(client))(key);
    });
}
;

/**
获取链表指定位置数据 */
function lrange(key, start, stop) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.lrange.bind(client))(key, start, stop);
    });
}
;