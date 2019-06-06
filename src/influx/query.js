import { using, } from 'bluebird';

import { DEFAULT as DEFAULT_POOL_NAME, connect, } from './connect';

const debug = require('debug' )('mofier:influx:query' );

export async function query( queries, {precision, retentionPolicy, database, } = {}, pname = DEFAULT_POOL_NAME ) {
    debug(`>> 查询InfluxDB BY:%j 连接池 %s, 选项:%j`, [].concat(queries || [] ), pname, { precision, retentionPolicy, database, } );
    return await using(connect(pname ), async client => {
        const r = await client.query(queries, { precision, retentionPolicy, database, } );
        debug(`<< 查询InfluxDB BY:%j 连接池 %s, 选项:%j
 %j`, [].concat(queries || [] ), pname, { precision, retentionPolicy, database, }, r );
        return r;
    } );
}
;
