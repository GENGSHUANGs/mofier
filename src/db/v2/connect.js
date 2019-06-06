import './hack';
import mysql from 'mysql';
import Promise, { using, promisify, } from 'bluebird';
import PrettyError from 'pretty-error';
import assert from 'assert';

const debug = require('debug' )('mofier:db:v2:connect' );
const trace = require('debug' )('mofier:db:v2:connect:trace' );
const debugwarn = require('debug' )('mofier:db:v2:connect:warn' );
const debugerror = require('debug' )('mofier:db:v2:connect:error' );

const pe = new PrettyError().skipNodeFiles();

/**
创建连接池 */
export function createPool( options, {min, max, } ) {
    options.debug = typeof options.debug !== 'undefined' ? options.debug : false;
    options.multipleStatements = typeof options.multipleStatements !== 'undefined' ? options.multipleStatements : true;
    options.connectionLimit = typeof max !== undefined ? max : (options.connectionLimit || 10);
    debug('创建连接池 : %j', options );
    return mysql.createPool(options );
}
;

export const DEFAULT = 'default',
    pools = global.__db_pools = {};

export async function createPoolWith( options, {min = 2, max = 10, } = {}, name = DEFAULT ) {
    return pools[ name ] = await createPool(options, { min, max, } );
}
;

export function _connect( name = DEFAULT, {priority = 1, } = {} ) {
    const pool = pools[ name ];
    return promisify(pool.getConnection.bind(pool ) )().disposer(( conn ) => {
        conn.release();
    } );
}
;

export async function connect( name = DEFAULT, {priority = 1, } = {} ) {
    let _cached_release_func,
        _cached_commit_func,
        _cached_rollback_func;

    return new Promise(( resolve, reject ) => {
        const pool = pools[ name ];
        trace('获取连接,%s,%s', name, !!pool );
        promisify(pool.getConnection.bind(pool ) )().then(conn => {
            trace('进程:%s:获取连接,%s', conn.threadId, name );
            // 10内如果没有释放，则直接打印错误日志
            _cached_release_func = conn.release.bind(conn );
            let _released = false;
            conn.release = () => {
                _released = true;
                _cached_release_func();
                trace('进程:%s:释放连接,%s', conn.threadId, name );
            };
            setTimeout(() => {
                if ( !_released ) {
                    debugwarn(pe.render(new Error(`进程:${conn.threadId}:ERROR : 超过10s未释放 !!!!!!` ) ) );
                }
            }, 10000 );

            _cached_commit_func = conn.commit.bind(conn );
            conn.commit = ( fn ) => {
                _cached_commit_func(fn );
                trace(`进程:%s:事务提交,%s , 👻`, conn.threadId, name );
            };
            _cached_rollback_func = conn.rollback.bind(conn );
            conn.rollback = ( fn ) => {
                _cached_rollback_func(fn );
                trace('进程:%s:事务回滚,%s <<<<< ---------------- 😵😵😵😵😵😵😵😵😵😵', conn.threadId, name );
            };
            resolve(conn );
        } ).error(reject );
    } ).disposer(conn => {
        conn.release();
        trace('进程:%s:结束,%s', conn.threadId, name );
        conn.release = _cached_release_func;
        conn.commit = _cached_commit_func;
        conn.rollback = _cached_rollback_func;
    } );
}
;

export async function drain( name = DEFAULT ) {
    await forEach(Object.keys(pools ).filter(_name => typeof name === 'undefined' || name === null ? true : _name === name ), async name => {
        const pool = pools[ name ];
        await pool.end();
        delete pools[ name ];
    } );
}
;

export async function drainAll() {
    return await drain(undefined );
}
;
