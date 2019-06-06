'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.unsubscribe = exports.initsubscribe = exports.subscribe = exports.publish = exports.NAME_SUBSCRIBE = exports.NAME_PUBLISH = exports.PREFIX_KEY = undefined;

/**
发布 */
var publish = exports.publish = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(channel, message) {
        var messagestr;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        messagestr = typeof message === 'undefined' ? '' : JSON.stringify(message);

                        debug('publish to ' + channel + ' with : ' + messagestr);
                        _context.next = 4;
                        return (0, _bluebird.using)(pub(), function (client) {
                            return client.publish(channel, messagestr);
                        });

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function publish(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

/**
订阅
@return unsubscribe function

Usage:
subscribe('channel1','channel2',function(){...}) */
var subscribe = exports.subscribe = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        for (var _len = arguments.length, channels = Array(_len), _key = 0; _key < _len; _key++) {
            channels[_key] = arguments[_key];
        }

        var listener;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return initsubscribe();

                    case 2:
                        listener = channels[channels.length - 1];

                        channels = channels.slice(0, channels.length - 1);
                        channels.forEach(function (channel) {
                            _listeners[channel] = (_listeners[channel] || []).concat(listener);
                        });
                        _context2.next = 7;
                        return (0, _bluebird.using)(sub(), function (client) {
                            debug('subscribe channels ' + channels.join(',') + ' with client : ' + client.name + '(' + client.connection_id + ')');
                            client.subscribe.apply(client, _toConsumableArray(channels));
                        });

                    case 7:
                        return _context2.abrupt('return', unsubscribe.bind.apply(unsubscribe, [undefined].concat(_toConsumableArray(channels))));

                    case 8:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function subscribe() {
        return _ref2.apply(this, arguments);
    };
}();

/**
初始化监听 */
var initsubscribe = exports.initsubscribe = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        if (!(_is_subscribe_inited === true)) {
                            _context6.next = 2;
                            break;
                        }

                        return _context6.abrupt('return');

                    case 2:
                        _is_subscribe_inited = true;
                        debug('init subscribe done');

                        _context6.next = 6;
                        return (0, _bluebird.using)(sub(), function () {
                            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(client) {
                                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                    while (1) {
                                        switch (_context5.prev = _context5.next) {
                                            case 0:
                                                client.on('subscribe', function (channel, count) {
                                                    debug('on client ' + client.name + '(' + client.connection_id + ') subscribe : ' + channel + ' / ' + count);
                                                });
                                                client.on('unsubscribe', function (channel, count) {
                                                    debug('on client ' + client.name + '(' + client.connection_id + ') unsubscribe : ' + channel + ' / ' + count);
                                                });
                                                client.on('message', function () {
                                                    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(channel, messagestr) {
                                                        var message, listeners;
                                                        return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                                            while (1) {
                                                                switch (_context4.prev = _context4.next) {
                                                                    case 0:
                                                                        debug('on client ' + client.name + '(' + client.connection_id + ') channel ' + channel + ' message : ' + messagestr);
                                                                        message = JSON.parse(messagestr);
                                                                        listeners = _listeners[channel];

                                                                        if (!(!listeners || listeners.length === 0)) {
                                                                            _context4.next = 5;
                                                                            break;
                                                                        }

                                                                        return _context4.abrupt('return');

                                                                    case 5:
                                                                        _context4.next = 7;
                                                                        return (0, _array.forEach)(listeners, function () {
                                                                            var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(listener) {
                                                                                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                                                                    while (1) {
                                                                                        switch (_context3.prev = _context3.next) {
                                                                                            case 0:
                                                                                                _context3.next = 2;
                                                                                                return listener(channel, message);

                                                                                            case 2:
                                                                                                return _context3.abrupt('return', _context3.sent);

                                                                                            case 3:
                                                                                            case 'end':
                                                                                                return _context3.stop();
                                                                                        }
                                                                                    }
                                                                                }, _callee3, _this);
                                                                            }));

                                                                            return function (_x6) {
                                                                                return _ref6.apply(this, arguments);
                                                                            };
                                                                        }());

                                                                    case 7:
                                                                    case 'end':
                                                                        return _context4.stop();
                                                                }
                                                            }
                                                        }, _callee4, _this);
                                                    }));

                                                    return function (_x4, _x5) {
                                                        return _ref5.apply(this, arguments);
                                                    };
                                                }());

                                            case 3:
                                            case 'end':
                                                return _context5.stop();
                                        }
                                    }
                                }, _callee5, _this);
                            }));

                            return function (_x3) {
                                return _ref4.apply(this, arguments);
                            };
                        }());

                    case 6:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));

    return function initsubscribe() {
        return _ref3.apply(this, arguments);
    };
}();

/**
取消订阅 */


var unsubscribe = exports.unsubscribe = function () {
    var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
        for (var _len2 = arguments.length, channels = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            channels[_key2] = arguments[_key2];
        }

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.next = 2;
                        return (0, _bluebird.using)(sub(), function (client) {
                            return client.unsubscribe.apply(client, _toConsumableArray(channels));
                        });

                    case 2:
                        channels.forEach(function (channel) {
                            return delete _listeners[channel];
                        });

                    case 3:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));

    return function unsubscribe() {
        return _ref7.apply(this, arguments);
    };
}();

exports.pub = pub;
exports.sub = sub;

var _bluebird = require('bluebird');

var _array = require('../array');

var _connect2 = require('./connect');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var debug = require('debug')('mofier:kv:pub');
var debugerror = require('debug')('mofier:kv:pub:error');

/** 前缀 */
var PREFIX_KEY = exports.PREFIX_KEY = 'channel';

/** 发布客户端名称 */
var NAME_PUBLISH = exports.NAME_PUBLISH = 'publish';
/** 订阅客户端名称 */
var NAME_SUBSCRIBE = exports.NAME_SUBSCRIBE = 'subscribe';

/** 发布订阅REDIS服务器 */
var _process$env = process.env,
    PUBSUB_REDIS_URL = _process$env.PUBSUB_REDIS_URL,
    REDIS_URL = _process$env.REDIS_URL;

var _setting = {
    url: PUBSUB_REDIS_URL || REDIS_URL || 'redis://pub-redis-19556.ap-southeast-2-1.1.ec2.garantiadata.com:16529/0',
    no_ready_check: true,
    enable_offline_queue: true,
    retry_strategy: function retry_strategy(options) {
        // 1s 重连
        return 100;
    }
};

/**
获取发布客户端 */
function pub() {
    return (0, _connect2.connect)(NAME_PUBLISH, _setting);
}
;

/**
获取订阅客户端 */
function sub() {
    return (0, _connect2.connect)(NAME_SUBSCRIBE, _setting);
}
;
;

// 缓存的监听器
var _listeners = {};
;

var _is_subscribe_inited = false;
;