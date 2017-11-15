'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setProperty;

var _lodash = require('lodash.set');

var _lodash2 = _interopRequireDefault(_lodash);

var _setProperties = require('./setProperties');

var _setProperties2 = _interopRequireDefault(_setProperties);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setProperty(config, resource, property, value) {
  return (0, _setProperties2.default)(config, resource, (0, _lodash2.default)({}, property, value));
};