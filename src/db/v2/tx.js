import Promise, { using, } from 'bluebird';

import { DEFAULT, connect, } from './connect';
import { queryWith, } from './query';

const debug = require('debug' )('mofier:db:v2:tx' );
const trace = require('debug' )('mofier:db:v2:tx:trace' );
const debugwarn = require('debug' )('mofier:db:v2:tx:warn' );
const debugerror = require('debug' )('mofier:db:v2:tx:error' );

/**
启动事务

USAGE:
```javascript
inTx().then(({release,query,commit,rollback}) => {
    query('select * from USER where ID =? ',1).then(commit,rollback).finally(release);
});

const {query,commit,rollback,release,} = await inTx();
```*/
export const inTx = ( fn, name = DEFAULT, options , _options ) => {
    // 是否继承
    const inherit = typeof fn === 'undefined' || fn === null || !!(fn && fn.__conn);
    let query;
    if ( inherit ) { // 参数偏移
        query = fn;
        fn = name ;
        name = typeof options === 'undefined' ? DEFAULT : options;
        options = _options;
    }

    // 继承查询
    if ( query && query.__conn ) {
        return inTxWith(query.__conn, fn );
    }

    // 非继承查询
    const {priority = 1, } = options || {};
    return using(connect(name, { priority, } ), conn => {
        return inTxWith(conn, fn );
    } );
};

/**
使用指定连接启动事务

USAGE:
```javascript
inTxWith(conn).then(({query,commit,rollback,}) => {
    query('select * from USER where ID =? ',1).then(commit,rollback);
});
```*/
export function inTxWith( conn, fn ) {
    return new Promise(( resolve, reject ) => {
        conn.beginTransaction(err => {
            trace(`进程:${conn.threadId}:开始事务` );
            if ( err ) {
                reject(err );
                return;
            }

            // 代理
            const query = ( sql, params, {transferOname = true, } = {} ) => {
                return queryWith(conn, sql, params, { transferOname, } );
            };

            // 保持
            query.__conn = conn;

            // 处理查询逻辑
            return Promise.try(fn.bind(undefined, { query, } ) ).then(val => { // 自动提交
                conn.commit(err => {
                    if ( err ) {
                        reject(err );
                        return;
                    }
                    resolve(val );
                } );
            }, err => { // 自动回滚
                conn.rollback(_err => {
                    if ( _err ) {
                        reject(_err );
                        return;
                    }
                    reject(err );
                } );
            } );
        } );
    } );
}
;
