import { using, } from 'bluebird';
import { forEach, } from '../array';
import { connect as _connect, } from './connect';

const debug = require('debug' )('mofier:kv:pub' );
const debugerror = require('debug' )('mofier:kv:pub:error' );

/** 前缀 */
export const PREFIX_KEY = 'channel';

/** 发布客户端名称 */
export const NAME_PUBLISH = 'publish';
/** 订阅客户端名称 */
export const NAME_SUBSCRIBE = 'subscribe';

/** 发布订阅REDIS服务器 */
const {PUBSUB_REDIS_URL, REDIS_URL, } = process.env;
const _setting = {
    url: PUBSUB_REDIS_URL || REDIS_URL || 'redis://pub-redis-19556.ap-southeast-2-1.1.ec2.garantiadata.com:16529/0',
    no_ready_check: true,
    enable_offline_queue: true,
    retry_strategy: options => { // 1s 重连
        return 100;
    },
};

/**
获取发布客户端 */
export function pub() {
    return _connect(NAME_PUBLISH, _setting );
}
;

/**
获取订阅客户端 */
export function sub() {
    return _connect(NAME_SUBSCRIBE, _setting );
}
;

/**
发布 */
export async function publish( channel, message ) {
    const messagestr = typeof message === 'undefined' ? '' : JSON.stringify(message );
    debug(`publish to ${channel} with : ${messagestr}` );
    await using(pub(), client => client.publish(channel, messagestr ) );
}
;

// 缓存的监听器
const _listeners = {};
/**
订阅
@return unsubscribe function

Usage:
subscribe('channel1','channel2',function(){...}) */
export async function subscribe( ...channels ) {
    await initsubscribe();

    const listener = channels[ channels.length - 1 ];
    channels = channels.slice(0, channels.length - 1 );
    channels.forEach(channel => {
        _listeners[ channel ] = (_listeners[ channel ] || []).concat(listener )
    } );
    await using(sub(), client => {
        debug(`subscribe channels ${ channels.join(',' )} with client : ${client.name}(${client.connection_id})` );
        client.subscribe(...channels );
    } );
    return unsubscribe.bind(undefined, ...channels );
}
;

let _is_subscribe_inited = false;
/**
初始化监听 */
export async function initsubscribe() {
    if ( _is_subscribe_inited === true ) {
        return;
    }
    _is_subscribe_inited = true;
    debug(`init subscribe done` );

    await using(sub(), async client => {
        client.on('subscribe', ( channel, count ) => {
            debug(`on client ${client.name}(${client.connection_id}) subscribe : ${channel} / ${count}` );
        } );
        client.on('unsubscribe', ( channel, count ) => {
            debug(`on client ${client.name}(${client.connection_id}) unsubscribe : ${channel} / ${count}` );
        } );
        client.on('message', async ( channel, messagestr ) => {
            debug(`on client ${client.name}(${client.connection_id}) channel ${channel} message : ${messagestr}` );
            const message = JSON.parse(messagestr );
            const listeners = _listeners[ channel ];
            if ( !listeners || listeners.length === 0 ) {
                return;
            }
            await forEach(listeners, async listener => await listener(channel, message ) );
        } );
    } );
}

/**
取消订阅 */
export async function unsubscribe( ...channels ) {
    await using(sub(), client => client.unsubscribe(...channels ) );
    channels.forEach(channel => delete _listeners[ channel ]
    );
}
;
