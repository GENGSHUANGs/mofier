'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.queryWith = undefined;

var queryWith = exports.queryWith = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(conn, sql, params) {
        var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
            _ref2$transferOname = _ref2.transferOname,
            transferOname = _ref2$transferOname === undefined ? true : _ref2$transferOname;

        var _ref3, rows, fields, isokpacket, batch, r;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        debug('\u8FDB\u7A0B:' + conn.threadId + ':\u67E5\u8BE2 : ' + sql + ' > ' + (params || []).map(function (p) {
                            return '[' + p + ']';
                        }).join(','));
                        _context.next = 3;
                        return new _bluebird2.default(function (resolve, reject) {
                            conn.query(sql, params, function (err, rows, fields) {
                                if (err) {
                                    return reject(err);
                                }
                                resolve({ rows: rows, fields: fields });
                            });
                        });

                    case 3:
                        _ref3 = _context.sent;
                        rows = _ref3.rows;
                        fields = _ref3.fields;
                        isokpacket = Object.prototype.toString.call(rows) === '[object Object]';

                        // 处理批量查询

                        batch = Array.isArray(rows[0]);
                        r = [];

                        if (!batch) {
                            r = [{ rows: rows, fields: fields }];
                        } else {
                            r = rows.map(function (_rows, idx) {
                                return { rows: _rows, fields: fields[idx] };
                            });
                        }

                        // 字段重命名
                        r = !transferOname ? r : r.map(function (_ref4) {
                            var rows = _ref4.rows,
                                fields = _ref4.fields;

                            fields = fields && fields.filter(function (field) {
                                return !!field;
                            }).map(function (field) {
                                field.oname = (0, _oname.oname)(field.name);
                                return field;
                            });
                            rows = isokpacket ? rows : rows.map(function (row) {
                                // 把数据库字段结构转换为驼峰结构
                                var oldRow = { orow: function orow() {
                                        return row;
                                    } };
                                fields.forEach(function (field) {
                                    oldRow[field.oname] = row[field.name];
                                });
                                return oldRow;
                            });
                            var okPacket = isokpacket ? rows : undefined;
                            var _rows = isokpacket ? undefined : rows;
                            return { okPacket: okPacket, ok: okPacket, rows: _rows, fields: fields };
                        });

                        debug('进程:%s:结果 : [%d] >: %j', conn.threadId, r.length, r.map(function (_ref5) {
                            var rows = _ref5.rows;
                            return rows;
                        }));
                        return _context.abrupt('return', r.length > 1 ? r : r[0]);

                    case 13:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function queryWith(_x2, _x3, _x4) {
        return _ref.apply(this, arguments);
    };
}();

exports.query = query;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _connect = require('./connect');

var _oname = require('./oname');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var debug = require('debug')('mofier:db:v2:query');
var trace = require('debug')('mofier:db:v2:query:trace');
var debugwarn = require('debug')('mofier:db:v2:query:warn');
var debugerror = require('debug')('mofier:db:v2:query:error');

;

function query(sql) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var name = arguments[2];
    var options = arguments[3];
    var _options = arguments[4];

    // 是否继承
    var inherit = Object.prototype.toString.call(sql) !== '[object String]' || typeof sql === 'undefined' || sql === null;
    if (inherit) {
        // 处理继承的情况
        // 参数偏移
        var _query = sql || query;
        sql = params;
        params = Object.prototype.toString.call(name) === '[object String]' ? [] : name;
        name = typeof options === 'undefined' ? _connect.DEFAULT : options;
        options = _options;
        return _query(sql, params, name, options);
    }

    // 查询

    var _ref6 = options || {},
        _ref6$priority = _ref6.priority,
        priority = _ref6$priority === undefined ? 1 : _ref6$priority,
        _ref6$transferOname = _ref6.transferOname,
        transferOname = _ref6$transferOname === undefined ? true : _ref6$transferOname;

    return (0, _bluebird.using)((0, _connect.connect)(name, { priority: priority }), function (conn) {
        return queryWith(conn, sql, params, { transferOname: transferOname });
    });
}
;