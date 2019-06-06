import mysql from 'mysql';
import Promise, { using, } from 'bluebird';
import PrettyError from 'pretty-error';
import assert from 'assert';

const debug = require('debug' )('mofier:db' );
const debugerror = require('debug' )('mofier:db:error' );

const pe = new PrettyError();
pe.skipNodeFiles(); pe.skipPackage('express' );

/**
创建连接池 */
export const createPool = ( options ) => {
    if ( typeof process._db_pool !== 'undefined' ) {
        throw new Error('connection pool has bean created!' );
    }

    const {MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWD, MYSQL_DATABASE, MYSQL_LIMIT, MYSQL_ACQUIRE_TIMEOUT, MYSQL_QUEUE_LIMIT} = process.env;
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
        multipleStatements: true,
    };
    debug('>>>>>>:', options );
    process._db_pool = mysql.createPool(options );
    return process._db_pool;
};


/**
释放所有的链接 */
export const end = () => new Promise(( resolve, reject ) => {
    process._db_pool.end(( err ) => {
        err ? reject(err ) : resolve();
    } );
} );

/**
数据转码 */
export const escape = mysql.escape.bind(mysql );

const TEST_SQL = 'show variables like "time_zone"';

/**
测试 */
export const test = async () => {
    const {rows, fields, } = await inTx(async ( {query, } ) => {
        await query(TEST_SQL );
        return await query(TEST_SQL );
    }, false );
    return rows[ 0 ].value === 'Asia/Shanghai';
};

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
export const connect = ( showlog = true ) => {
    let _cached_release_func,
        _cached_commit_func,
        _cached_rollback_func;
    return new Promise(( resolve, reject ) => {
        process._db_pool.getConnection(( err, conn ) => {
            if ( err ) {
                reject(err );
                return;
            }
            // 10内如果没有释放，则直接打印错误日志
            _cached_release_func = conn.release.bind(conn );
            let _released = false;
            conn.release = () => {
                _released = true;
                _cached_release_func();
            };
            setTimeout(() => {
                if ( !_released ) {
                    debugerror(pe.render(new Error(`thread:${conn.threadId}:ERROR : connection was not use finished in 10s !!!!!!` ) ) );
                }
            }, 10000 );

            _cached_commit_func = conn.commit.bind(conn );
            conn.commit = ( fn ) => {
                _cached_commit_func(fn );
                showlog && debug(`thread:${conn.threadId}:IF commit` );
            };
            _cached_rollback_func = conn.rollback.bind(conn );
            conn.rollback = ( fn ) => {
                _cached_rollback_func(fn );
                showlog && debug(`thread:${conn.threadId}:IF rollback` );
            };
            resolve(conn );
        } );
    } ).disposer(conn => {
        conn.release();
        showlog && debug(`thread:${conn.threadId}:IF release` );
        conn.release = _cached_release_func;
        conn.commit = _cached_commit_func;
        conn.rollback = _cached_rollback_func;
    } );
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
export const query = ( sql, ...params ) => {
    //
    if ( Object.prototype.toString.call(sql ) !== '[object String]' || typeof sql === 'undefined' || sql === null ) {
        return (sql || query)(params[ 0 ], ...( params.slice(1 )) );
    }

    return using(connect(sql !== TEST_SQL ), conn => {
        return queryWith(conn, sql, ...params );
    } );
};

/**
更新 */
export const update = async ( sql, ...params ) => {
    let _query = query;
    if ( Object.prototype.toString.call(sql ) !== '[object String]' || typeof sql === 'undefined' || sql === null ) {
        _query = sql ;
        sql = params[ 0 ];
        params = params.slice(1 );
    }

    const {rows, } = await (_query || query)(sql, ...params );
    return rows;
};

/**
差量更新帮助函数 */
update.pair = ( params, colname, value ) => {
    if ( typeof value === 'undefined' ) {
        return '';
    }
    params.push(value );
    return `,${colname} = ? `;
};

/**
添加 */
export const insert = async ( ...args ) => {
    const {insertId, } = await update.apply(undefined, args );
    return insertId;
};

/**
查找一个 */
export const findOne = async ( sql, ...params ) => {
    let _query = query;
    if ( Object.prototype.toString.call(sql ) !== '[object String]' || typeof sql === 'undefined' || sql === null ) {
        _query = sql ;
        sql = params[ 0 ];
        params = params.slice(1 );
    }

    const {rows, } = await (_query || query)(sql, ...params );
    if ( rows.length === 0 ) {
        return undefined;
    }
    return rows[ 0 ];
};

/**
根据ID查找 */
export const findById = async ( arg1, arg2, arg3 ) => { // _query,tableName,id or tableName,id
    if ( Object.prototype.toString.call(arg1 ) !== '[object String]' || typeof arg1 === 'undefined' || arg1 === null ) {
        return await findOne(arg1, `select * from ${arg2} where ID = ? `, arg3 );
    } else {
        return await findOne(`select * from ${arg2} where ID = ? `, arg3 );
    }
};

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
const queryWith = ( conn, sql, ...params ) => new Promise(( resolve, reject ) => {
    const showlog = sql !== TEST_SQL;
    showlog && debug(`thread:${conn.threadId}:DQ : ${sql.green} > ${ (params || []).map(p => `[${p}]` ).join(',' ).green}` );

    conn.query(sql, params, ( err, rows, fields ) => {
        if ( err ) {
            reject(err );
            return;
        }
        if ( Array.isArray(rows[ 0 ] ) ) {
            fields = fields && fields.length > 0 && fields[ 0 ];
            rows = rows && rows.length > 0 && rows[ 0 ];
        }
        fields = fields && fields.filter(field => !!field ).map(( field ) => {
            field.oname = field.name.indexOf('S_' ) === 0 ? field.name : oname(field.name );
            return field;
        } );
        if ( Array.isArray(rows ) ) {
            rows = rows.map(( row ) => {
                const oldRow = {
                    orow: () => row
                };
                fields.forEach(( field ) => {
                    oldRow[ field.oname ] = row[ field.name ];
                } );
                return oldRow;
            } );
        }
        showlog && debug(`thread:${conn.threadId}:DR : ${ JSON.stringify(rows ).green}` );
        resolve({
            rows,
            fields
        } );
    } );
} );

/**
转换列名称为对象字段名称 */
export const oname = ( name ) => {
    if ( !name ) {
        return name;
    }
    return name.split('_' ).map(( str, idx ) => {
        if ( str.length === 0 ) {
            return str;
        }
        str = str.toLowerCase();
        if ( idx === 0 ) {
            return str;
        }
        return str.charAt(0 ).toUpperCase() + str.substr(1 );
    } ).join('' );
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
export const inTx = ( ...args ) => {
    assert(args.length <= 3 );
    let query,
        fn,
        showlog;
    if ( args.length === 3 ) {
        [query, fn, showlog] = args;
    } else if ( (args.length === 2 && args[ 0 ] && args[ 0 ].__conn) || (args.length === 2 && !args[ 0 ]) ) {
        [query, fn] = args;
    } else {
        [fn, showlog] = args;
    }

    if ( query && query.__conn ) {
        return inTxWith(query.__conn, fn );
    }

    return using(connect(showlog ), conn => {
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
export const inTxWith = ( conn, fn ) => {
    return new Promise(( resolve, reject ) => {
        conn.beginTransaction(err => {
            if ( err ) {
                reject(err );
                return;
            }

            const query = queryWith.bind(undefined, conn );
            query.__conn = conn;
            const tx = {
                query,
            };

            return Promise.try(() => {
                let r = fn(tx );
                return r;
            } ).then(val => {
                conn.commit(err => {
                    if ( err ) {
                        reject(err );
                        return;
                    }
                    resolve(val );
                } );
            }, err => {
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
};

/**
转换操作符 */
export function op( _op ) {
    return ({
        eq: '=', // 等于
        ne: '<>', // 不等于
        ge: '>=', // 大于等于
        gt: '>', // 大于
        le: '<=', // 小于等于
        lt: '<', // 小于
        in: 'in', // in
    })[ _op ];
}
;
