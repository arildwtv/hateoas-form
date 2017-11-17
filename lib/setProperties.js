'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = setProperties;

var _lodash = require('lodash.pickby');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.get');

var _lodash4 = _interopRequireDefault(_lodash3);

var _updateResource = require('./internals/updateResource');

var _updateResource2 = _interopRequireDefault(_updateResource);

var _getEmbeddedResource = require('./internals/getEmbeddedResource');

var _getEmbeddedResource2 = _interopRequireDefault(_getEmbeddedResource);

var _createResourceAndSetProperties = require('./internals/createResourceAndSetProperties');

var _createResourceAndSetProperties2 = _interopRequireDefault(_createResourceAndSetProperties);

var _mergeArrays = require('./util/mergeArrays');

var _mergeArrays2 = _interopRequireDefault(_mergeArrays);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function setProperties(context, resource, properties) {
  var _fetch = context.config.fetch || fetch;

  // Resolve which properties are regular properties on resource, and which are links.
  var linkProperties = (0, _lodash2.default)(properties, function (value, key) {
    return (0, _lodash4.default)(resource, '_links.' + key) || (0, _lodash4.default)(resource, '_embedded.' + key);
  });
  var nonLinkProperties = (0, _lodash2.default)(properties, function (value, key) {
    return !(0, _lodash4.default)(resource, '_links.' + key) && !(0, _lodash4.default)(resource, '_embedded.' + key);
  });

  // Update the resource with the non-link properties.
  var updateResourcePromise = (0, _updateResource2.default)(context, resource, nonLinkProperties);

  // Update all embedded resources.
  var allPromises = Object.keys(linkProperties).reduce(function (acc, linkPropertyName) {
    var propertiesForEmbeddedResource = linkProperties[linkPropertyName];

    return acc.then(function (updatedResource) {
      return Promise.all([updatedResource, (0, _getEmbeddedResource2.default)(context, updatedResource, linkPropertyName)]);
    }).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          updatedResource = _ref2[0],
          embeddedResource = _ref2[1];

      if (!embeddedResource) {
        var linkHref = (0, _lodash4.default)(updatedResource, '_links.' + linkPropertyName + '.href');
        return Promise.all([updatedResource, (0, _createResourceAndSetProperties2.default)(context, linkHref, propertiesForEmbeddedResource, setProperties)]);
      }

      var embeddedResourcePromise = Array.isArray(embeddedResource) ? Promise.all((0, _mergeArrays2.default)(new Array(embeddedResource.length), propertiesForEmbeddedResource).map(function (propertiesForItem, index) {
        if (!embeddedResource[index]) {
          var _linkHref = (0, _lodash4.default)(updatedResource, '_links.self.href');
          return (0, _createResourceAndSetProperties2.default)(context, _linkHref, propertiesForItem, setProperties);
        }
        return setProperties(context, embeddedResource[index], propertiesForItem);
      })) : setProperties(context, embeddedResource, linkProperties[linkPropertyName]);

      return Promise.all([updatedResource, embeddedResourcePromise]);
    }).then(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          updatedResource = _ref4[0],
          embeddedResource = _ref4[1];

      var _updatedResource$_emb = updatedResource._embedded,
          _embedded = _updatedResource$_emb === undefined ? {} : _updatedResource$_emb;

      var updatedEmbedded = Object.assign({}, _embedded, _defineProperty({}, linkPropertyName, embeddedResource));
      return Object.assign({}, updatedResource, { _embedded: updatedEmbedded });
    });
  }, updateResourcePromise);

  return allPromises.catch(function (err) {
    return console.error(err);
  });
};