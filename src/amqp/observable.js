import PrettyError from 'pretty-error';
import Promise, { using, } from 'bluebird';
import { Observable, } from 'rxjs/Rx';

const debugerror = require('debug' )('mofier:amqp:observable:error' );
const pe = new PrettyError().skipNodeFiles();

import { DEFAULT as DEFAULT_CONNECTION_POOL, } from './connect';
import { create, } from './channel';

export async function observe( queue, {prefetch = 1, noAck = false, error, } = {}, {confirm = false, priority = 1, } = {}, cname = DEFAULT_CONNECTION_POOL ) {
    return new Promise(( resolve, reject ) => {
        using(create({ confirm, priority, }, cname ), channel => {
            return new Promise(async () => { // 长时间占用，不允许释放~~
                try {
                    // await channel.assertQueue(queue, { durable, autoDelete, } );
                    channel.prefetch(prefetch );
                    resolve(Observable.create(observer => {
                        channel.consume(queue, async message => {
                            try {
                                const r = await observer.next({ message, ack: noAck ? undefined : channel.ack.bind(channel, message ), nack: noAck ? undefined : channel.nack.bind(channel, message ), } );
                            } catch (err) {
                                debugerror(pe.render(err ) );
                                error && error(err );
                            }
                        }, { noAck, } );
                    } ) );
                } catch (err) {
                    debugerror(pe.render(err ) );
                    reject(err );
                }
            } );
        } ).catch(reject );
    } );
}
;
