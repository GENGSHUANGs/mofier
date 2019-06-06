'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.inTxWith = exports.inTx = exports.oname = exports.findById = exports.findOne = exports.insert = exports.update = exports.query = exports.connect = exports.test = exports.escape = exports.end = exports.createPool = undefined;
exports.op = op;

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _prettyError = require('pretty-error');

var _prettyError2 = _interopRequireDefault(_prettyError);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var debug = require('debug')('mofier:db');
var debugerror = require('debug')('mofier:db:error');

var pe = new _prettyError2.default();
pe.skipNodeFiles();pe.skipPackage('express');

/**
创建连接池 */
var createPool = exports.createPool = function createPool(options) {
    if (typeof process._db_pool !== 'undefined') {
        throw new Error('connection pool has bean created!');
    }

    var _process$env = process.env,
        MYSQL_HOST = _process$env.MYSQL_HOST,
        MYSQL_PORT = _process$env.MYSQL_PORT,
        MYSQL_USER = _process$env.MYSQL_USER,
        MYSQL_PASSWD = _process$env.MYSQL_PASSWD,
        MYSQL_DATABASE = _process$env.MYSQL_DATABASE,
        MYSQL_LIMIT = _process$env.MYSQL_LIMIT,
        MYSQL_ACQUIRE_TIMEOUT = _process$env.MYSQL_ACQUIRE_TIMEOUT,
        MYSQL_QUEUE_LIMIT = _process$env.MYSQL_QUEUE_LIMIT;

    options = options || {
        connectionLimit: MYSQL_LIMIT,
        host: MYSQL_HOST,
        port: MYSQL_PORT,
        user: MYSQL_USER,
        password: MYSQL_PASSWD,
        database: MYSQL_DATABASE,
        acquireTimeout: MYSQL_ACQUIRE_TIMEOUT,
        queueLimit: MYSQL_QUEUE_LIMIT,
        debug: false,
        multipleStatements: true
    };
    debug('>>>>>>:', options);
    process._db_pool = _mysql2.default.createPool(options);
    return process._db_pool;
};

/**
释放所有的链接 */
var end = exports.end = function end() {
    return new _bluebird2.default(function (resolve, reject) {
        process._db_pool.end(function (err) {
            err ? reject(err) : resolve();
        });
    });
};

/**
数据转码 */
var escape = exports.escape = _mysql2.default.escape.bind(_mysql2.default);

var TEST_SQL = 'show variables like "time_zone"';

/**
测试 */
var test = exports.test = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var _ref2, rows, fields;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return inTx(function () {
                            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref3) {
                                var query = _ref3.query;
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                _context.next = 2;
                                                return query(TEST_SQL);

                                            case 2:
                                                _context.next = 4;
                                                return query(TEST_SQL);

                                            case 4:
                                                return _context.abrupt('return', _context.sent);

                                            case 5:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, undefined);
                            }));

                            return function (_x) {
                                return _ref4.apply(this, arguments);
                            };
                        }(), false);

                    case 2:
                        _ref2 = _context2.sent;
                        rows = _ref2.rows;
                        fields = _ref2.fields;
                        return _context2.abrupt('return', rows[0].value === 'Asia/Shanghai');

                    case 6:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function test() {
        return _ref.apply(this, arguments);
    };
}();

/**
获取mysql connection 连接
该方法属于底层方法的封装，不建议直接使用，除非特殊情况

USAGE:
```javascript
Promise.using(connect(),conn = > {
    return new Promise((resolve,reject) => { // must return promise , it will know when the connection use finished
        conn.query('....... '); // 不需要 显示release , it will release when use finished
    });
});
```*/
var connect = exports.connect = function connect() {
    var showlog = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    var _cached_release_func = void 0,
        _cached_commit_func = void 0,
        _cached_rollback_func = void 0;
    return new _bluebird2.default(function (resolve, reject) {
        process._db_pool.getConnection(function (err, conn) {
            if (err) {
                reject(err);
                return;
            }
            // 10内如果没有释放，则直接打印错误日志
            _cached_release_func = conn.release.bind(conn);
            var _released = false;
            conn.release = function () {
                _released = true;
                _cached_release_func();
            };
            setTimeout(function () {
                if (!_released) {
                    debugerror(pe.render(new Error('thread:' + conn.threadId + ':ERROR : connection was not use finished in 10s !!!!!!')));
                }
            }, 10000);

            _cached_commit_func = conn.commit.bind(conn);
            conn.commit = function (fn) {
                _cached_commit_func(fn);
                showlog && debug('thread:' + conn.threadId + ':IF commit');
            };
            _cached_rollback_func = conn.rollback.bind(conn);
            conn.rollback = function (fn) {
                _cached_rollback_func(fn);
                showlog && debug('thread:' + conn.threadId + ':IF rollback');
            };
            resolve(conn);
        });
    }).disposer(function (conn) {
        conn.release();
        showlog && debug('thread:' + conn.threadId + ':IF release');
        conn.release = _cached_release_func;
        conn.commit = _cached_commit_func;
        conn.rollback = _cached_rollback_func;
    });
};

/**
查询
@param {string} sql: SQL语句，支持 ? 占位符
@param {[object]} params:占位符数据数组

USAGE:
```javascript
query('select * from USER where ID = ?',1).then({rows,fields,release} => {
    // do something

    release(); // release the connection
},err => {
    // on error
})
```*/
var query = exports.query = function query(sql) {
    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
    }

    //
    if (Object.prototype.toString.call(sql) !== '[object String]' || typeof sql === 'undefined' || sql === null) {
        return (sql || query).apply(undefined, [params[0]].concat(_toConsumableArray(params.slice(1))));
    }

    return (0, _bluebird.using)(connect(sql !== TEST_SQL), function (conn) {
        return queryWith.apply(undefined, [conn, sql].concat(params));
    });
};

/**
更新 */
var update = exports.update = function () {
    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(sql) {
        for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            params[_key2 - 1] = arguments[_key2];
        }

        var _query, _ref6, rows;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _query = query;

                        if (Object.prototype.toString.call(sql) !== '[object String]' || typeof sql === 'undefined' || sql === null) {
                            _query = sql;
                            sql = params[0];
                            params = params.slice(1);
                        }

                        _context3.next = 4;
                        return (_query || query).apply(undefined, [sql].concat(_toConsumableArray(params)));

                    case 4:
                        _ref6 = _context3.sent;
                        rows = _ref6.rows;
                        return _context3.abrupt('return', rows);

                    case 7:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function update(_x3) {
        return _ref5.apply(this, arguments);
    };
}();

/**
差量更新帮助函数 */
update.pair = function (params, colname, value) {
    if (typeof value === 'undefined') {
        return '';
    }
    params.push(value);
    return ',' + colname + ' = ? ';
};

/**
添加 */
var insert = exports.insert = function () {
    var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
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
        }, _callee4, undefined);
    }));

    return function insert() {
        return _ref7.apply(this, arguments);
    };
}();

/**
查找一个 */
var findOne = exports.findOne = function () {
    var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(sql) {
        for (var _len4 = arguments.length, params = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
            params[_key4 - 1] = arguments[_key4];
        }

        var _query, _ref10, rows;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _query = query;

                        if (Object.prototype.toString.call(sql) !== '[object String]' || typeof sql === 'undefined' || sql === null) {
                            _query = sql;
                            sql = params[0];
                            params = params.slice(1);
                        }

                        _context5.next = 4;
                        return (_query || query).apply(undefined, [sql].concat(_toConsumableArray(params)));

                    case 4:
                        _ref10 = _context5.sent;
                        rows = _ref10.rows;

                        if (!(rows.length === 0)) {
                            _context5.next = 8;
                            break;
                        }

                        return _context5.abrupt('return', undefined);

                    case 8:
                        return _context5.abrupt('return', rows[0]);

                    case 9:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function findOne(_x4) {
        return _ref9.apply(this, arguments);
    };
}();

/**
根据ID查找 */
var findById = exports.findById = function () {
    var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(arg1, arg2, arg3) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        if (!(Object.prototype.toString.call(arg1) !== '[object String]' || typeof arg1 === 'undefined' || arg1 === null)) {
                            _context6.next = 6;
                            break;
                        }

                        _context6.next = 3;
                        return findOne(arg1, 'select * from ' + arg2 + ' where ID = ? ', arg3);

                    case 3:
                        return _context6.abrupt('return', _context6.sent);

                    case 6:
                        _context6.next = 8;
                        return findOne('select * from ' + arg2 + ' where ID = ? ', arg3);

                    case 8:
                        return _context6.abrupt('return', _context6.sent);

                    case 9:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function findById(_x5, _x6, _x7) {
        return _ref11.apply(this, arguments);
    };
}();

/**
使用指定connection查询

USAGE:
```javascript
queryWith(conn,'select * from USER where ID = ?',1).then({rows,fields,} => {
    // do something with result
},err => {
    // on error
}).finally(release);
```
*/
var queryWith = function queryWith(conn, sql) {
    for (var _len5 = arguments.length, params = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        params[_key5 - 2] = arguments[_key5];
    }

    return new _bluebird2.default(function (resolve, reject) {
        var showlog = sql !== TEST_SQL;
        showlog && debug('thread:' + conn.threadId + ':DQ : ' + sql.green + ' > ' + (params || []).map(function (p) {
            return '[' + p + ']';
        }).join(',').green);

        conn.query(sql, params, function (err, rows, fields) {
            if (err) {
                reject(err);
                return;
            }
            if (Array.isArray(rows[0])) {
                fields = fields && fields.length > 0 && fields[0];
                rows = rows && rows.length > 0 && rows[0];
            }
            fields = fields && fields.filter(function (field) {
                return !!field;
            }).map(function (field) {
                field.oname = field.name.indexOf('S_') === 0 ? field.name : oname(field.name);
                return field;
            });
            if (Array.isArray(rows)) {
                rows = rows.map(function (row) {
                    var oldRow = {
                        orow: function orow() {
                            return row;
                        }
                    };
                    fields.forEach(function (field) {
                        oldRow[field.oname] = row[field.name];
                    });
                    return oldRow;
                });
            }
            showlog && debug('thread:' + conn.threadId + ':DR : ' + JSON.stringify(rows).green);
            resolve({
                rows: rows,
                fields: fields
            });
        });
    });
};

/**
转换列名称为对象字段名称 */
var oname = exports.oname = function oname(name) {
    if (!name) {
        return name;
    }
    return name.split('_').map(function (str, idx) {
        if (str.length === 0) {
            return str;
        }
        str = str.toLowerCase();
        if (idx === 0) {
            return str;
        }
        return str.charAt(0).toUpperCase() + str.substr(1);
    }).join('');
};

/**
启动事务

USAGE:
```javascript
inTx().then({release,query,commit,rollback} => {
    query('select * from USER where ID =? ',1).then(commit,rollback).finally(release);
});

const {query,commit,rollback,release,} = await inTx();
```*/
var inTx = exports.inTx = function inTx() {
    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
    }

    (0, _assert2.default)(args.length <= 3);
    var query = void 0,
        fn = void 0,
        showlog = void 0;
    if (args.length === 3) {
        query = args[0];
        fn = args[1];
        showlog = args[2];
    } else if (args.length === 2 && args[0] && args[0].__conn || args.length === 2 && !args[0]) {
        query = args[0];
        fn = args[1];
    } else {
        fn = args[0];
        showlog = args[1];
    }

    if (query && query.__conn) {
        return inTxWith(query.__conn, fn);
    }

    return (0, _bluebird.using)(connect(showlog), function (conn) {
        return inTxWith(conn, fn);
    });
};

/**
使用指定连接启动事务

USAGE:
```javascript
inTxWith(conn).then(({query,commit,rollback,}) => {
    query('select * from USER where ID =? ',1).then(commit,rollback);
});
```*/
var inTxWith = exports.inTxWith = function inTxWith(conn, fn) {
    return new _bluebird2.default(function (resolve, reject) {
        conn.beginTransaction(function (err) {
            if (err) {
                reject(err);
                return;
            }

            var query = queryWith.bind(undefined, conn);
            query.__conn = conn;
            var tx = {
                query: query
            };

            return _bluebird2.default.try(function () {
                var r = fn(tx);
                return r;
            }).then(function (val) {
                conn.commit(function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(val);
                });
            }, function (err) {
                conn.rollback(function (_err) {
                    if (_err) {
                        reject(_err);
                        return;
                    }
                    reject(err);
                });
            });
        });
    });
};

/**
转换操作符 */
function op(_op) {
    return {
        eq: '=', // 等于
        ne: '<>', // 不等于
        ge: '>=', // 大于等于
        gt: '>', // 大于
        le: '<=', // 小于等于
        lt: '<', // 小于
        in: 'in' }[_op];
}
;