'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.observe = undefined;

var observe = exports.observe = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(queue) {
        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref2$prefetch = _ref2.prefetch,
            prefetch = _ref2$prefetch === undefined ? 1 : _ref2$prefetch,
            _ref2$noAck = _ref2.noAck,
            noAck = _ref2$noAck === undefined ? false : _ref2$noAck,
            error = _ref2.error;

        var _this = this;

        var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            _ref3$confirm = _ref3.confirm,
            confirm = _ref3$confirm === undefined ? false : _ref3$confirm,
            _ref3$priority = _ref3.priority,
            priority = _ref3$priority === undefined ? 1 : _ref3$priority;

        var cname = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _connect.DEFAULT;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        return _context3.abrupt('return', new _bluebird2.default(function (resolve, reject) {
                            (0, _bluebird.using)((0, _channel.create)({ confirm: confirm, priority: priority }, cname), function (channel) {
                                return new _bluebird2.default(_asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                        while (1) {
                                            switch (_context2.prev = _context2.next) {
                                                case 0:
                                                    // 长时间占用，不允许释放~~
                                                    try {
                                                        // await channel.assertQueue(queue, { durable, autoDelete, } );
                                                        channel.prefetch(prefetch);
                                                        resolve(_Rx.Observable.create(function (observer) {
                                                            channel.consume(queue, function () {
                                                                var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(message) {
                                                                    var r;
                                                                    return regeneratorRuntime.wrap(function _callee$(_context) {
                                                                        while (1) {
                                                                            switch (_context.prev = _context.next) {
                                                                                case 0:
                                                                                    _context.prev = 0;
                                                                                    _context.next = 3;
                                                                                    return observer.next({ message: message, ack: noAck ? undefined : channel.ack.bind(channel, message), nack: noAck ? undefined : channel.nack.bind(channel, message) });

                                                                                case 3:
                                                                                    r = _context.sent;
                                                                                    _context.next = 10;
                                                                                    break;

                                                                                case 6:
                                                                                    _context.prev = 6;
                                                                                    _context.t0 = _context['catch'](0);

                                                                                    debugerror(pe.render(_context.t0));
                                                                                    error && error(_context.t0);

                                                                                case 10:
                                                                                case 'end':
                                                                                    return _context.stop();
                                                                            }
                                                                        }
                                                                    }, _callee, _this, [[0, 6]]);
                                                                }));

                                                                return function (_x5) {
                                                                    return _ref5.apply(this, arguments);
                                                                };
                                                            }(), { noAck: noAck });
                                                        }));
                                                    } catch (err) {
                                                        debugerror(pe.render(err));
                                                        reject(err);
                                                    }

                                                case 1:
                                                case 'end':
                                                    return _context2.stop();
                                            }
                                        }
                                    }, _callee2, _this);
                                })));
                            }).catch(reject);
                        }));

                    case 1:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function observe(_x4) {
        return _ref.apply(this, arguments);
    };
}();

var _prettyError = require('pretty-error');

var _prettyError2 = _interopRequireDefault(_prettyError);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Rx = require('rxjs/Rx');

var _connect = require('./connect');

var _channel = require('./channel');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var debugerror = require('debug')('mofier:amqp:observable:error');
var pe = new _prettyError2.default().skipNodeFiles();

;