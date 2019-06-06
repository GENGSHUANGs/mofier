'use strict';

require('babel-polyfill');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mocha = require('mocha');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _connect = require('./connect');

var _channel = require('./channel');

var _observable = require('./observable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable */


var debug = require('debug')('mofier:amqp:connect:test');

var T = 50000;

(0, _mocha.describe)('AMQP', function () {
    it('初始化连接池', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var pool;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return (0, _connect.createPoolWith)('amqp://user:user@127.0.0.1:5672/');

                    case 2:
                        pool = _context2.sent;

                        debug({ size: pool.size, available: pool.available, borrowed: pool.borrowed, pending: pool.pending });
                        _context2.next = 6;
                        return (0, _bluebird.using)((0, _connect.connect)(), function () {
                            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(connection) {
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                debug({ size: pool.size, available: pool.available, borrowed: pool.borrowed, pending: pool.pending });
                                                (0, _chai.expect)(connection.close).to.be.a('function');

                                            case 2:
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

    it('创建频道', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return (0, _bluebird.using)((0, _channel.create)({ confirm: false }), function () {
                            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(channel) {
                                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
                                            case 0:
                                                (0, _chai.expect)(channel.assertQueue).to.be.a('function');

                                            case 1:
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

    it('监听消息', _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
        var observer;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return (0, _observable.observe)('test:queue', { durable: false, autoDelete: true });

                    case 2:
                        observer = _context6.sent;

                        observer.subscribe(function () {
                            var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(_ref6) {
                                var message = _ref6.message,
                                    ack = _ref6.ack,
                                    nack = _ref6.nack;
                                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                    while (1) {
                                        switch (_context5.prev = _context5.next) {
                                            case 0:
                                                _context5.prev = 0;

                                                debug('\u4ECE\u9891\u9053\u63A5\u6536\u5230\u6D88\u606F:test:queue,%j', message.content.toString());
                                                _context5.next = 4;
                                                return ack();

                                            case 4:
                                                _context5.next = 10;
                                                break;

                                            case 6:
                                                _context5.prev = 6;
                                                _context5.t0 = _context5['catch'](0);

                                                debugerror(_context5.t0);
                                                nack();

                                            case 10:
                                            case 'end':
                                                return _context5.stop();
                                        }
                                    }
                                }, _callee5, undefined, [[0, 6]]);
                            }));

                            return function (_x3) {
                                return _ref7.apply(this, arguments);
                            };
                        }(), function (err) {
                            console.error(err);
                            throw err;
                        }, console.log.bind(console, '订阅结束了~~ '));

                    case 4:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }))).timeout(T);

    it('发送消息', _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        _context8.next = 2;
                        return (0, _bluebird.using)((0, _channel.create)({ confirm: false }), function () {
                            var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(channel) {
                                var i;
                                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                                    while (1) {
                                        switch (_context7.prev = _context7.next) {
                                            case 0:
                                                _context7.next = 2;
                                                return channel.assertQueue('test:queue', { exclusive: false, durable: false, autoDelete: true });

                                            case 2:
                                                i = 0;

                                            case 3:
                                                if (!(i < 100)) {
                                                    _context7.next = 9;
                                                    break;
                                                }

                                                _context7.next = 6;
                                                return channel.sendToQueue('test:queue', new Buffer(i + 1 + ' >: ooo' + new Date().getTime()), { noAck: false });

                                            case 6:
                                                i++;
                                                _context7.next = 3;
                                                break;

                                            case 9:
                                            case 'end':
                                                return _context7.stop();
                                        }
                                    }
                                }, _callee7, undefined);
                            }));

                            return function (_x4) {
                                return _ref9.apply(this, arguments);
                            };
                        }());

                    case 2:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, undefined);
    }))).timeout(T);

    it('等待', _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        _context9.next = 2;
                        return new _bluebird2.default(function (resolve) {
                            setTimeout(resolve, 10 * 1000);
                        });

                    case 2:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, undefined);
    }))).timeout(T);
});