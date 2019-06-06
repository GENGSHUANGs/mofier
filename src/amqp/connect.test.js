/* eslint-disable */
import 'babel-polyfill';
import Promise, { using, } from 'bluebird';
import { describe, } from 'mocha';
import chai, { expect, } from 'chai';

const debug = require('debug' )('mofier:amqp:connect:test' );

const T = 50000;

import { createPoolWith, connect, pools, } from './connect';
import { create, } from './channel';
import { observe, } from './observable';
describe('AMQP', () => {
    it('初始化连接池', async () => {
        const pool = await createPoolWith('amqp://user:user@127.0.0.1:5672/' );
        debug({ size: pool.size, available: pool.available, borrowed: pool.borrowed, pending: pool.pending, } );
        await using(connect(), async connection => {
            debug({ size: pool.size, available: pool.available, borrowed: pool.borrowed, pending: pool.pending, } );
            expect(connection.close ).to.be.a('function' );
        } );
        debug({ size: pool.size, available: pool.available, borrowed: pool.borrowed, pending: pool.pending, } );
    } ).timeout(T );

    it('创建频道', async () => {
        await using(create({ confirm: false, } ), async channel => {
            expect(channel.assertQueue ).to.be.a('function' );
        } );
    } ).timeout(T );


    it('监听消息', async () => {
        const observer = await observe('test:queue', { durable: false, autoDelete: true, } );
        observer.subscribe(async ( {message, ack, nack, } ) => {
            try {
                debug(`从频道接收到消息:test:queue,%j`, message.content.toString() );
                await ack();
            } catch (err) {
                debugerror(err );
                nack();
            }
        }, err => {
            console.error(err );
            throw err;
        }, console.log.bind(console, '订阅结束了~~ ' ) );
    } ).timeout(T );

    it('发送消息', async () => {
        await using(create({ confirm: false, } ), async channel => {
            await channel.assertQueue('test:queue', { exclusive: false, durable: false, autoDelete: true, } );
            for (let i = 0; i < 100; i++) {
                await channel.sendToQueue('test:queue', new Buffer(`${i + 1} >: ooo${ new Date().getTime()}` ), { noAck: false, } );
            }
        } );
    } ).timeout(T );

    it('等待', async () => {
        await new Promise(resolve => {
            setTimeout(resolve, 10 * 1000 );
        } );
    } ).timeout(T );
} );
