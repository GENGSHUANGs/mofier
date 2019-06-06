'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

require('babel-polyfill');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mocha = require('mocha');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _ = require('./');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable */


var debug = require('debug')('mofier:kv2:connect:test');

var T = 50000;

(0, _mocha.describe)('kv2', function () {
    it('初始化连接池', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var _ref2, pool, ready, info;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return (0, _.createPoolWith)('redis://:@127.0.0.1:6379/0');

                    case 2:
                        _ref2 = _context2.sent;
                        pool = _ref2.pool;
                        ready = _ref2.ready;

                        debug('测试ready , ', ready);
                        _context2.next = 8;
                        return ready();

                    case 8:
                        info = _context2.sent;

                        debug('INFO >: ', typeof info === 'undefined' ? 'undefined' : _typeof(info), info);
                        debug({ size: pool.size, available: pool.available, borrowed: pool.borrowed, pending: pool.pending });
                        _context2.next = 13;
                        return (0, _bluebird.using)((0, _.connect)(), function () {
                            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(connection) {
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                debug({ size: pool.size, available: pool.available, borrowed: pool.borrowed, pending: pool.pending });
                                                (0, _chai.expect)(connection.end).to.be.a('function');

                                            case 2:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, undefined);
                            }));

                            return function (_x) {
                                return _ref3.apply(this, arguments);
                            };
                        }());

                    case 13:
                        debug({ size: pool.size, available: pool.available, borrowed: pool.borrowed, pending: pool.pending });

                    case 14:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }))).timeout(T);

    it('connectTo', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var t;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return (0, _.connectTo)(function () {
                            var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(client) {
                                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
                                            case 0:
                                                _context3.next = 2;
                                                return client.setAsync('test:key', String(new Date().getTime()));

                                            case 2:
                                                _context3.next = 4;
                                                return client.getAsync('test:key');

                                            case 4:
                                                return _context3.abrupt('return', _context3.sent);

                                            case 5:
                                            case 'end':
                                                return _context3.stop();
                                        }
                                    }
                                }, _callee3, undefined);
                            }));

                            return function (_x2) {
                                return _ref5.apply(this, arguments);
                            };
                        }());

                    case 2:
                        t = _context4.sent;

                        (0, _chai.expect)(t).to.be.a('string');

                    case 4:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }))).timeout(T);

    it('clean', _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return (0, _.connectTo)(function () {
                            var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(client) {
                                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                    while (1) {
                                        switch (_context5.prev = _context5.next) {
                                            case 0:
                                                _context5.next = 2;
                                                return client.$clean('*');

                                            case 2:
                                            case 'end':
                                                return _context5.stop();
                                        }
                                    }
                                }, _callee5, undefined);
                            }));

                            return function (_x3) {
                                return _ref7.apply(this, arguments);
                            };
                        }());

                    case 2:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }))).timeout(T);

    it('multi', _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
        var _ref9, _ref10, t;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.next = 2;
                        return (0, _.multi)([['SET', 'test:key', new Date().getTime()], ['GET', 'test:key']]);

                    case 2:
                        _ref9 = _context7.sent;
                        _ref10 = _slicedToArray(_ref9, 2);
                        t = _ref10[1];

                        (0, _chai.expect)(t).to.be.a('string');

                    case 6:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, undefined);
    }))).timeout(T);

    it('drainAll', _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        _context8.next = 2;
                        return (0, _.drainAll)();

                    case 2:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, undefined);
    }))).timeout(T);
});