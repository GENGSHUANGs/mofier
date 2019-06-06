import PrettyError from 'pretty-error';
import Promise, { using, } from 'bluebird';
import { InfluxDB, } from 'influx';
import { createPool as _create_pool, } from 'generic-pool';
import { forEach, } from '../array';

const debug = require('debug' )('mofier:influx:pool' );
const pe = new PrettyError().skipNodeFiles();

export async function createPool( url, {min = 2, max = 10, } = {} ) {
    let pool;
    async function create() {
        return new InfluxDB(url );
    }
    ;

    return pool = _create_pool({ create, async destroy( client ) {}, }, { min, max, Promise, } );
}
;

export const DEFAULT = 'default',
    pools = {};

export async function createPoolWith( url, {min = 2, max = 10, } = {}, name = DEFAULT ) {
    return pools[ name ] = await createPool(url, { min, max, } );
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
    } );
}
;

export async function drainAll() {
    return await drain(undefined );
}
;
