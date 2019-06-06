/**
迭代 */
export async function forEach( items, processor, idx = 0, replies = [] ) {
    if ( !items || items.length === 0 || idx >= items.length ) {
        return;
    }

    const item = items[ idx ];
    const reply = await processor(item, idx, items );
    await forEach(items, processor, idx + 1, replies.concat(reply ) );
    return replies;
}
;

/**
map */
export async function map( items, processor, idx = 0 ) {
    const ary = [];
    await forEach(items, async ( item, idx, items ) => {
        const r = await processor(item, idx, items );
        ary.push(r );
    }, idx );
    return ary;
}
;
