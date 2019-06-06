'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.drain = exports.connect = exports.createPoolWith = exports.pools = exports.DEFAULT = exports.createPool = undefined;

var createPool = exports.createPool = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(url) {
        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref2$heartbeat = _ref2.heartbeat,
            heartbeat = _ref2$heartbeat === undefined ? 1 : _ref2$heartbeat,
            _ref2$locale = _ref2.locale,
            locale = _ref2$locale === undefined ? 'zh_CN' : _ref2$locale,
            _ref2$noDelay = _ref2.noDelay,
            noDelay = _ref2$noDelay === undefined ? true : _ref2$noDelay;

        var create = function () {
            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var connection;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return (0, _amqplib.connect)(url, { heartbeat: heartbeat, locale: locale, noDelay: noDelay });

                            case 2:
                                connection = _context.sent;

                                connection.on('error', function (err) {
                                    debugerror(pe.render(err));
                                    pool.destroy(connection);
                                    throw err;
                                });
                                connection.on('blocked', function (reason) {
                                    debugwarn('AMQP\u4E0D\u901A,\u539F\u56E0:', reason);
                                });
                                connection.on('unblocked', function () {
                                    debug('AMQP\u5DF2\u6062\u590D\u7545\u901A');
                                });
                                return _context.abrupt('return', connection);

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            return function create() {
                return _ref4.apply(this, arguments);
            };
        }();

        var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            _ref3$min = _ref3.min,
            min = _ref3$min === undefined ? 2 : _ref3$min,
            _ref3$max = _ref3.max,
            max = _ref3$max === undefined ? 10 : _ref3$max;

        var pool;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        pool = void 0;

                        ;

                        return _context3.abrupt('return', pool = (0, _genericPool.createPool)({ create: create, destroy: function () {
                                var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(connection) {
                                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                        while (1) {
                                            switch (_context2.prev = _context2.next) {
                                                case 0:
                                                    _context2.next = 2;
                                                    return connection.close();

                                                case 2:
                                                    return _context2.abrupt('return', _context2.sent);

                                                case 3:
                                                case 'end':
                                                    return _context2.stop();
                                            }
                                        }
                                    }, _callee2, this);
                                }));

                                function destroy(_x4) {
                                    return _ref5.apply(this, arguments);
                                }

                                return destroy;
                            }()
                        }, { min: min, max: max, Promise: _bluebird2.default }));

                    case 3:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function createPool(_x3) {
        return _ref.apply(this, arguments);
    };
}();

var createPoolWith = exports.createPoolWith = function () {
    var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(url) {
        var _ref7 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref7$heartbeat = _ref7.heartbeat,
            heartbeat = _ref7$heartbeat === undefined ? 1 : _ref7$heartbeat,
            _ref7$locale = _ref7.locale,
            locale = _ref7$locale === undefined ? 'zh_CN' : _ref7$locale,
            _ref7$noDelay = _ref7.noDelay,
            noDelay = _ref7$noDelay === undefined ? true : _ref7$noDelay;

        var _ref8 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            _ref8$min = _ref8.min,
            min = _ref8$min === undefined ? 2 : _ref8$min,
            _ref8$max = _ref8.max,
            max = _ref8$max === undefined ? 10 : _ref8$max;

        var name = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return createPool(url, { heartbeat: heartbeat, locale: locale, noDelay: noDelay }, { min: min, max: max });

                    case 2:
                        return _context4.abrupt('return', pools[name] = _context4.sent);

                    case 3:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function createPoolWith(_x8) {
        return _ref6.apply(this, arguments);
    };
}();

var connect = exports.connect = function () {
    var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT;

        var _ref10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref10$priority = _ref10.priority,
            priority = _ref10$priority === undefined ? 1 : _ref10$priority;

        var pool;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        pool = pools[name];
                        return _context5.abrupt('return', pool.acquire(priority).disposer(function (connection, p) {
                            if (p.isRejected()) {
                                return;
                            }
                            return pool.release(connection);
                        }));

                    case 2:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function connect() {
        return _ref9.apply(this, arguments);
    };
}();

var drain = exports.drain = function () {
    var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(name) {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.next = 2;
                        return (0, _array.forEach)(Object.keys(pools).filter(function (_name) {
                            return typeof name === 'undefined' || name === null ? true : _name === name;
                        }), function () {
                            var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(name) {
                                var pool;
                                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                                    while (1) {
                                        switch (_context6.prev = _context6.next) {
                                            case 0:
                                                pool = pools[name];
                                                _context6.next = 3;
                                                return pool.drain();

                                            case 3:
                                                pool.clear();
                                                delete pools[name];

                                            case 5:
                                            case 'end':
                                                return _context6.stop();
                                        }
                                    }
                                }, _callee6, _this);
                            }));

                            return function (_x12) {
                                return _ref12.apply(this, arguments);
                            };
                        }());

                    case 2:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));

    return function drain(_x11) {
        return _ref11.apply(this, arguments);
    };
}();

var _prettyError = require('pretty-error');

var _prettyError2 = _interopRequireDefault(_prettyError);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _amqplib = require('amqplib');

var _genericPool = require('generic-pool');

var _array = require('../array');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var debug = require('debug')('mofier:amqp:connect');
var debugwarn = require('debug')('mofier:amqp:connect:warn');
var debugerror = require('debug')('mofier:amqp:connect:error');

var pe = new _prettyError2.default().skipNodeFiles();

;

var DEFAULT = exports.DEFAULT = 'default',
    pools = exports.pools = {};

;

;

;