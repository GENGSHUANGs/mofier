'use strict';

require('babel-polyfill');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mocha = require('mocha');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _ = require('./');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable */


var debug = require('debug')('nuwaio:db:v2:connect:test');

var T = 50000;

(0, _mocha.describe)('MYSQL', function () {
    it('初始化连接池', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var _process$env, MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWD, MYSQL_DATABASE, MYSQL_LIMIT, MYSQL_ACQUIRE_TIMEOUT, MYSQL_QUEUE_LIMIT, options, _ref2, pool, ready, tz;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _process$env = process.env, MYSQL_HOST = _process$env.MYSQL_HOST, MYSQL_PORT = _process$env.MYSQL_PORT, MYSQL_USER = _process$env.MYSQL_USER, MYSQL_PASSWD = _process$env.MYSQL_PASSWD, MYSQL_DATABASE = _process$env.MYSQL_DATABASE, MYSQL_LIMIT = _process$env.MYSQL_LIMIT, MYSQL_ACQUIRE_TIMEOUT = _process$env.MYSQL_ACQUIRE_TIMEOUT, MYSQL_QUEUE_LIMIT = _process$env.MYSQL_QUEUE_LIMIT;
                        options = { connectionLimit: MYSQL_LIMIT || 10, host: MYSQL_HOST || '127.0.0.1', port: MYSQL_PORT || 3306, user: MYSQL_USER || 'root', password: MYSQL_PASSWD || 'root', database: MYSQL_DATABASE || 'mysql', acquireTimeout: MYSQL_ACQUIRE_TIMEOUT || 50000, queueLimit: MYSQL_QUEUE_LIMIT || 1000, debug: false, multipleStatements: true, supportBigNumbers: true, bigNumberStrings: true };
                        _context2.next = 4;
                        return (0, _.createPoolWith)(options, undefined, '我的连接池');

                    case 4:
                        _ref2 = _context2.sent;
                        pool = _ref2.pool;
                        ready = _ref2.ready;
                        _context2.next = 9;
                        return ready();

                    case 9:
                        tz = _context2.sent;

                        debug('时区 >: ', tz);
                        _context2.next = 13;
                        return (0, _bluebird.using)((0, _.connect)('我的连接池'), function () {
                            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(conn) {
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                (0, _chai.expect)(conn.end).to.be.a('function');

                                            case 1:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, undefined);
                            }));

                            return function (_x) {
                                return _ref3.apply(this, arguments);
                            };
                        }());

                    case 13:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }))).timeout(T);

    it('查询数据', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var _ref5, rows, fields;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return (0, _.query)('select * from db limit 0,? ', [1], '我的连接池');

                    case 2:
                        _ref5 = _context3.sent;
                        rows = _ref5.rows;
                        fields = _ref5.fields;

                        (0, _chai.expect)(rows).to.be.a('array');

                    case 6:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }))).timeout(T);

    it('事务提交', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.next = 2;
                        return (0, _.inTx)(function () {
                            var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(_ref7) {
                                var _query = _ref7.query;

                                var _ref9, rows, fields;

                                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                    while (1) {
                                        switch (_context4.prev = _context4.next) {
                                            case 0:
                                                _context4.next = 2;
                                                return (0, _.query)(_query, 'select * from db limit 0,? ', [1], { transferOname: false });

                                            case 2:
                                                _ref9 = _context4.sent;
                                                rows = _ref9.rows;
                                                fields = _ref9.fields;

                                                (0, _chai.expect)(rows).to.be.a('array');

                                            case 6:
                                            case 'end':
                                                return _context4.stop();
                                        }
                                    }
                                }, _callee4, undefined);
                            }));

                            return function (_x2) {
                                return _ref8.apply(this, arguments);
                            };
                        }(), '我的连接池');

                    case 2:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }))).timeout(T);

    it('事务回滚', _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        _context8.prev = 0;
                        _context8.next = 3;
                        return (0, _.inTx)(undefined, function () {
                            var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(_ref11) {
                                var _query = _ref11.query;
                                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                                    while (1) {
                                        switch (_context7.prev = _context7.next) {
                                            case 0:
                                                _context7.next = 2;
                                                return (0, _.inTx)(_query, function () {
                                                    var _ref14 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(_ref13) {
                                                        var _query = _ref13.query;

                                                        var _ref15, rows, fields;

                                                        return regeneratorRuntime.wrap(function _callee6$(_context6) {
                                                            while (1) {
                                                                switch (_context6.prev = _context6.next) {
                                                                    case 0:
                                                                        _context6.next = 2;
                                                                        return (0, _.query)(_query, 'select * from db limit 0,? ', [1], { transferOname: false });

                                                                    case 2:
                                                                        _ref15 = _context6.sent;
                                                                        rows = _ref15.rows;
                                                                        fields = _ref15.fields;

                                                                        (0, _chai.expect)(rows).to.be.a('array');
                                                                        throw new Error('sss');

                                                                    case 7:
                                                                    case 'end':
                                                                        return _context6.stop();
                                                                }
                                                            }
                                                        }, _callee6, undefined);
                                                    }));

                                                    return function (_x4) {
                                                        return _ref14.apply(this, arguments);
                                                    };
                                                }());

                                            case 2:
                                                return _context7.abrupt('return', _context7.sent);

                                            case 3:
                                            case 'end':
                                                return _context7.stop();
                                        }
                                    }
                                }, _callee7, undefined);
                            }));

                            return function (_x3) {
                                return _ref12.apply(this, arguments);
                            };
                        }(), '我的连接池');

                    case 3:
                        _context8.next = 8;
                        break;

                    case 5:
                        _context8.prev = 5;
                        _context8.t0 = _context8['catch'](0);

                        (0, _chai.expect)(_context8.t0).to.be.a('error');

                    case 8:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, undefined, [[0, 5]]);
    }))).timeout(T);

    it('查询数据', _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
        var builder, count, datas;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        builder = (0, _.build)('db', '我的连接池', { transferOname: false }).and('?Db > ? ', 10);
                        _context9.next = 3;
                        return builder.count();

                    case 3:
                        count = _context9.sent;

                        (0, _chai.expect)(count).to.be.a('number');
                        _context9.next = 7;
                        return builder.list(10, 1, 'Db desc ');

                    case 7:
                        datas = _context9.sent;

                        (0, _chai.expect)(datas).to.be.a('array');

                    case 9:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, undefined);
    }))).timeout(T);

    it('查询数据(事务)', _asyncToGenerator(regeneratorRuntime.mark(function _callee11() {
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        _context11.next = 2;
                        return (0, _.inTx)(function () {
                            var _ref19 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(_ref18) {
                                var _query = _ref18.query;
                                var builder, count, datas;
                                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                                    while (1) {
                                        switch (_context10.prev = _context10.next) {
                                            case 0:
                                                builder = (0, _.build)('db', _query, { transferOname: false }).and('?Db > ? ', 10);
                                                _context10.next = 3;
                                                return builder.count();

                                            case 3:
                                                count = _context10.sent;
                                                _context10.next = 6;
                                                return builder.list(10, 1, 'Db desc ');

                                            case 6:
                                                datas = _context10.sent;

                                                (0, _chai.expect)(datas).to.be.a('array');

                                            case 8:
                                            case 'end':
                                                return _context10.stop();
                                        }
                                    }
                                }, _callee10, undefined);
                            }));

                            return function (_x5) {
                                return _ref19.apply(this, arguments);
                            };
                        }(), '我的连接池');

                    case 2:
                    case 'end':
                        return _context11.stop();
                }
            }
        }, _callee11, undefined);
    }))).timeout(T);

    it('查询数据(findOne)', _asyncToGenerator(regeneratorRuntime.mark(function _callee12() {
        var r;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        _context12.next = 2;
                        return (0, _.findOne)(undefined, 'select * from db limit 0,1', [], '我的连接池');

                    case 2:
                        r = _context12.sent;

                        (0, _chai.expect)(r).to.be.a('object');

                    case 4:
                    case 'end':
                        return _context12.stop();
                }
            }
        }, _callee12, undefined);
    }))).timeout(T);

    it('查询数据(默认连接池事务)', _asyncToGenerator(regeneratorRuntime.mark(function _callee14() {
        var _process$env2, MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWD, MYSQL_DATABASE, MYSQL_LIMIT, MYSQL_ACQUIRE_TIMEOUT, MYSQL_QUEUE_LIMIT, options;

        return regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) {
                switch (_context14.prev = _context14.next) {
                    case 0:
                        _process$env2 = process.env, MYSQL_HOST = _process$env2.MYSQL_HOST, MYSQL_PORT = _process$env2.MYSQL_PORT, MYSQL_USER = _process$env2.MYSQL_USER, MYSQL_PASSWD = _process$env2.MYSQL_PASSWD, MYSQL_DATABASE = _process$env2.MYSQL_DATABASE, MYSQL_LIMIT = _process$env2.MYSQL_LIMIT, MYSQL_ACQUIRE_TIMEOUT = _process$env2.MYSQL_ACQUIRE_TIMEOUT, MYSQL_QUEUE_LIMIT = _process$env2.MYSQL_QUEUE_LIMIT;
                        options = { connectionLimit: MYSQL_LIMIT || 10, host: MYSQL_HOST || '47.91.244.248', port: MYSQL_PORT || 3333, user: MYSQL_USER || 'root', password: MYSQL_PASSWD || '123456', database: MYSQL_DATABASE || 'qipai_review', acquireTimeout: MYSQL_ACQUIRE_TIMEOUT || 50000, queueLimit: MYSQL_QUEUE_LIMIT || 1000, debug: false, multipleStatements: true, supportBigNumbers: true, bigNumberStrings: true };
                        _context14.next = 4;
                        return (0, _.createPoolWith)(options);

                    case 4:
                        _context14.next = 6;
                        return (0, _.inTx)(undefined, function () {
                            var _ref23 = _asyncToGenerator(regeneratorRuntime.mark(function _callee13(_ref22) {
                                var _query = _ref22.query;

                                var _ref24, id;

                                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                                    while (1) {
                                        switch (_context13.prev = _context13.next) {
                                            case 0:
                                                _context13.next = 2;
                                                return (0, _.query)(_query, 'select uuid_short() as ID');

                                            case 2:
                                                _context13.next = 4;
                                                return (0, _.findOne)(_query, 'select uuid_short() as ID');

                                            case 4:
                                                _ref24 = _context13.sent;
                                                id = _ref24.id;

                                                (0, _chai.expect)(id).to.be.a('string');

                                            case 7:
                                            case 'end':
                                                return _context13.stop();
                                        }
                                    }
                                }, _callee13, undefined);
                            }));

                            return function (_x6) {
                                return _ref23.apply(this, arguments);
                            };
                        }());

                    case 6:
                    case 'end':
                        return _context14.stop();
                }
            }
        }, _callee14, undefined);
    }))).timeout(T);
});