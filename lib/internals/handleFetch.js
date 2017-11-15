'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleFetch;
function handleFetch(fetch, url, init) {
  return fetch(url, init).then(function (response) {
    return response.text();
  }).then(function (text) {
    try {
      return text ? JSON.parse(text) : undefined;
    } catch (err) {
      console.error('Cannot parse response body to JSON', text);
      throw err;
    }
  });
};