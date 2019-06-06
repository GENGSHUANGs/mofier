'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.multi = exports.connectTo = exports.createPoolWith = exports.drainAll = exports.drain = exports.connect = exports.createPool = exports.DEFAULT = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var createPoolWith = exports.createPoolWith = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(options) {
        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref2$min = _ref2.min,
            min = _ref2$min === undefined ? 2 : _ref2$min,
            _ref2$max = _ref2.max,
            max = _ref2$max === undefined ? 10 : _ref2$max;

        var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _connect.DEFAULT;
        var pool;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return (0, _connect.createPoolWith)(options, { min: min, max: max }, name);

                    case 2:
                        pool = _context2.sent;
                        return _context2.abrupt('return', { pool: pool, ready: function () {
                                var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_context) {
                                        while (1) {
                                            switch (_context.prev = _context.next) {
                                                case 0:
                                                    _context.next = 2;
                                                    return (0, _bluebird.using)((0, _connect.connect)(name), function (client) {
                                                        return client.infoAsync();
                                                    });

                                                case 2:
                                                    return _context.abrupt('return', _context.sent);

                                                case 3:
                                                case 'end':
                                                    return _context.stop();
                                            }
                                        }
                                    }, _callee, this);
                                }));

                                function ready() {
                                    return _ref3.apply(this, arguments);
                                }

                                return ready;
                            }()
                        });

                    case 4:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function createPoolWith(_x3) {
        return _ref.apply(this, arguments);
    };
}();

var connectTo = exports.connectTo = function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(processor) {
        var _this = this;

        var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _connect.DEFAULT;

        var _ref5 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            _ref5$priority = _ref5.priority,
            priority = _ref5$priority === undefined ? 1 : _ref5$priority;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.next = 2;
                        return (0, _bluebird.using)((0, _connect.connect)(name, { priority: priority }), function () {
                            var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(client) {
                                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                    while (1) {
                                        switch (_context4.prev = _context4.next) {
                                            case 0:
                                                client.$clean = function () {
                                                    var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(pattern) {
                                                        var _ref8, _ref9, _ref9$, _keys;

                                                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                                            while (1) {
                                                                switch (_context3.prev = _context3.next) {
                                                                    case 0:
                                                                        _context3.next = 2;
                                                                        return client.multi([['KEYS', pattern]]).execAsync();

                                                                    case 2:
                                                                        _ref8 = _context3.sent;
                                                                        _ref9 = _slicedToArray(_ref8, 1);
                                                                        _ref9$ = _ref9[0];
                                                                        _keys = _ref9$ === undefined ? [] : _ref9$;
                                                                        _context3.next = 8;
                                                                        return client.multi(_keys.map(function (_key) {
                                                                            return ['DEL', _key];
                                                                        })).execAsync();

                                                                    case 8:
                                                                    case 'end':
                                                                        return _context3.stop();
                                                                }
                                                            }
                                                        }, _callee3, _this);
                                                    }));

                                                    return function (_x8) {
                                                        return _ref7.apply(this, arguments);
                                                    };
                                                }();
                                                _context4.next = 3;
                                                return processor(client);

                                            case 3:
                                                return _context4.abrupt('return', _context4.sent);

                                            case 4:
                                            case 'end':
                                                return _context4.stop();
                                        }
                                    }
                                }, _callee4, _this);
                            }));

                            return function (_x7) {
                                return _ref6.apply(this, arguments);
                            };
                        }());

                    case 2:
                        return _context5.abrupt('return', _context5.sent);

                    case 3:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function connectTo(_x6) {
        return _ref4.apply(this, arguments);
    };
}();

var multi = exports.multi = function () {
    var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(commands) {
        var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _connect.DEFAULT;

        var _ref11 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            _ref11$priority = _ref11.priority,
            priority = _ref11$priority === undefined ? 1 : _ref11$priority;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return connectTo(function (client) {
                            return client.multi(commands).execAsync();
                        }, name, { priority: priority });

                    case 2:
                        return _context6.abrupt('return', _context6.sent);

                    case 3:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));

    return function multi(_x11) {
        return _ref10.apply(this, arguments);
    };
}();

var _bluebird = require('bluebird');

var _connect = require('./connect');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.DEFAULT = _connect.DEFAULT;
exports.createPool = _connect.createPool;
exports.connect = _connect.connect;
exports.drain = _connect.drain;
exports.drainAll = _connect.drainAll;

;

;

;