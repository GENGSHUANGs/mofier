'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.oname = oname;
function oname(name) {
    if (!name) {
        return name;
    }
    return name.split('_').map(function (str, idx) {
        if (str.length === 0) {
            return str;
        }
        str = str.toLowerCase();
        if (idx === 0) {
            return str;
        }
        return str.charAt(0).toUpperCase() + str.substr(1);
    }).join('');
}
;