'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createResource;

var _handleFetch = require('./handleFetch');

var _handleFetch2 = _interopRequireDefault(_handleFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createResource(config, href, properties) {
  var _fetch = config.fetch || fetch;

  return (0, _handleFetch2.default)(_fetch, href, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: properties ? JSON.stringify(properties) : undefined
  }).then(function (response) {
    return response.resource;
  });
};