import Promise, { using, } from 'bluebird';

import { connect, DEFAULT as DEFAULT_CONNECTION_POOL, } from './connect';

export function create( {confirm = false, priority = 1, } = {}, cname = DEFAULT_CONNECTION_POOL ) {
    return using(connect(cname, { priority, } ), connection => {
        return connection[ confirm ? 'createConfirmChannel' : 'createChannel' ]();
    } ).disposer(( channel, p ) => {
        return channel.close();
    } );
}
;
