import { multi, keys, } from './index';

/**
删除所有的数据 */
export default async function clean() {
    const _keys = await keys('*' ) || [];
    const commands = _keys.map(key => [ 'DEL', key ] );
    await multi(commands );
}
;
