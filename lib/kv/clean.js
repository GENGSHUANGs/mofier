'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('./index');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
删除所有的数据 */
exports.default = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _keys, commands;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return (0, _index.keys)('*');

                    case 2:
                        _context.t0 = _context.sent;

                        if (_context.t0) {
                            _context.next = 5;
                            break;
                        }

                        _context.t0 = [];

                    case 5:
                        _keys = _context.t0;
                        commands = _keys.map(function (key) {
                            return ['DEL', key];
                        });
                        _context.next = 9;
                        return (0, _index.multi)(commands);

                    case 9:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    function clean() {
        return _ref.apply(this, arguments);
    }

    return clean;
}();