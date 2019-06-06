import { oname, } from './oname';
export { oname, };

import { DEFAULT, pools, createPool, connect, drain, drainAll, createPoolWith as _createPoolWith, } from './connect';
export { DEFAULT, pools, createPool, connect, drain, drainAll, };

import { query, _query, } from './query';
export { query, _query };

import { inTx, inTxWith, } from './tx';
export { inTx, inTxWith, };

import { Builder, build, } from './build';
export { Builder, build, };

export async function createPoolWith( options, {min = 2, max = 10, } = {}, name = DEFAULT ) {
    const pool = await _createPoolWith(options, { min, max, }, name );
    return { pool, async ready() {
            return (await findOne('show variables like "time_zone"', [], name ) || {}).value;
    }, };
}
;

export async function update( sql, params = [], name = DEFAULT, options, _options ) {
    let _query;
    if ( Object.prototype.toString.call(sql ) !== '[object String]' ) {
        _query = sql;
        sql = params;
        params = typeof name === 'undefined' ? [] : name ;
        name = typeof options === 'undefined' ? DEFAULT : options;
        options = _options ;
    }
    const {priority = 1, transferOname = true, } = _options || {};
    const {okPacket, } = await query(_query, sql, params, name, { priority, transferOname, } );
    return okPacket;
}
;

export async function insert( ...args ) { // sql,params = [],name = DEFAULT,options={...}
    const {insertId, } = await update.apply(undefined, args );
    return insertId;
}
;

export async function findOne( sql, params = [], name = DEFAULT, options, _options ) {
    let _query;
    if ( Object.prototype.toString.call(sql ) !== '[object String]' ) {
        _query = sql;
        sql = params;
        params = typeof name === 'undefined' ? [] : name ;
        name = typeof options === 'undefined' ? DEFAULT : options;
        options = _options ;
    }
    const {priority = 1, transferOname = true, } = _options || {};
    const {rows = [], } = await query(_query, sql, params, name, { priority, transferOname, } );
    return rows.length > 0 ? rows[ 0 ] : undefined;
}
;
