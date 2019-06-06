'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Response = exports.Request = exports.Headers = undefined;

require('whatwg-fetch');

exports.default = self.fetch.bind(self);
var Headers = exports.Headers = self.Headers;
var Request = exports.Request = self.Request;
var Response = exports.Response = self.Response;