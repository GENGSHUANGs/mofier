import PrettyError from 'pretty-error';
import Promise, { using, promisify, promisifyAll, } from 'bluebird';
import redis from 'redis';
promisifyAll(redis.RedisClient.prototype );
promisifyAll(redis.Multi.prototype );

import { createPool as _create_pool, } from 'generic-pool';
import { forEach, } from '../array';

const debug = require('debug' )('mofier:kv2:connect:pool' );
const debugerror = require('debug' )('mofier:kv2:connect:pool:error' );
const pe = new PrettyError().skipNodeFiles();

/**
@param {object} options {url,....}*/
export async function createPool( options, {min = 2, max = 10, } = {} ) {
    options = Object.prototype.toString.call(options ) === '[object Object]' ? options : { url: options, };
    let pool;
    options.no_ready_check = (typeof options.no_ready_check !== 'undefined' && options.no_ready_check !== null) ? options.no_ready_check : true;
    options.enable_offline_queue = (typeof options.enable_offline_queue !== 'undefined' && options.enable_offline_queue !== null) ? options.enable_offline_queue : true;
    options.retry_strategy = options.retry_strategy || (options => { // 1s 重连
        return 100;
    });
    async function create() {
        debug('创建连接 -> : %j', options );
        const client = redis.createClient(options );
        debug('准备绑定事件到 connection id : %d', client.connection_id );
        client.on('error', err => {
            debugerror('连接发生错误，准备销毁连接:%e', err );
            pool.destroy(client );
            throw err;
        } );
        return client;
    }
    ;

    return pool = _create_pool({ create, async destroy( client ) {
            return await client.end(true );
    }, }, { min, max, Promise, } );
}
;

export const DEFAULT = 'default',
    pools = {};

export async function createPoolWith( options, {min = 2, max = 10, } = {}, name = DEFAULT ) {
    return pools[ name ] = await createPool(options, { min, max, } );
}
;

export async function connect( name = DEFAULT, {priority = 1, } = {} ) {
    const pool = pools[ name ];
    return pool.acquire(priority ).disposer(( client, p ) => {
        if ( p.isRejected() ) {
            return;
        }
        return pool.release(client );
    } );
}
;

export async function drain( name = DEFAULT ) {
    await forEach(Object.keys(pools ).filter(_name => typeof name === 'undefined' || name === null ? true : _name === name ), async name => {
        const pool = pools[ name ];
        await pool.drain();
        pool.clear();
        delete pools[ name ];
        debug('清理连接池 %s', name );
    } );
}
;

export async function drainAll() {
    return await drain(undefined );
}
;
