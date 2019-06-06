'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.query = exports.write = undefined;

var _connect = require('./connect');

Object.keys(_connect).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _connect[key];
    }
  });
});

var _write = require('./write');

var _query = require('./query');

exports.write = _write.write;
exports.query = _query.query;