'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = updateResource;

var _lodash = require('lodash.pickby');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.get');

var _lodash4 = _interopRequireDefault(_lodash3);

var _handleFetch = require('./handleFetch');

var _handleFetch2 = _interopRequireDefault(_handleFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function updateResource(context, resource, properties) {
  var _fetch = context.config.fetch || fetch;

  var changedProperties = (0, _lodash2.default)(properties, function (value, key) {
    return value !== resource[key];
  });

  if (Object.keys(changedProperties).length === 0) {
    return Promise.resolve(resource);
  }

  return (0, _handleFetch2.default)(_fetch, (0, _lodash4.default)(resource, '_links.self.href'), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(changedProperties)
  }).then(function (response) {
    return response.resource;
  });
};