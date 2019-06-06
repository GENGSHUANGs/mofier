'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.create = create;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _connect = require('./connect');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$confirm = _ref.confirm,
        confirm = _ref$confirm === undefined ? false : _ref$confirm,
        _ref$priority = _ref.priority,
        priority = _ref$priority === undefined ? 1 : _ref$priority;

    var cname = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _connect.DEFAULT;

    return (0, _bluebird.using)((0, _connect.connect)(cname, { priority: priority }), function (connection) {
        return connection[confirm ? 'createConfirmChannel' : 'createChannel']();
    }).disposer(function (channel, p) {
        return channel.close();
    });
}
;