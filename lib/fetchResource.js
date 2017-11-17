'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetchResource;

var _handleFetch = require('./internals/handleFetch');

var _handleFetch2 = _interopRequireDefault(_handleFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fetchResource(context, url) {
  if (!url) {
    throw new Error('You must provide a URL from which to fetch the resource!');
  }

  var _fetch = context.config.fetch || fetch;

  context.emitter.emitFetching(url);

  try {
    return (0, _handleFetch2.default)(_fetch, url).then(function (response) {
      if (response.ok) {
        context.emitter.emitFetched(response.resource);
        return response.resource;
      }

      context.emitter.emitFetchFailed(response);
      throw new Error('Failed to fetch resource ' + url + ' (' + response.status + ' ' + response.statusText + ')');
    });
  } catch (err) {
    context.emitter.emitFetchFailed(err);
    return Promise.reject(err);
  }
};