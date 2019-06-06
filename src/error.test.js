/* eslint-disable */
import 'babel-polyfill';
import Promise, { using, } from 'bluebird';
import { describe, } from 'mocha';
import chai, { expect, } from 'chai';

const debug = require('debug' )('mofier:error:connect:test' );

const T = 50000;

import { v2 as error, } from './error';
describe('error', () => {
    it('code', async () => {
        const err = error('error_code', {}, '错误码' );
        console.log(JSON.stringify(err ) );
    } ).timeout(T );
} );
