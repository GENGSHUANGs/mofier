"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
迭代 */
var forEach = exports.forEach = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(items, processor) {
        var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var replies = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
        var item, reply;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!(!items || items.length === 0 || idx >= items.length)) {
                            _context.next = 2;
                            break;
                        }

                        return _context.abrupt("return");

                    case 2:
                        item = items[idx];
                        _context.next = 5;
                        return processor(item, idx, items);

                    case 5:
                        reply = _context.sent;
                        _context.next = 8;
                        return forEach(items, processor, idx + 1, replies.concat(reply));

                    case 8:
                        return _context.abrupt("return", replies);

                    case 9:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function forEach(_x3, _x4) {
        return _ref.apply(this, arguments);
    };
}();

/**
map */
var map = exports.map = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(items, processor) {
        var _this = this;

        var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var ary;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        ary = [];
                        _context3.next = 3;
                        return forEach(items, function () {
                            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(item, idx, items) {
                                var r;
                                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                    while (1) {
                                        switch (_context2.prev = _context2.next) {
                                            case 0:
                                                _context2.next = 2;
                                                return processor(item, idx, items);

                                            case 2:
                                                r = _context2.sent;

                                                ary.push(r);

                                            case 4:
                                            case "end":
                                                return _context2.stop();
                                        }
                                    }
                                }, _callee2, _this);
                            }));

                            return function (_x8, _x9, _x10) {
                                return _ref3.apply(this, arguments);
                            };
                        }(), idx);

                    case 3:
                        return _context3.abrupt("return", ary);

                    case 4:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function map(_x6, _x7) {
        return _ref2.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

;
;