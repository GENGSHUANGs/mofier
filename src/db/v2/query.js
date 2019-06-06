import Promise, { promisify, using, } from 'bluebird';

import { DEFAULT, connect, } from './connect';
import { oname, } from './oname';

const debug = require('debug' )('mofier:db:v2:query' );
const trace = require('debug' )('mofier:db:v2:query:trace' );
const debugwarn = require('debug' )('mofier:db:v2:query:warn' );
const debugerror = require('debug' )('mofier:db:v2:query:error' );

export async function queryWith( conn, sql, params, {transferOname = true, } = {} ) {
    debug(`进程:${conn.threadId}:查询 : ${sql} > ${ (params || []).map(p => `[${p}]` ).join(',' )}` );
    const {rows, fields, } = await new Promise(( resolve, reject ) => {
        conn.query(sql, params, ( err, rows, fields ) => {
            if ( err ) {
                return reject(err );
            }
            resolve({ rows, fields } );
        } );
    } );

    const isokpacket = Object.prototype.toString.call(rows ) === '[object Object]';

    // 处理批量查询
    const batch = Array.isArray(rows[ 0 ] );
    let r = [];
    if ( !batch ) {
        r = [ { rows, fields, } ];
    } else {
        r = rows.map(( _rows, idx ) => {
            return { rows: _rows, fields: fields[ idx ], };
        } )
    }

    // 字段重命名
    r = !transferOname ? r : r.map(( {rows, fields, } ) => {
        fields = fields && fields.filter(field => !!field ).map(( field ) => {
            field.oname = oname(field.name );
            return field;
        } );
        rows = isokpacket ? rows : rows.map(( row ) => { // 把数据库字段结构转换为驼峰结构
            const oldRow = { orow: () => row };
            fields.forEach(( field ) => {
                oldRow[ field.oname ] = row[ field.name ];
            } );
            return oldRow;
        } );
        const okPacket = isokpacket ? rows : undefined;
        const _rows = isokpacket ? undefined : rows;
        return { okPacket, ok: okPacket, rows: _rows, fields, };
    } );

    debug('进程:%s:结果 : [%d] >: %j', conn.threadId, r.length, r.map(( {rows, } ) => rows ) );
    return r.length > 1 ? r : r[ 0 ]; // 如果只有一个查询结果，则直接返回第一个查询结果
}
;

export function query( sql, params = [], name, options, _options ) {
    // 是否继承
    const inherit = (Object.prototype.toString.call(sql ) !== '[object String]') || typeof sql === 'undefined' || sql === null;
    if ( inherit ) { // 处理继承的情况
        // 参数偏移
        const _query = sql || query;
        sql = params;
        params = Object.prototype.toString.call(name ) === '[object String]' ? [] : name;
        name = typeof options === 'undefined' ? DEFAULT : options;
        options = _options ;
        return _query(sql, params, name, options );
    }

    // 查询
    const {priority = 1, transferOname = true, } = options || {};
    return using(connect(name, { priority, } ), conn => {
        return queryWith(conn, sql, params, { transferOname, } );
    } );
}
;
