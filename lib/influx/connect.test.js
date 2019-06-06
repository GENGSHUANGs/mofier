'use strict';

require('babel-polyfill');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mocha = require('mocha');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _ = require('./');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable */


var debug = require('debug')('mofier:influx:connect:test');

var T = 50000;

(0, _mocha.describe)('InfluxDB', function () {
    it('初始化连接池', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var pool;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return (0, _.createPoolWith)('http://nighthawk:nighthawk@127.0.0.1:8086/nighthawk');

                    case 2:
                        pool = _context2.sent;

                        debug({ size: pool.size, available: pool.available, borrowed: pool.borrowed, pending: pool.pending });
                        _context2.next = 6;
                        return (0, _bluebird.using)((0, _.connect)(), function () {
                            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(client) {
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                debug({ size: pool.size, available: pool.available, borrowed: pool.borrowed, pending: pool.pending });
                                                (0, _chai.expect)(client.writePoints).to.be.a('function');
                                                (0, _chai.expect)(client.query).to.be.a('function');

                                            case 3:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, undefined);
                            }));

                            return function (_x) {
                                return _ref2.apply(this, arguments);
                            };
                        }());

                    case 6:
                        debug({ size: pool.size, available: pool.available, borrowed: pool.borrowed, pending: pool.pending });

                    case 7:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }))).timeout(T);

    it('写入', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return (0, _bluebird.using)((0, _.connect)(), function () {
                            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(client) {
                                var r;
                                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
                                            case 0:
                                                _context3.next = 2;
                                                return (0, _.write)({ measurement: 'test', tags: { type: 't1' }, fields: { value: 100 }, timestamp: new Date() });

                                            case 2:
                                                r = _context3.sent;

                                                console.log(r);

                                            case 4:
                                            case 'end':
                                                return _context3.stop();
                                        }
                                    }
                                }, _callee3, undefined);
                            }));

                            return function (_x2) {
                                return _ref4.apply(this, arguments);
                            };
                        }());

                    case 2:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }))).timeout(T);

    it('读取', _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return (0, _bluebird.using)((0, _.connect)(), function () {
                            var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(client) {
                                var r;
                                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                    while (1) {
                                        switch (_context5.prev = _context5.next) {
                                            case 0:
                                                _context5.next = 2;
                                                return (0, _.query)('select * from test ');

                                            case 2:
                                                r = _context5.sent;

                                                (0, _chai.expect)(r).to.be.a('array');

                                            case 4:
                                            case 'end':
                                                return _context5.stop();
                                        }
                                    }
                                }, _callee5, undefined);
                            }));

                            return function (_x3) {
                                return _ref6.apply(this, arguments);
                            };
                        }());

                    case 2:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }))).timeout(T);
});