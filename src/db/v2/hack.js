import PoolConnection from 'mysql/lib/PoolConnection';

Object.defineProperty(PoolConnection.prototype, 'isReleased', { configurable: false, get: () => {
    console.log(this);
        if ( !this._pool || this._pool._closed )
            return true;
        return (this._pool._freeConnections.indexOf(this ) !== -1);
} } );
