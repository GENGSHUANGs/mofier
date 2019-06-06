import { inspect } from 'util';

export function error( message, args, localizedMessage ) {
    if ( Object.prototype.toString.call(args ) === '[object String]' ) {
        localizedMessage = args;
        args = undefined;
    }
    const err = new Error(message );
    err.arguments = args;
    err.localizedMessage = localizedMessage ? localizedMessage.replace(/\{([\w\.]*)\}/g, ( str, key ) => {
        const val = (args || {})[ key ];
        return typeof val === 'undefined' || val === null ? '' : val;
    } ) : undefined;
    return err;
}
;

export function v2( code, args, localizedMessage ) {
    if ( Object.prototype.toString.call(args ) === '[object String]' ) {
        localizedMessage = args;
        args = undefined;
    }
    localizedMessage = localizedMessage && localizedMessage.replace(/\{([\w\.]*)\}/g, ( str, key ) => {
        const val = (args || {})[ key ];
        return typeof val === 'undefined' || val === null ? '' : val;
    } );
    const e = new Error(`${code}(${localizedMessage}):${args && inspect(args, { colors: true, } ).replace(/\s+/g, ' ' )}` );
    e.code = code;
    e.arguments = args;
    e.localizedMessage = localizedMessage;
    return e;
}
;

error.v2 = v2;
