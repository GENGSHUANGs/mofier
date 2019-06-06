import { promisify, using, } from 'bluebird';
import { connect, } from '../connect';

import { DEFAULT, } from './index.js';

/**
获取所有的key */
export function keys( pattern ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.keys.bind(client ) )(pattern );
    } );
}
;

/**
设置数据的生命周期 */
export function expire( key, seconds ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.expire.bind(client ) )(key, seconds );
    } );
}
;

/**
判断key 是否存在 */
export function exists( key ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.exists.bind(client ) )(key ) === 1;
    } );
}
;
