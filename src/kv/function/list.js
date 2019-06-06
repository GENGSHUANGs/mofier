import { promisify, using, } from 'bluebird';
import { connect, } from '../connect';

import { DEFAULT, } from './index.js';

/**
链表右push */
export function rpush( key, value ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.rpush.bind(client ) )(key, value );
    } );
}
;

/**
链表左pop*/
export function lpop( key, processor ) {
    return using(connect(DEFAULT ), async client => {
        const _lpop = promisify(client.lpop.bind(client ) );
        if ( !processor ) {
            return _lpop(key );
        }

        const next = async () => {
            const val = await _lpop(key );
            if ( typeof val === 'undefined' || val === null ) {
                return;
            }
            await processor(val );
            await next();
        };
        await next();
    } );
}
;

/**
获取链表长度 */
export function llen( key ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.llen.bind(client ) )(key );
    } );
}
;

/**
获取链表指定位置数据 */
export function lrange( key, start, stop ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.lrange.bind(client ) )(key, start, stop );
    } );
}
;
