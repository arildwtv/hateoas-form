'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createResourceAndSetProperties;

var _lodash = require('lodash.isobjectlike');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.pickby');

var _lodash4 = _interopRequireDefault(_lodash3);

var _createResource = require('./createResource');

var _createResource2 = _interopRequireDefault(_createResource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createResourceAndSetProperties(context, href, properties, setProperties) {
  // Resolve properties that we safely can assume are not links.
  var plainPropertiesForEmbeddedResource = (0, _lodash4.default)(properties, function (value) {
    return !(0, _lodash2.default)(value);
  });

  // Resolve properties that may be links.
  var objectPropertiesForEmbeddedResource = (0, _lodash4.default)(properties, function (value, key) {
    return !plainPropertiesForEmbeddedResource.hasOwnProperty(key);
  });

  return (0, _createResource2.default)(context, href, plainPropertiesForEmbeddedResource).then(function (createdEmbeddedResource) {
    return setProperties(context, createdEmbeddedResource, objectPropertiesForEmbeddedResource);
  });
};