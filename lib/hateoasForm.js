'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fetchResource = require('./fetchResource');

var _fetchResource2 = _interopRequireDefault(_fetchResource);

var _setProperty = require('./setProperty');

var _setProperty2 = _interopRequireDefault(_setProperty);

var _setProperties = require('./setProperties');

var _setProperties2 = _interopRequireDefault(_setProperties);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hateoasForm(config) {
  if (!config || !config.url) {
    throw new Error('You must provide a URL in your HATEOAS form!');
  }

  return {
    fetchResource: _fetchResource2.default.bind(undefined, config),
    setProperty: _setProperty2.default.bind(undefined, config),
    setProperties: _setProperties2.default.bind(undefined, config)
  };
}

exports.default = hateoasForm;