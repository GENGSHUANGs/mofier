'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.findOne = exports.insert = exports.update = exports.createPoolWith = exports.build = exports.Builder = exports.inTxWith = exports.inTx = exports._query = exports.query = exports.drainAll = exports.drain = exports.connect = exports.createPool = exports.pools = exports.DEFAULT = exports.oname = undefined;

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
                                                    return findOne('show variables like "time_zone"', [], name);

                                                case 2:
                                                    _context.t0 = _context.sent;

                                                    if (_context.t0) {
                                                        _context.next = 5;
                                                        break;
                                                    }

                                                    _context.t0 = {};

                                                case 5:
                                                    return _context.abrupt('return', _context.t0.value);

                                                case 6:
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

var update = exports.update = function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(sql) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _connect.DEFAULT;
        var options = arguments[3];
        var _options = arguments[4];

        var _query, _ref5, _ref5$priority, priority, _ref5$transferOname, transferOname, _ref6, okPacket;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _query = void 0;

                        if (Object.prototype.toString.call(sql) !== '[object String]') {
                            _query = sql;
                            sql = params;
                            params = typeof name === 'undefined' ? [] : name;
                            name = typeof options === 'undefined' ? _connect.DEFAULT : options;
                            options = _options;
                        }
                        _ref5 = _options || {}, _ref5$priority = _ref5.priority, priority = _ref5$priority === undefined ? 1 : _ref5$priority, _ref5$transferOname = _ref5.transferOname, transferOname = _ref5$transferOname === undefined ? true : _ref5$transferOname;
                        _context3.next = 5;
                        return (0, _query2.query)(_query, sql, params, name, { priority: priority, transferOname: transferOname });

                    case 5:
                        _ref6 = _context3.sent;
                        okPacket = _ref6.okPacket;
                        return _context3.abrupt('return', okPacket);

                    case 8:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function update(_x6) {
        return _ref4.apply(this, arguments);
    };
}();

var insert = exports.insert = function () {
    var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _ref8, insertId;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return update.apply(undefined, args);

                    case 2:
                        _ref8 = _context4.sent;
                        insertId = _ref8.insertId;
                        return _context4.abrupt('return', insertId);

                    case 5:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function insert() {
        return _ref7.apply(this, arguments);
    };
}();

var findOne = exports.findOne = function () {
    var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(sql) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _connect.DEFAULT;
        var options = arguments[3];
        var _options = arguments[4];

        var _query, _ref10, _ref10$priority, priority, _ref10$transferOname, transferOname, _ref11, _ref11$rows, rows;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _query = void 0;

                        if (Object.prototype.toString.call(sql) !== '[object String]') {
                            _query = sql;
                            sql = params;
                            params = typeof name === 'undefined' ? [] : name;
                            name = typeof options === 'undefined' ? _connect.DEFAULT : options;
                            options = _options;
                        }
                        _ref10 = _options || {}, _ref10$priority = _ref10.priority, priority = _ref10$priority === undefined ? 1 : _ref10$priority, _ref10$transferOname = _ref10.transferOname, transferOname = _ref10$transferOname === undefined ? true : _ref10$transferOname;
                        _context5.next = 5;
                        return (0, _query2.query)(_query, sql, params, name, { priority: priority, transferOname: transferOname });

                    case 5:
                        _ref11 = _context5.sent;
                        _ref11$rows = _ref11.rows;
                        rows = _ref11$rows === undefined ? [] : _ref11$rows;
                        return _context5.abrupt('return', rows.length > 0 ? rows[0] : undefined);

                    case 9:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function findOne(_x9) {
        return _ref9.apply(this, arguments);
    };
}();

var _oname = require('./oname');

var _connect = require('./connect');

var _query2 = require('./query');

var _tx = require('./tx');

var _build = require('./build');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.oname = _oname.oname;
exports.DEFAULT = _connect.DEFAULT;
exports.pools = _connect.pools;
exports.createPool = _connect.createPool;
exports.connect = _connect.connect;
exports.drain = _connect.drain;
exports.drainAll = _connect.drainAll;
exports.query = _query2.query;
exports._query = _query2._query;
exports.inTx = _tx.inTx;
exports.inTxWith = _tx.inTxWith;
exports.Builder = _build.Builder;
exports.build = _build.build;

;

;

;

;