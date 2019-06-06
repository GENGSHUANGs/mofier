'use strict';

var _PoolConnection = require('mysql/lib/PoolConnection');

var _PoolConnection2 = _interopRequireDefault(_PoolConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(_PoolConnection2.default.prototype, 'isReleased', { configurable: false, get: function get() {
        console.log(undefined);
        if (!undefined._pool || undefined._pool._closed) return true;
        return undefined._pool._freeConnections.indexOf(undefined) !== -1;
    } });