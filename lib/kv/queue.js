'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pushOnFaild = exports.push = exports.trigger = undefined;

/**
*/
var trigger = exports.trigger = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(key, processor) {
        var _this = this;

        var force = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var val, idx;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        if (!(!force && processings.indexOf(key) !== -1)) {
                            _context2.next = 2;
                            break;
                        }

                        return _context2.abrupt('return');

                    case 2:

                        if (!force) {
                            processings.push(key);
                        }
                        _context2.next = 5;
                        return (0, _index.lpop)(key);

                    case 5:
                        val = _context2.sent;

                        if (val) {
                            _context2.next = 10;
                            break;
                        }

                        idx = processings.indexOf(key);

                        processings.splice(idx, 1);
                        return _context2.abrupt('return');

                    case 10:
                        _context2.prev = 10;
                        _context2.next = 13;
                        return processor(val);

                    case 13:
                        _context2.next = 19;
                        break;

                    case 15:
                        _context2.prev = 15;
                        _context2.t0 = _context2['catch'](10);

                        console.log(pe.render(_context2.t0));
                        push(key, val, processor);

                    case 19:

                        setTimeout(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            _context.next = 2;
                                            return trigger(key, processor, true);

                                        case 2:
                                        case 'end':
                                            return _context.stop();
                                    }
                                }
                            }, _callee, _this);
                        })), 0);

                    case 20:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[10, 15]]);
    }));

    return function trigger(_x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

/**
*/
var push = exports.push = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(key, val, processor) {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return (0, _index.rpush)(key, val);

                    case 2:
                        setTimeout(_asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                while (1) {
                                    switch (_context3.prev = _context3.next) {
                                        case 0:
                                            _context3.next = 2;
                                            return trigger(key, processor);

                                        case 2:
                                        case 'end':
                                            return _context3.stop();
                                    }
                                }
                            }, _callee3, _this2);
                        })), 0);

                    case 3:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function push(_x4, _x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}();

/***/
var pushOnFaild = exports.pushOnFaild = function () {
    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(key, val, processor) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.prev = 0;
                        _context5.next = 3;
                        return processor(val);

                    case 3:
                        return _context5.abrupt('return', _context5.sent);

                    case 6:
                        _context5.prev = 6;
                        _context5.t0 = _context5['catch'](0);

                        console.log(pe.render(_context5.t0));
                        _context5.next = 11;
                        return push(key, val, processor);

                    case 11:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this, [[0, 6]]);
    }));

    return function pushOnFaild(_x7, _x8, _x9) {
        return _ref5.apply(this, arguments);
    };
}();

var _prettyError = require('pretty-error');

var _prettyError2 = _interopRequireDefault(_prettyError);

var _index = require('./index.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var pe = new _prettyError2.default();
pe.skipNodeFiles();pe.skipPackage('express');

var processings = [];
;
;
;