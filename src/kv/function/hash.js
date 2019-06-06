import { promisify, using, } from 'bluebird';
import { connect, } from '../connect';

import { DEFAULT, } from './index.js';

/**
将哈希表 key 中的字段 field 的值设为 value */
export function hset( key, field, value ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.hset.bind(client ) )(key, field, value );
    } );
}
;

/**
只有在字段 field 不存在时，设置哈希表字段的值 */
export function hsetnx( key, field, value ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.hsetnx.bind(client ) )(key, field, value );
    } );
}
;

/**
获取存储在哈希表中指定字段的值 */
export function hget( key, field ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.hget.bind(client ) )(key, field );
    } );
}
;

/**
获取在哈希表中指定 key 的所有字段和值 */
export function hgetall( key ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.hgetall.bind(client ) )(key );
    } );
}
;

/**
hash 删除字段 */
export function hdel( key, ...fields ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.hdel.bind(client ) )(key, ...fields );
    } );
}
;

/**
Redis Hkeys 命令用于获取哈希表中的所有字段名 */
export function hkeys( key ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.hkeys.bind(client ) )(key );
    } );
}
;

/**
hash 字段是否存在 */
export function hexists( key, field ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.hexists.bind(client ) )(key, field );
    } );
}
;

/**
为哈希表 key 中的指定字段的整数值加上增量 increment
return 执行 HINCRBY 命令之后，哈希表中字段的值 */
export function hincrby( key, field, increment ) {
    return using(connect(DEFAULT ), client => {
        return promisify(client.hincrby.bind(client ) )(key, field, increment );
    } )
}
;
