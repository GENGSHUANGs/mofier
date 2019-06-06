'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.sadd = sadd;
exports.spop = spop;
exports.scard = scard;
exports.sismember = sismember;
exports.smembers = smembers;
exports.srem = srem;
exports.sinterstore = sinterstore;
exports.sunionstore = sunionstore;
exports.sscan = sscan;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _connect = require('../connect');

var _index = require('./index.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
集合添加元素
@return 被添加到集合中的新元素的数量，不包括被忽略的元素*/
function sadd(key, value) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.sadd.bind(client))(key, value);
    });
}
;

/**
Redis Spop 命令用于移除并返回集合中的一个随机元素
@return {object} 被移除的随机元素。 当集合不存在或是空集时，返回 nil */
function spop(key) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.spop.bind(client))(key);
    });
}
;

/**
Redis Scard 命令返回集合中元素的数量
return 集合的数量。 当集合 key 不存在时，返回 0 */
function scard(key) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.scard.bind(client))(key);
    });
}
;

/**
Redis Sismember 命令判断成员元素是否是集合的成员
@return 如果成员元素是集合的成员，返回 1 。 如果成员元素不是集合的成员，或 key 不存在，返回 0 */
function sismember(key, value) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.sismember.bind(client))(key, value);
    });
}
;

/**
获取集合中的元素 */
function smembers(key) {
    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.smembers.bind(client))(key);
    });
}
;

/**
Redis Srem 命令用于移除集合中的一个或多个成员元素，不存在的成员元素会被忽略。
当 key 不是集合类型，返回一个错误。
@return 被成功移除的元素的数量，不包括被忽略的元素 */
function srem() {
    for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
        keys[_key] = arguments[_key];
    }

    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.srem.bind(client)).apply(undefined, keys);
    });
}
;

/**
Redis Sinterstore 命令将给定集合之间的交集存储在指定的集合中。如果指定的集合已经存在，则将其覆盖
@return 结果集中的元素数量 */
function sinterstore(dest) {
    for (var _len2 = arguments.length, keys = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        keys[_key2 - 1] = arguments[_key2];
    }

    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.sinterstore.bind(client)).apply(undefined, [dest].concat(keys));
    });
}
;

/**
Redis Sunionstore 命令将给定集合的并集存储在指定的集合 destination 中。如果 destination 已经存在，则将其覆盖
@return 结果集中的元素数量 */
function sunionstore(dest) {
    for (var _len3 = arguments.length, keys = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        keys[_key3 - 1] = arguments[_key3];
    }

    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return (0, _bluebird.promisify)(client.sunionstore.bind(client)).apply(undefined, [dest].concat(keys));
    });
}
;

/**
扫描 */
function sscan(key) {
    var cursor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var match = arguments[2];

    var _this = this;

    var count = arguments[3];
    var processor = arguments[4];

    return (0, _bluebird.using)((0, _connect.connect)(_index.DEFAULT), function (client) {
        return new _bluebird2.default(function (resolve, reject) {
            var next = function () {
                var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    var _ref2, _ref3, _cursor, values;

                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.next = 2;
                                    return (0, _bluebird.promisify)(client.sscan.bind(client))(key, cursor, 'MATCH', match, 'COUNT', count);

                                case 2:
                                    _ref2 = _context.sent;
                                    _ref3 = _slicedToArray(_ref2, 2);
                                    _cursor = _ref3[0];
                                    values = _ref3[1];

                                    cursor = _cursor;
                                    _context.next = 9;
                                    return processor(cursor, values);

                                case 9:
                                    if (!(cursor !== '0')) {
                                        _context.next = 12;
                                        break;
                                    }

                                    next();
                                    return _context.abrupt('return');

                                case 12:

                                    resolve();

                                case 13:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, _this);
                }));

                return function next() {
                    return _ref.apply(this, arguments);
                };
            }();
            next();
        });
    });
}
;