'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.write = undefined;

var write = exports.write = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(points) {
        var _this = this;

        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            precision = _ref2.precision,
            retentionPolicy = _ref2.retentionPolicy,
            database = _ref2.database;

        var pname = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _connect.DEFAULT;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        points = [].concat(points || []);
                        debug('>> \u5199\u5165InfluxDB BY:%j \u8FDE\u63A5\u6C60 %s, \u9009\u9879:%j', [].concat(points || []), pname, { precision: precision, retentionPolicy: retentionPolicy, database: database });
                        _context2.next = 4;
                        return (0, _bluebird.using)((0, _connect.connect)(pname), function () {
                            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(client) {
                                var r;
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                _context.next = 2;
                                                return client.writePoints(points, { precision: precision, retentionPolicy: retentionPolicy, database: database });

                                            case 2:
                                                r = _context.sent;

                                                debug('<< \u5199\u5165InfluxDB BY:%j \u8FDE\u63A5\u6C60 %s, \u9009\u9879:%j\n%j', [].concat(points || []), pname, { precision: precision, retentionPolicy: retentionPolicy, database: database }, r);
                                                return _context.abrupt('return', r);

                                            case 5:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, _this);
                            }));

                            return function (_x4) {
                                return _ref3.apply(this, arguments);
                            };
                        }());

                    case 4:
                        return _context2.abrupt('return', _context2.sent);

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function write(_x3) {
        return _ref.apply(this, arguments);
    };
}();

var _bluebird = require('bluebird');

var _connect = require('./connect');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var debug = require('debug')('mofier:influx:write');

;