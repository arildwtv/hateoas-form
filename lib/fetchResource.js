'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetchResource;

var _handleFetch = require('./internals/handleFetch');

var _handleFetch2 = _interopRequireDefault(_handleFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fetchResource(config, url) {
  if (!url) {
    throw new Error('You must provide a URL from which to fetch the resource!');
  }

  var _fetch = config.fetch || fetch;

  return (0, _handleFetch2.default)(_fetch, url);
};