const SPACES = {};

for (let i = 0; i < 100; i++) {
    const strs = [];
    for (let x = 0; x < i; x++) {
        strs.push(' ' );
    }
    SPACES[ i ] = strs.join('' );
}
;

export function pad( str, len = 10 ) {
    let _len = String(str ).length;
    if ( _len > len ) {
        return str;
    }

    return `${SPACES[ len - _len ]}${str}`;
}
;

export function padRight( str, len = 10 ) {
    let _len = String(str ).length;
    if ( _len > len ) {
        return str;
    }

    return `${str}${SPACES[ len - _len ]}`;
}
;
