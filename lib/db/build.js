'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.build = build;

var _index = require('./index.js');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
判断参数是否为空

规则如下
undefined   : true
null        : false,
''          : false,
[]          : true,
[undefined,]: true
[null,]     : false
['',]       : false */
function empty(val) {
    var isdeep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (typeof val === 'undefined') {
        return true;
    }

    if (val === null) {
        return false;
    }

    if (Object.prototype.toString.call(val) === '[object String]') {
        return false;
    }

    if (Object.prototype.toString.call(val) === '[object Boolean]') {
        return !val;
    }

    if (Array.isArray(val)) {
        if (val.length === 0) {
            return true;
        }

        if (isdeep === true) {
            return false;
        }

        // 如果数组中有一个数据有值，则直接可用
        for (var i = 0; i < val.length; i++) {
            var isempty = empty(val[i], true);
            if (!isempty) {
                return false;
            }
        }

        return true;
    }
    return false;
}
;

// console.log('--------->:新测试alishop账号:2982', empty([] ) );

/**
判断条件是否处理空的情况
field前面如果加的有 ? ，则需要处理空的情况；如果数据为空，则返回false，否则返回处理过的field和value */
function testif(field, values, tester) {
    // 不需要处理，传递什么值就是什么值
    if (field.indexOf('?') !== 0) {
        return {
            field: field,
            values: values
        };
    }

    field = field.substring(1);
    if (tester === true) {
        return {
            field: field,
            values: values
        };
    } else if (tester === false) {
        return false;
    }

    var isempty = empty(values);
    if (isempty) {
        return false;
    }

    return {
        field: field,
        values: values
    };
}
;

function build(table, builder) {
    return new Builder(table, builder);
}
;

/**
构建器 */

var Builder = function () {
    function Builder(table, builder) {
        _classCallCheck(this, Builder);

        this.table = table;
        this.updateFields = [];
        this.conditionFields = [];
        this.append(builder);
    }

    /**
    设置表 */


    _createClass(Builder, [{
        key: 'table',
        value: function table(_table) {
            this.table = _table;
            return this;
        }

        /**
        追加条件 */

    }, {
        key: 'append',
        value: function append(builder) {
            if (!builder) {
                return this;
            }

            this.conditionFields = this.conditionFields.concat(builder.conditionFields);
            return this;
        }

        /**
        添加条件判断 */

    }, {
        key: 'cond',
        value: function cond(op, field, values) {
            var r = testif(field, values);
            if (r === false) {
                return this;
            }

            this.conditionFields.push({
                field: op + ' ' + r.field,
                values: r.values
            });
            return this;
        }

        /**
        and 判断 */

    }, {
        key: 'and',
        value: function and(field) {
            for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                values[_key - 1] = arguments[_key];
            }

            return this.cond('and', field, values);
        }

        /**
        批量and条件 */

    }, {
        key: 'andm',
        value: function andm() {
            for (var _len2 = arguments.length, pairs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                pairs[_key2] = arguments[_key2];
            }

            if (pairs.length % 2 !== 0) {
                throw new Error('invalid and multiple , arguments must be paired:' + pairs.join(','));
            }

            for (var i = 0; i < pairs.length; i += 2) {
                this.and(pairs[i], pairs[i + 1]);
            }
            return this;
        }

        /**
        or 判断 */

    }, {
        key: 'or',
        value: function or(field) {
            for (var _len3 = arguments.length, values = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                values[_key3 - 1] = arguments[_key3];
            }

            return this.cond('or', field, values);
        }

        /**
        设置更新的字段 */

    }, {
        key: 'set',
        value: function set(field) {
            for (var _len4 = arguments.length, values = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                values[_key4 - 1] = arguments[_key4];
            }

            var r = testif(field, values);
            if (r === false) {
                return this;
            }

            this.updateFields.push(r);
            return this;
        }

        /**
        批量设置更新字段 */

    }, {
        key: 'setm',
        value: function setm() {
            for (var _len5 = arguments.length, pairs = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                pairs[_key5] = arguments[_key5];
            }

            if (pairs.length % 2 !== 0) {
                throw new Error('invalid set multiple , arguments must be paired:' + pairs.join(','));
            }

            for (var i = 0; i < pairs.length; i += 2) {
                this.set(pairs[i], pairs[i + 1]);
            }
            return this;
        }
    }, {
        key: '_build_update_fields_sql',
        value: function _build_update_fields_sql() {
            var sqls = [];
            var parameters = [];
            this.updateFields.forEach(function (_ref) {
                var field = _ref.field,
                    values = _ref.values;

                sqls.push(field);
                parameters = parameters.concat(values || []);
            });
            var sql = sqls.join(',');
            if (sqls.length > 0) {
                sql = 'set ' + sql + ' ';
            }
            return {
                sql: sql,
                parameters: parameters
            };
        }
    }, {
        key: '_build_condition_fields_sql',
        value: function _build_condition_fields_sql() {
            var sqls = [];
            var parameters = [];
            this.conditionFields.forEach(function (_ref2) {
                var field = _ref2.field,
                    values = _ref2.values;

                sqls.push(field);
                parameters = parameters.concat(values || []);
            });
            return {
                sql: sqls.join(' '),
                parameters: parameters
            };
        }

        /**
        执行更新操作 */

    }, {
        key: 'update',
        value: function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_query, _check) {
                var updateFieldsSQL, conditionFieldsSQL;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!(_check !== 'nocheck' && this.conditionFields.length === 0)) {
                                    _context.next = 2;
                                    break;
                                }

                                throw new Error('invalid update operation , condition must not empty !');

                            case 2:
                                updateFieldsSQL = this._build_update_fields_sql();
                                conditionFieldsSQL = this._build_condition_fields_sql();
                                _context.next = 6;
                                return _index.update.apply(undefined, [_query, 'update ' + this.table + ' ' + updateFieldsSQL.sql + ' where 1 = 1 ' + conditionFieldsSQL.sql + ' '].concat(_toConsumableArray(updateFieldsSQL.parameters), _toConsumableArray(conditionFieldsSQL.parameters)));

                            case 6:
                                return _context.abrupt('return', _context.sent);

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function update(_x2, _x3) {
                return _ref3.apply(this, arguments);
            }

            return update;
        }()

        /**
        查询 */

    }, {
        key: 'select',
        value: function () {
            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(sql, orderBy, skip, limit, _query) {
                var conditionFieldsSQL;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (Object.prototype.toString.call(limit) !== '[object Number]') {
                                    _query = limit;
                                    limit = undefined;
                                }
                                if (Object.prototype.toString.call(skip) !== '[object Number]') {
                                    _query = skip;
                                    skip = undefined;
                                }
                                if (Object.prototype.toString.call(orderBy) !== '[object String]') {
                                    _query = orderBy;
                                    orderBy = undefined;
                                }
                                if (Object.prototype.toString.call(sql) !== '[object String]') {
                                    _query = sql;
                                    sql = undefined;
                                }
                                conditionFieldsSQL = this._build_condition_fields_sql();
                                _context2.next = 7;
                                return _index.query.apply(undefined, [_query, ('select ' + (sql || '*') + ' from ' + this.table + ' where 1 = 1 ' + conditionFieldsSQL.sql + ' ' + (orderBy ? 'order by ' + orderBy + ' ' : '') + ' ' + (typeof skip !== 'undefined' && skip !== null ? 'limit ' + skip + ',' + limit : '')).replace(/\{\$table\}/g, this.table)].concat(_toConsumableArray(conditionFieldsSQL.parameters)));

                            case 7:
                                return _context2.abrupt('return', _context2.sent);

                            case 8:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function select(_x4, _x5, _x6, _x7, _x8) {
                return _ref4.apply(this, arguments);
            }

            return select;
        }()

        /**
        查询单个数据 */

    }, {
        key: 'one',
        value: function () {
            var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(sql, _query) {
                var conditionFieldsSQL;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (Object.prototype.toString.call(sql) !== '[object String]') {
                                    _query = sql;
                                    sql = undefined;
                                }
                                conditionFieldsSQL = this._build_condition_fields_sql();
                                _context3.next = 4;
                                return _index.findOne.apply(undefined, [_query, ((sql || 'select * from ' + this.table + ' ') + ' where 1 = 1 ' + conditionFieldsSQL.sql).replace(/\{\$table\}/g, this.table)].concat(_toConsumableArray(conditionFieldsSQL.parameters)));

                            case 4:
                                return _context3.abrupt('return', _context3.sent);

                            case 5:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function one(_x9, _x10) {
                return _ref5.apply(this, arguments);
            }

            return one;
        }()

        /**
        查询数量 */

    }, {
        key: 'count',
        value: function () {
            var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(sql, _query) {
                var _ref7, count;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (Object.prototype.toString.call(sql) !== '[object String]') {
                                    _query = sql;
                                    sql = undefined;
                                }
                                _context4.next = 3;
                                return this.one(sql || 'select count(*) as COUNT from ' + this.table + ' ', _query);

                            case 3:
                                _ref7 = _context4.sent;
                                count = _ref7.count;
                                return _context4.abrupt('return', count);

                            case 6:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function count(_x11, _x12) {
                return _ref6.apply(this, arguments);
            }

            return count;
        }()

        /**
        删除 */

    }, {
        key: 'delete',
        value: function () {
            var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(_query, _check) {
                var conditionFieldsSQL;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (!(_check !== 'nocheck' && this.conditionFields.length === 0)) {
                                    _context5.next = 2;
                                    break;
                                }

                                throw new Error('invalid delete operation , condition must not empty !');

                            case 2:
                                conditionFieldsSQL = this._build_condition_fields_sql();
                                _context5.next = 5;
                                return _index.update.apply(undefined, [_query, 'delete from ' + this.table + ' where 1 = 1 ' + conditionFieldsSQL.sql + ' '].concat(_toConsumableArray(conditionFieldsSQL.parameters)));

                            case 5:
                                return _context5.abrupt('return', _context5.sent);

                            case 6:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function _delete(_x13, _x14) {
                return _ref8.apply(this, arguments);
            }

            return _delete;
        }()

        /**
        查询所有数据 */

    }, {
        key: 'all',
        value: function () {
            var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(orderBy, _query) {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                if (Object.prototype.toString.call(orderBy) !== '[object String]') {
                                    _query = orderBy;
                                    orderBy = undefined;
                                }
                                _context6.next = 3;
                                return this.list(undefined, undefined, orderBy, _query);

                            case 3:
                                return _context6.abrupt('return', _context6.sent);

                            case 4:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function all(_x15, _x16) {
                return _ref9.apply(this, arguments);
            }

            return all;
        }()

        /**
        分页查询 */

    }, {
        key: 'list',
        value: function () {
            var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(skip, limit, orderBy, _query) {
                var withSkip, conditionFieldsSQL, _ref11, rows;

                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                if (Object.prototype.toString.call(orderBy) !== '[object String]' && !_query) {
                                    _query = orderBy;
                                    orderBy = undefined;
                                }
                                withSkip = typeof skip !== 'undefined' && skip !== null;
                                conditionFieldsSQL = this._build_condition_fields_sql();
                                _context7.next = 5;
                                return _index.query.apply(undefined, [_query, '\n                select * from ' + this.table + '\n                where 1 = 1 ' + conditionFieldsSQL.sql + '\n                ' + (orderBy ? 'order by ' + orderBy : '') + '\n                ' + (withSkip ? 'limit ?,? ' : '')].concat(_toConsumableArray(conditionFieldsSQL.parameters), _toConsumableArray(withSkip ? [skip, limit] : [])));

                            case 5:
                                _ref11 = _context7.sent;
                                rows = _ref11.rows;
                                return _context7.abrupt('return', rows);

                            case 8:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function list(_x17, _x18, _x19, _x20) {
                return _ref10.apply(this, arguments);
            }

            return list;
        }()
    }]);

    return Builder;
}();

exports.default = Builder;

;