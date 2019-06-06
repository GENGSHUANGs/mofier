/* eslint-disable */
import 'babel-polyfill';
import Promise, { using, } from 'bluebird';
import { describe, } from 'mocha';
import chai, { expect, } from 'chai';

const debug = require('debug' )('mofier:influx:connect:test' );

const T = 50000;

import { createPoolWith, connect, write, query, } from './';
describe('InfluxDB', () => {
    it('初始化连接池', async () => {
        const pool = await createPoolWith('http://nighthawk:nighthawk@127.0.0.1:8086/nighthawk' );
        debug({ size: pool.size, available: pool.available, borrowed: pool.borrowed, pending: pool.pending, } );
        await using(connect(), async client => {
            debug({ size: pool.size, available: pool.available, borrowed: pool.borrowed, pending: pool.pending, } );
            expect(client.writePoints ).to.be.a('function' );
            expect(client.query ).to.be.a('function' );
        } );
        debug({ size: pool.size, available: pool.available, borrowed: pool.borrowed, pending: pool.pending, } );
    } ).timeout(T );

    it('写入', async () => {
        await using(connect(), async client => {
            const r = await write({ measurement: 'test', tags: { type: 't1' }, fields: { value: 100, }, timestamp: new Date(), } )
            ;
            console.log(r);
        } );
    } ).timeout(T );

    it('读取', async () => {
        await using(connect(), async client => {
            const r = await query('select * from test ' );
            expect(r ).to.be.a('array' );
        } );
    } ).timeout(T );
} );
