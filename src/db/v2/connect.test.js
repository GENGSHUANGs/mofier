/* eslint-disable */
import 'babel-polyfill';
import Promise, { using, } from 'bluebird';
import { describe, } from 'mocha';
import chai, { expect, } from 'chai';

const debug = require('debug' )('nuwaio:db:v2:connect:test' );

const T = 50000;

import { DEFAULT, createPoolWith, connect, pools, query, inTx, inTxWith, findOne, update, build, } from './';

describe('MYSQL', () => {
    it('初始化连接池', async () => {
        const {MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWD, MYSQL_DATABASE, MYSQL_LIMIT, MYSQL_ACQUIRE_TIMEOUT, MYSQL_QUEUE_LIMIT, } = process.env;
        const options = { connectionLimit: MYSQL_LIMIT || 10, host: MYSQL_HOST || '127.0.0.1', port: MYSQL_PORT || 3306, user: MYSQL_USER || 'root', password: MYSQL_PASSWD || 'root', database: MYSQL_DATABASE || 'mysql', acquireTimeout: MYSQL_ACQUIRE_TIMEOUT || 50000, queueLimit: MYSQL_QUEUE_LIMIT || 1000, debug: false, multipleStatements: true, supportBigNumbers: true, bigNumberStrings: true, };

        const {pool, ready, } = await createPoolWith(options, undefined, '我的连接池' );
        const tz = await ready();
        debug('时区 >: ',tz);
        await using(connect('我的连接池' ), async conn => {
            expect(conn.end ).to.be.a('function' );
        } );
    } ).timeout(T );

    it('查询数据', async () => {
        const {rows, fields, } = await query('select * from db limit 0,? ', [ 1, ], '我的连接池' );
        expect(rows ).to.be.a('array' );
    } ).timeout(T );

    it('事务提交', async () => {
        await inTx(async ( {query:_query, } ) => {
            const {rows, fields, } = await query(_query, 'select * from db limit 0,? ', [ 1, ], { transferOname: false, } );
            expect(rows ).to.be.a('array' );
        }, '我的连接池' );
    } ).timeout(T );

    it('事务回滚', async () => {
        try {
            await inTx(undefined, async ( {query:_query, } ) => {
                return await inTx(_query, async ( {query:_query, } ) => {
                    const {rows, fields, } = await query(_query, 'select * from db limit 0,? ', [ 1, ], { transferOname: false, } );
                    expect(rows ).to.be.a('array' );
                    throw new Error('sss' );
                } )
            }, '我的连接池' );
        } catch (err) {
            expect(err ).to.be.a('error' );
        }
    } ).timeout(T );

    it('查询数据', async () => {
        const builder = build('db', '我的连接池', { transferOname: false, } ).and('?Db > ? ', 10, );
        const count = await builder.count();
        expect(count ).to.be.a('number' );
        const datas = await builder.list(10, 1, 'Db desc ' );
        expect(datas ).to.be.a('array' );
    } ).timeout(T );

    it('查询数据(事务)', async () => {
        await inTx(async ( {query:_query, } ) => {
            const builder = build('db', _query, { transferOname: false, } ).and('?Db > ? ', 10, );
            const count = await builder.count();
            const datas = await builder.list(10, 1, 'Db desc ' );
            expect(datas ).to.be.a('array' );
        }, '我的连接池' );
    } ).timeout(T );

    it('查询数据(findOne)', async () => {
        const r = await findOne(undefined, 'select * from db limit 0,1', [], '我的连接池' );
        expect(r ).to.be.a('object' );
    } ).timeout(T );

    it('查询数据(默认连接池事务)', async () => {
        const {MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWD, MYSQL_DATABASE, MYSQL_LIMIT, MYSQL_ACQUIRE_TIMEOUT, MYSQL_QUEUE_LIMIT, } = process.env;
        const options = { connectionLimit: MYSQL_LIMIT || 10, host: MYSQL_HOST || '47.91.244.248', port: MYSQL_PORT || 3333, user: MYSQL_USER || 'root', password: MYSQL_PASSWD || '123456', database: MYSQL_DATABASE || 'qipai_review', acquireTimeout: MYSQL_ACQUIRE_TIMEOUT || 50000, queueLimit: MYSQL_QUEUE_LIMIT || 1000, debug: false, multipleStatements: true, supportBigNumbers: true, bigNumberStrings: true, };

        await createPoolWith(options );

        await inTx(undefined, async ( {query:_query, } ) => {
            await query(_query, 'select uuid_short() as ID' );
            const {id, } = await findOne(_query, 'select uuid_short() as ID' );
            expect(id ).to.be.a('string' );
        } );
    } ).timeout(T );
} );
