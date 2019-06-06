import { using, } from 'bluebird';

import { DEFAULT as DEFAULT_POOL_NAME, connect, } from './connect';

const debug = require('debug' )('mofier:influx:write' );

export async function write( points, {precision, retentionPolicy, database, } = {}, pname = DEFAULT_POOL_NAME ) {
    points = [].concat(points || [] );
    debug(`>> 写入InfluxDB BY:%j 连接池 %s, 选项:%j`, [].concat(points || [] ), pname, { precision, retentionPolicy, database, } );
    return await using(connect(pname ), async client => {
        const r = await client.writePoints(points, { precision, retentionPolicy, database, } );
        debug(`<< 写入InfluxDB BY:%j 连接池 %s, 选项:%j
%j`, [].concat(points || [] ), pname, { precision, retentionPolicy, database, }, r );
        return r;
    } );
}
;
