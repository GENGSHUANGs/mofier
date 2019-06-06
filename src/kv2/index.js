import { using, } from 'bluebird';
import { DEFAULT, createPool, connect, drain, drainAll, createPoolWith as _createPoolWith, } from './connect';
export { DEFAULT, createPool, connect, drain, drainAll, };

export async function createPoolWith( options, {min = 2, max = 10, } = {}, name = DEFAULT ) {
    const pool = await _createPoolWith(options, { min, max, }, name );
    return { pool, async ready() {
            return await using(connect(name ), client => {
                return client.infoAsync();
            } );
    }, };
}
;

export async function connectTo( processor, name = DEFAULT, {priority = 1, } = {} ) {
    return await using(connect(name, { priority, } ), async client => {
        client.$clean = async pattern => {
            const [_keys = [], ] = await client.multi([ [ 'KEYS', pattern ], ] ).execAsync();
            await client.multi(_keys.map(_key => [ 'DEL', _key, ] ) ).execAsync();
        };
        return await processor(client );
    } );
}
;

export async function multi( commands, name = DEFAULT, {priority = 1, } = {} ) {
    return await connectTo(client => {
        return client.multi(commands ).execAsync();
    }, name, { priority, } );
}
;
