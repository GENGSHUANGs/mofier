/* eslint-disable */
import 'babel-polyfill';
import Promise, { using, } from 'bluebird';
import { describe, } from 'mocha';
import chai, { expect, } from 'chai';

const debug = require('debug' )('mofier:kv2:connect:test' );

const T = 50000;

import { createPoolWith, connect, pools, drainAll, } from './';
import { connectTo, multi, } from './';
describe('kv2', () => {
    it('初始化连接池', async () => {
        const {pool, ready, } = await createPoolWith('redis://:@127.0.0.1:6379/0' );
        debug('测试ready , ', ready );
        const info = await ready();
        debug('INFO >: ', typeof info,info );
        debug({ size: pool.size, available: pool.available, borrowed: pool.borrowed, pending: pool.pending, } );
        await using(connect(), async connection => {
            debug({ size: pool.size, available: pool.available, borrowed: pool.borrowed, pending: pool.pending, } );
            expect(connection.end ).to.be.a('function' );
        } );
        debug({ size: pool.size, available: pool.available, borrowed: pool.borrowed, pending: pool.pending, } );
    } ).timeout(T );

    it('connectTo', async () => {
        const t = await connectTo(async client => {
            await client.setAsync('test:key', String(new Date().getTime() ) );
            return await client.getAsync('test:key' );
        } );
        expect(t ).to.be.a('string' );
    } ).timeout(T );

    it('clean', async () => {
        await connectTo(async client => {
            await client.$clean('*' );
        } );
    } ).timeout(T );

    it('multi', async () => {
        const [, t, ] = await multi([ [ 'SET', 'test:key', new Date().getTime() ], [ 'GET', 'test:key' ], ] );
        expect(t ).to.be.a('string' );
    } ).timeout(T );

    it('drainAll', async () => {
        await drainAll();
    } ).timeout(T );
} );
