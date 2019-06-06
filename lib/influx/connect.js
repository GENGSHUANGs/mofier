'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.drainAll = exports.drain = exports.connect = exports.createPoolWith = exports.pools = exports.DEFAULT = exports.createPool = undefined;

var createPool = exports.createPool = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(url) {
        var create = function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt('return', new _influx.InfluxDB(url));

                            case 1:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            return function create() {
                return _ref3.apply(this, arguments);
            };
        }();

        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref2$min = _ref2.min,
            min = _ref2$min === undefined ? 2 : _ref2$min,
            _ref2$max = _ref2.max,
            max = _ref2$max === undefined ? 10 : _ref2$max;

        var pool;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        pool = void 0;

                        ;

                        return _context3.abrupt('return', pool = (0, _genericPool.createPool)({ create: create, destroy: function () {
                                var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(client) {
                                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                        while (1) {
                                            switch (_context2.prev = _context2.next) {
                                                case 0:
                                                case 'end':
                                                    return _context2.stop();
                                            }
                                        }
                                    }, _callee2, this);
                                }));

                                function destroy(_x3) {
                                    return _ref4.apply(this, arguments);
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

    return function createPool(_x2) {
        return _ref.apply(this, arguments);
    };
}();

var createPoolWith = exports.createPoolWith = function () {
    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(url) {
        var _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref6$min = _ref6.min,
            min = _ref6$min === undefined ? 2 : _ref6$min,
            _ref6$max = _ref6.max,
            max = _ref6$max === undefined ? 10 : _ref6$max;

        var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return createPool(url, { min: min, max: max });

                    case 2:
                        return _context4.abrupt('return', pools[name] = _context4.sent);

                    case 3:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function createPoolWith(_x6) {
        return _ref5.apply(this, arguments);
    };
}();

var connect = exports.connect = function () {
    var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT;

        var _ref8 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref8$priority = _ref8.priority,
            priority = _ref8$priority === undefined ? 1 : _ref8$priority;

        var pool;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        pool = pools[name];
                        return _context5.abrupt('return', pool.acquire(priority).disposer(function (client, p) {
                            if (p.isRejected()) {
                                return;
                            }
                            return pool.release(client);
                        }));

                    case 2:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function connect() {
        return _ref7.apply(this, arguments);
    };
}();

var drain = exports.drain = function () {
    var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
        var _this = this;

        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.next = 2;
                        return (0, _array.forEach)(Object.keys(pools).filter(function (_name) {
                            return typeof name === 'undefined' || name === null ? true : _name === name;
                        }), function () {
                            var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(name) {
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

                            return function (_x10) {
                                return _ref10.apply(this, arguments);
                            };
                        }());

                    case 2:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));

    return function drain() {
        return _ref9.apply(this, arguments);
    };
}();

var drainAll = exports.drainAll = function () {
    var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        _context8.next = 2;
                        return drain(undefined);

                    case 2:
                        return _context8.abrupt('return', _context8.sent);

                    case 3:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, this);
    }));

    return function drainAll() {
        return _ref11.apply(this, arguments);
    };
}();

var _prettyError = require('pretty-error');

var _prettyError2 = _interopRequireDefault(_prettyError);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _influx = require('influx');

var _genericPool = require('generic-pool');

var _array = require('../array');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var debug = require('debug')('mofier:influx:pool');
var pe = new _prettyError2.default().skipNodeFiles();

;

var DEFAULT = exports.DEFAULT = 'default',
    pools = exports.pools = {};

;

;

;

;