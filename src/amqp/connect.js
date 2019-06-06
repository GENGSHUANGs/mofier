import PrettyError from 'pretty-error';
import Promise, { using, } from 'bluebird';
import { connect as _connect, } from 'amqplib';
import { createPool as _create_pool, } from 'generic-pool';
import { forEach, } from '../array';

const debug = require('debug' )('mofier:amqp:connect' );
const debugwarn = require('debug' )('mofier:amqp:connect:warn' );
const debugerror = require('debug' )('mofier:amqp:connect:error' );

const pe = new PrettyError().skipNodeFiles();

export async function createPool( url, {heartbeat = 1, locale = 'zh_CN', noDelay = true, } = {}, {min = 2, max = 10, } = {} ) {
    let pool;
    async function create() {
        const connection = await _connect(url, { heartbeat, locale, noDelay, } );
        connection.on('error', err => {
            debugerror(pe.render(err ) );
            pool.destroy(connection );
            throw err;
        } );
        connection.on('blocked', reason => {
            debugwarn(`AMQP不通,原因:`, reason );
        } );
        connection.on('unblocked', () => {
            debug(`AMQP已恢复畅通` );
        } );
        return connection;
    }
    ;

    return pool = _create_pool({ create, async destroy( connection ) {
            return await connection.close();
    }, }, { min, max, Promise, } );
}
;

export const DEFAULT = 'default',
    pools = {};

export async function createPoolWith( url, {heartbeat = 1, locale = 'zh_CN', noDelay = true, } = {}, {min = 2, max = 10, } = {}, name = DEFAULT ) {
    return pools[ name ] = await createPool(url, { heartbeat, locale, noDelay, }, { min, max, } );
}
;

export async function connect( name = DEFAULT, {priority = 1, } = {} ) {
    const pool = pools[ name ];
    return pool.acquire(priority ).disposer(( connection, p ) => {
        if ( p.isRejected() ) {
            return;
        }
        return pool.release(connection );
    } );
}
;

export async function drain( name ) {
    await forEach(Object.keys(pools ).filter(_name => typeof name === 'undefined' || name === null ? true : _name === name ), async name => {
        const pool = pools[ name ];
        await pool.drain();
        pool.clear();
        delete pools[ name ];
    } );
}
;
