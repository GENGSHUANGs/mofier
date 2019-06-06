'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.drainAll = exports.drain = exports.connect = exports.createPoolWith = exports.pools = exports.DEFAULT = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var createPoolWith = exports.createPoolWith = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(options) {
        var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref3$min = _ref3.min,
            min = _ref3$min === undefined ? 2 : _ref3$min,
            _ref3$max = _ref3.max,
            max = _ref3$max === undefined ? 10 : _ref3$max;

        var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return createPool(options, { min: min, max: max });

                    case 2:
                        return _context.abrupt('return', pools[name] = _context.sent);

                    case 3:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function createPoolWith(_x3) {
        return _ref2.apply(this, arguments);
    };
}();

var connect = exports.connect = function () {
    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT;

        var _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref6$priority = _ref6.priority,
            priority = _ref6$priority === undefined ? 1 : _ref6$priority;

        var _cached_release_func, _cached_commit_func, _cached_rollback_func;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _cached_release_func = void 0, _cached_commit_func = void 0, _cached_rollback_func = void 0;
                        return _context2.abrupt('return', new _bluebird2.default(function (resolve, reject) {
                            var pool = pools[name];
                            trace('获取连接,%s,%s', name, !!pool);
                            (0, _bluebird.promisify)(pool.getConnection.bind(pool))().then(function (conn) {
                                trace('进程:%s:获取连接,%s', conn.threadId, name);
                                // 10内如果没有释放，则直接打印错误日志
                                _cached_release_func = conn.release.bind(conn);
                                var _released = false;
                                conn.release = function () {
                                    _released = true;
                                    _cached_release_func();
                                    trace('进程:%s:释放连接,%s', conn.threadId, name);
                                };
                                setTimeout(function () {
                                    if (!_released) {
                                        debugwarn(pe.render(new Error('\u8FDB\u7A0B:' + conn.threadId + ':ERROR : \u8D85\u8FC710s\u672A\u91CA\u653E !!!!!!')));
                                    }
                                }, 10000);

                                _cached_commit_func = conn.commit.bind(conn);
                                conn.commit = function (fn) {
                                    _cached_commit_func(fn);
                                    trace('\u8FDB\u7A0B:%s:\u4E8B\u52A1\u63D0\u4EA4,%s , \uD83D\uDC7B', conn.threadId, name);
                                };
                                _cached_rollback_func = conn.rollback.bind(conn);
                                conn.rollback = function (fn) {
                                    _cached_rollback_func(fn);
                                    trace('进程:%s:事务回滚,%s <<<<< ---------------- 😵😵😵😵😵😵😵😵😵😵', conn.threadId, name);
                                };
                                resolve(conn);
                            }).error(reject);
                        }).disposer(function (conn) {
                            conn.release();
                            trace('进程:%s:结束,%s', conn.threadId, name);
                            conn.release = _cached_release_func;
                            conn.commit = _cached_commit_func;
                            conn.rollback = _cached_rollback_func;
                        }));

                    case 2:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function connect() {
        return _ref5.apply(this, arguments);
    };
}();

var drain = exports.drain = function () {
    var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var _this = this;

        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return forEach(Object.keys(pools).filter(function (_name) {
                            return typeof name === 'undefined' || name === null ? true : _name === name;
                        }), function () {
                            var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(name) {
                                var pool;
                                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
                                            case 0:
                                                pool = pools[name];
                                                _context3.next = 3;
                                                return pool.end();

                                            case 3:
                                                delete pools[name];

                                            case 4:
                                            case 'end':
                                                return _context3.stop();
                                        }
                                    }
                                }, _callee3, _this);
                            }));

                            return function (_x9) {
                                return _ref8.apply(this, arguments);
                            };
                        }());

                    case 2:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function drain() {
        return _ref7.apply(this, arguments);
    };
}();

var drainAll = exports.drainAll = function () {
    var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.next = 2;
                        return drain(undefined);

                    case 2:
                        return _context5.abrupt('return', _context5.sent);

                    case 3:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function drainAll() {
        return _ref9.apply(this, arguments);
    };
}();

exports.createPool = createPool;
exports._connect = _connect;

require('./hack');

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _prettyError = require('pretty-error');

var _prettyError2 = _interopRequireDefault(_prettyError);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var debug = require('debug')('mofier:db:v2:connect');
var trace = require('debug')('mofier:db:v2:connect:trace');
var debugwarn = require('debug')('mofier:db:v2:connect:warn');
var debugerror = require('debug')('mofier:db:v2:connect:error');

var pe = new _prettyError2.default().skipNodeFiles();

/**
创建连接池 */
function createPool(options, _ref) {
    var min = _ref.min,
        max = _ref.max;

    options.debug = typeof options.debug !== 'undefined' ? options.debug : false;
    options.multipleStatements = typeof options.multipleStatements !== 'undefined' ? options.multipleStatements : true;
    options.connectionLimit = (typeof max === 'undefined' ? 'undefined' : _typeof(max)) !== undefined ? max : options.connectionLimit || 10;
    debug('创建连接池 : %j', options);
    return _mysql2.default.createPool(options);
}
;

var DEFAULT = exports.DEFAULT = 'default',
    pools = exports.pools = global.__db_pools = {};

;

function _connect() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT;

    var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref4$priority = _ref4.priority,
        priority = _ref4$priority === undefined ? 1 : _ref4$priority;

    var pool = pools[name];
    return (0, _bluebird.promisify)(pool.getConnection.bind(pool))().disposer(function (conn) {
        conn.release();
    });
}
;

;

;

;