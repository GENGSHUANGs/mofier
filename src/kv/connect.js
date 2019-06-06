import Promise from 'bluebird';
import { createClient, } from 'redis';

const debug = require('debug' )('mofier:kv:connect' );
const debugerror = require('debug' )('mofier:kv:connect:error' );

/** 默认设置 */
const {REDIS_URL, } = process.env;
let SETTING = {
    url: REDIS_URL || 'redis://pub-redis-16529.ap-southeast-2-1.1.ec2.garantiadata.com:16529/0',
    no_ready_check: true,
    enable_offline_queue: true,
    retry_strategy: options => { // 1s 重连
        return 100;
    },
};

/**
设置 */
export function setup( setting ) {
    if ( Object.prototype.toString.call(setting ) === '[object String]' ) {
        SETTING.url = setting ;
        return;
    }
    SETTING = setting ;
}
;

/** 缓存有name的链接 */
const _connections = {};

/**
创建链接 */
export async function connectTo( setting, name ) {
    name = name || 'transient';
    return new Promise(( resolve, reject ) => {
        debug(`client : ${name} prepare to create ` );
        const client = createClient(setting );
        client.name = name;
        client.on('error', reason => {
            reject(new Error(`client : ${name}(${client.connection_id}) error with reason : ${reason}` ) );
        } );
        client.on('ready', () => {
            debug(`client ${name}(${client.connection_id}) ready` );
            resolve(client );
        } );
    } );
}
;

const emptyFunction = function () {};
/**
连接到 redis
如果name不为string ，则表明要求创建一个临时的链接，用完要能够自动销毁，且name为链接参数(参考setting)，如果未空，则使用默认setting */
export function connect( name, setting = SETTING ) {
    const transient = Object.prototype.toString.call(name ) !== '[object String]';
    if ( transient ) {
        setting = name || SETTING;
        name = undefined;
    }

    // 创建临时新链接
    if ( transient ) {
        return connectTo(setting, name ).disposer(conn => {
            conn.end(true );
        } );
    }

    // 非临时链接，如果存在，直接返回，不存在创建、缓存、返回
    const conn = _connections[ name ];
    if ( conn ) {
        return Promise.resolve(conn ).disposer(emptyFunction );
    }

    return connectTo(setting, name ).then(conn => {
        _connections[ name ] = conn;
        return conn;
    } ).disposer(emptyFunction );
}
;

/**
断开链接 */
export async function disconnect( name ) {
    if ( name ) {
        const conn = _connections[ name ];
        delete _connections[ name ];
        return conn.end(true );
    }

    Object.keys(_connections ).forEach(name => disconnect(name ) );
}
;
