'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getEmbeddedResource;

var _handleFetch = require('./handleFetch');

var _handleFetch2 = _interopRequireDefault(_handleFetch);

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getEmbeddedResource(config, resource, embeddedName) {
  var _fetch = config.fetch || fetch;

  var link = (0, _lodash2.default)(resource, '_links.' + embeddedName);
  var embedded = (0, _lodash2.default)(resource, '_embedded.' + embeddedName);

  if (!embedded) {
    return (0, _handleFetch2.default)(_fetch, link.href, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  return Promise.resolve(embedded);
};