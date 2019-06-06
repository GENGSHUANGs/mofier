export { connect, disconnect, } from './connect';
export * from './function';

import { setup as _setup, } from './connect';
import { exists, } from './function';

/**
设置redis
@return {function} ready function */
export function setup( setting ) {
    _setup(setting );
    return exists.bind(undefined, '__ready_key' );
}
;
