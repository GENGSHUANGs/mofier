import Promise, { promisify, using, } from 'bluebird';
import redlock from 'redlock';
import { connect, } from '../connect';

const debug = require('debug' )('mofier:kv:function' );
const debugerror = require('debug' )('mofier:kv:function:error' );

import { DEFAULT, } from './index.js';

/**
默认解锁失败错误处理 */
function defaultUnlockErrorHandler( err ) {
    debugerror(err );
}
;

/**
加锁
const lock = await lock('locks:xxxxxx') */
export async function lock( resource, onlocked, ttl = 1000, unlockErrorHandler, options ) {
    return using(connect(DEFAULT ), client => {
        return new Promise(( resolve, reject ) => {
            using(new redlock([ client ], options ).disposer(resource, ttl, unlockErrorHandler || defaultUnlockErrorHandler ), onlocked ).then(resolve, reject );
        } );
    } );
}
;

/***
批量操作
Usage:
```javascript
await multi([
['hset','keyname1','keyvalue1'],
['hset','keyname2','keyvalue2'],
]);
```*/
export function multi( commands ) {
    return using(connect(DEFAULT ), client => {
        const multi = client.multi(commands );
        return promisify(multi.exec.bind(multi ) )();
    } );
}
;
