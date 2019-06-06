'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Response = exports.Headers = exports.Request = exports.default = undefined;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_nodeFetch2.default.Promise = _bluebird2.default;
_nodeFetch.Response.Promise = _bluebird2.default;

var port = process.env.PORT || 3000;
var host = process.env.HOST || (port === 80 ? 'localhost' : 'localhost:' + port);

function localUrl(url) {
    if (url.startsWith('//')) {
        return 'https:' + url;
    }

    if (url.startsWith('http')) {
        return url;
    }

    return 'http://' + host + url;
}

function localFetch(url, options) {
    return (0, _nodeFetch2.default)(localUrl(url), options);
}

exports.default = localFetch;
exports.Request = _nodeFetch.Request;
exports.Headers = _nodeFetch.Headers;
exports.Response = _nodeFetch.Response;