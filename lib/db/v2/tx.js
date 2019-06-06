'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.inTx = undefined;
exports.inTxWith = inTxWith;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _connect = require('./connect');

var _query = require('./query');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('mofier:db:v2:tx');
var trace = require('debug')('mofier:db:v2:tx:trace');
var debugwarn = require('debug')('mofier:db:v2:tx:warn');
var debugerror = require('debug')('mofier:db:v2:tx:error');

/**
启动事务

USAGE:
```javascript
inTx().then(({release,query,commit,rollback}) => {
    query('select * from USER where ID =? ',1).then(commit,rollback).finally(release);
});

const {query,commit,rollback,release,} = await inTx();
```*/
var inTx = exports.inTx = function inTx(fn) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _connect.DEFAULT;
    var options = arguments[2];
    var _options = arguments[3];

    // 是否继承
    var inherit = typeof fn === 'undefined' || fn === null || !!(fn && fn.__conn);
    var query = void 0;
    if (inherit) {
        // 参数偏移
        query = fn;
        fn = name;
        name = typeof options === 'undefined' ? _connect.DEFAULT : options;
        options = _options;
    }

    // 继承查询
    if (query && query.__conn) {
        return inTxWith(query.__conn, fn);
    }

    // 非继承查询

    var _ref = options || {},
        _ref$priority = _ref.priority,
        priority = _ref$priority === undefined ? 1 : _ref$priority;

    return (0, _bluebird.using)((0, _connect.connect)(name, { priority: priority }), function (conn) {
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
function inTxWith(conn, fn) {
    return new _bluebird2.default(function (resolve, reject) {
        conn.beginTransaction(function (err) {
            trace('\u8FDB\u7A0B:' + conn.threadId + ':\u5F00\u59CB\u4E8B\u52A1');
            if (err) {
                reject(err);
                return;
            }

            // 代理
            var query = function query(sql, params) {
                var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                    _ref2$transferOname = _ref2.transferOname,
                    transferOname = _ref2$transferOname === undefined ? true : _ref2$transferOname;

                return (0, _query.queryWith)(conn, sql, params, { transferOname: transferOname });
            };

            // 保持
            query.__conn = conn;

            // 处理查询逻辑
            return _bluebird2.default.try(fn.bind(undefined, { query: query })).then(function (val) {
                // 自动提交
                conn.commit(function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(val);
                });
            }, function (err) {
                // 自动回滚
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
}
;