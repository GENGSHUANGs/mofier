import { promisify, using, } from 'bluebird';
import { connect, } from '../connect';

import { DEFAULT, } from './index.js';

/**
获取数据 */
export function get( key ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.get.bind(client ) )(key );
    } );
}
;

import { expire, } from './key';
/**
设置数据 */
export function set( key, value, expireIn ) {
    return using(connect(DEFAULT ), client => {
        const p = promisify(client.set.bind(client ) )(key, value );
        if ( typeof expireIn === 'undefined' || expireIn === null ) {
            return p;
        }
        return p.then(() => {
            return expire(key, expireIn );
        } );
    } );
}
;

/**
删除数据 */
export function del( ...keys ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.del.bind(client ) )(...keys );
    } );
}

/**
键值自增长 */
export function incr( key ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.incr.bind(client ) )(key );
    } );
}
;

/**
键值自增长自定的值
@return 加上指定的增量值之后， key 的值 */
export function incrby( key, incrment ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.incrby.bind(client ) )(key, incrment );
    } );
}
;
