import Promise, { promisify, using, } from 'bluebird';
import { connect, } from '../connect';

import { DEFAULT, } from './index.js';

/**
集合添加元素
@return 被添加到集合中的新元素的数量，不包括被忽略的元素*/
export function sadd( key, value ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.sadd.bind(client ) )(key, value );
    } );
}
;

/**
Redis Spop 命令用于移除并返回集合中的一个随机元素
@return {object} 被移除的随机元素。 当集合不存在或是空集时，返回 nil */
export function spop( key ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.spop.bind(client ) )(key );
    } );
}
;

/**
Redis Scard 命令返回集合中元素的数量
return 集合的数量。 当集合 key 不存在时，返回 0 */
export function scard( key ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.scard.bind(client ) )(key );
    } );
}
;

/**
Redis Sismember 命令判断成员元素是否是集合的成员
@return 如果成员元素是集合的成员，返回 1 。 如果成员元素不是集合的成员，或 key 不存在，返回 0 */
export function sismember( key, value ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.sismember.bind(client ) )(key, value );
    } );
}
;

/**
获取集合中的元素 */
export function smembers( key ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.smembers.bind(client ) )(key );
    } );
}
;

/**
Redis Srem 命令用于移除集合中的一个或多个成员元素，不存在的成员元素会被忽略。
当 key 不是集合类型，返回一个错误。
@return 被成功移除的元素的数量，不包括被忽略的元素 */
export function srem( ...keys ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.srem.bind(client ) )(...keys );
    } );
}
;

/**
Redis Sinterstore 命令将给定集合之间的交集存储在指定的集合中。如果指定的集合已经存在，则将其覆盖
@return 结果集中的元素数量 */
export function sinterstore( dest, ...keys ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.sinterstore.bind(client ) )(dest, ...keys );
    } );
}
;

/**
Redis Sunionstore 命令将给定集合的并集存储在指定的集合 destination 中。如果 destination 已经存在，则将其覆盖
@return 结果集中的元素数量 */
export function sunionstore( dest, ...keys ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.sunionstore.bind(client ) )(dest, ...keys );
    } );
}
;

/**
扫描 */
export function sscan( key, cursor = 0, match, count, processor ) {
    return using(connect(DEFAULT ), client => {
        return new Promise(( resolve, reject ) => {
            const next = async () => {
                const [_cursor, values, ] = await promisify(client.sscan.bind(client ) )(key, cursor, 'MATCH', match, 'COUNT', count );
                cursor = _cursor;
                await processor(cursor, values );
                if ( cursor !== '0' ) {
                    next();
                    return;
                }

                resolve();
            };
            next();
        } );
    } );
}
;
