import PrettyError from 'pretty-error';
import { lpop, rpush, } from './index.js';

const pe = new PrettyError();
pe.skipNodeFiles(); pe.skipPackage('express' );

let processings = [];

/**
*/
export async function trigger( key, processor, force = false ) {
    if ( !force && processings.indexOf(key ) !== -1 ) {
        return;
    }

    if ( !force ) {
        processings.push(key );
    }
    const val = await lpop(key );
    if ( !val ) {
        const idx = processings.indexOf(key );
        processings.splice(idx, 1 );
        return;
    }

    try {
        await processor(val );
    } catch (err) {
        console.log(pe.render(err ) );
        push(key, val, processor );
    }

    setTimeout(async () => {
        await trigger(key, processor, true )
    }, 0 );
}
;

/**
*/
export async function push( key, val, processor ) {
    await rpush(key, val );
    setTimeout(async () => {
        await trigger(key, processor );
    }, 0 );
}
;

/***/
export async function pushOnFaild( key, val, processor ) {
    try {
        return await processor(val );
    } catch (err) {
        console.log(pe.render(err ) );
        await push(key, val, processor );
    }
}
;
