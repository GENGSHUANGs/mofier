'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.disconnect = exports.connectTo = undefined;

/**
创建链接 */
var connectTo = exports.connectTo = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(setting, name) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        name = name || 'transient';
                        return _context.abrupt('return', new _bluebird2.default(function (resolve, reject) {
                            debug('client : ' + name + ' prepare to create ');
                            var client = (0, _redis.createClient)(setting);
                            client.name = name;
                            client.on('error', function (reason) {
                                reject(new Error('client : ' + name + '(' + client.connection_id + ') error with reason : ' + reason));
                            });
                            client.on('ready', function () {
                                debug('client ' + name + '(' + client.connection_id + ') ready');
                                resolve(client);
                            });
                        }));

                    case 2:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function connectTo(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

/**
断开链接 */
var disconnect = exports.disconnect = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(name) {
        var conn;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        if (!name) {
                            _context2.next = 4;
                            break;
                        }

                        conn = _connections[name];

                        delete _connections[name];
                        return _context2.abrupt('return', conn.end(true));

                    case 4:

                        Object.keys(_connections).forEach(function (name) {
                            return disconnect(name);
                        });

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function disconnect(_x4) {
        return _ref2.apply(this, arguments);
    };
}();

exports.setup = setup;
exports.connect = connect;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _redis = require('redis');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var debug = require('debug')('mofier:kv:connect');
var debugerror = require('debug')('mofier:kv:connect:error');

/** 默认设置 */
var REDIS_URL = process.env.REDIS_URL;

var SETTING = {
    url: REDIS_URL || 'redis://pub-redis-16529.ap-southeast-2-1.1.ec2.garantiadata.com:16529/0',
    no_ready_check: true,
    enable_offline_queue: true,
    retry_strategy: function retry_strategy(options) {
        // 1s 重连
        return 100;
    }
};

/**
设置 */
function setup(setting) {
    if (Object.prototype.toString.call(setting) === '[object String]') {
        SETTING.url = setting;
        return;
    }
    SETTING = setting;
}
;

/** 缓存有name的链接 */
var _connections = {};
;

var emptyFunction = function emptyFunction() {};
/**
连接到 redis
如果name不为string ，则表明要求创建一个临时的链接，用完要能够自动销毁，且name为链接参数(参考setting)，如果未空，则使用默认setting */
function connect(name) {
    var setting = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : SETTING;

    var transient = Object.prototype.toString.call(name) !== '[object String]';
    if (transient) {
        setting = name || SETTING;
        name = undefined;
    }

    // 创建临时新链接
    if (transient) {
        return connectTo(setting, name).disposer(function (conn) {
            conn.end(true);
        });
    }

    // 非临时链接，如果存在，直接返回，不存在创建、缓存、返回
    var conn = _connections[name];
    if (conn) {
        return _bluebird2.default.resolve(conn).disposer(emptyFunction);
    }

    return connectTo(setting, name).then(function (conn) {
        _connections[name] = conn;
        return conn;
    }).disposer(emptyFunction);
}
;
;