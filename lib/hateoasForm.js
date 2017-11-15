'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lodash = require('lodash.set');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.get');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.pickby');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.isobjectlike');

var _lodash8 = _interopRequireDefault(_lodash7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var handleFetch = function handleFetch(fetch, url, init) {
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

function fetchResource(config) {
  var url = config.url;

  var _fetch = config.fetch || fetch;

  return handleFetch(_fetch, url);
}

function createResource(config, href, properties) {
  var _fetch = config.fetch || fetch;

  return handleFetch(_fetch, href, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: properties ? JSON.stringify(properties) : undefined
  });
}

function updateResource(config, resource, properties) {
  var _fetch = config.fetch || fetch;

  var changedProperties = (0, _lodash6.default)(properties, function (value, key) {
    return value !== resource[key];
  });

  if (Object.keys(changedProperties).length === 0) {
    return Promise.resolve(resource);
  }

  return handleFetch(_fetch, (0, _lodash4.default)(resource, '_links.self.href'), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(changedProperties)
  });
}

function getEmbeddedResource(config, resource, embeddedName) {
  var _fetch = config.fetch || fetch;

  var link = (0, _lodash4.default)(resource, '_links.' + embeddedName);
  var embedded = (0, _lodash4.default)(resource, '_embedded.' + embeddedName);

  if (!embedded) {
    return handleFetch(_fetch, link.href, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  return Promise.resolve(embedded);
}

function createAndUpdateResource(config, href, properties) {
  // Resolve properties that we safely can assume are not links.
  var plainPropertiesForEmbeddedResource = (0, _lodash6.default)(properties, function (value) {
    return !(0, _lodash8.default)(value);
  });

  // Resolve properties that may be links.
  var objectPropertiesForEmbeddedResource = (0, _lodash6.default)(properties, function (value, key) {
    return !plainPropertiesForEmbeddedResource.hasOwnProperty(key);
  });

  return createResource(config, href, plainPropertiesForEmbeddedResource).then(function (createdEmbeddedResource) {
    return setProperties(config, createdEmbeddedResource, objectPropertiesForEmbeddedResource);
  });
}

function mergeArrays(array1, array2) {
  var replacedArray = [].concat(_toConsumableArray(array1));
  [].concat(_toConsumableArray(array2)).forEach(function (item, index) {
    return replacedArray[index] = item;
  });
  return replacedArray;
}

function setProperties(config, resource, properties) {
  var _fetch = config.fetch || fetch;

  // Resolve which properties are regular properties on resource, and which are links.
  var linkProperties = (0, _lodash6.default)(properties, function (value, key) {
    return (0, _lodash4.default)(resource, '_links.' + key) || (0, _lodash4.default)(resource, '_embedded.' + key);
  });
  var nonLinkProperties = (0, _lodash6.default)(properties, function (value, key) {
    return !(0, _lodash4.default)(resource, '_links.' + key) && !(0, _lodash4.default)(resource, '_embedded.' + key);
  });

  // Update the resource with the non-link properties.
  var updateResourcePromise = updateResource(config, resource, nonLinkProperties);

  // Update all embedded resources.
  var allPromises = Object.keys(linkProperties).reduce(function (acc, linkPropertyName) {
    var propertiesForEmbeddedResource = linkProperties[linkPropertyName];

    return acc.then(function (updatedResource) {
      return Promise.all([updatedResource, getEmbeddedResource(config, updatedResource, linkPropertyName)]);
    }).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          updatedResource = _ref2[0],
          embeddedResource = _ref2[1];

      if (!embeddedResource) {
        var linkHref = (0, _lodash4.default)(updatedResource, '_links.' + linkPropertyName + '.href');
        return Promise.all([updatedResource, createAndUpdateResource(config, linkHref, propertiesForEmbeddedResource)]);
      }

      var embeddedResourcePromise = Array.isArray(embeddedResource) ? Promise.all(mergeArrays(new Array(embeddedResource.length), propertiesForEmbeddedResource).map(function (propertiesForItem, index) {
        if (!embeddedResource[index]) {
          var _linkHref = (0, _lodash4.default)(updatedResource, '_links.self.href');
          return createAndUpdateResource(config, _linkHref, propertiesForItem);
        }
        return setProperties(config, embeddedResource[index], propertiesForItem);
      })) : setProperties(config, embeddedResource, linkProperties[linkPropertyName]);

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
}

function setProperty(config, resource, property, value) {
  return setProperties(config, resource, (0, _lodash2.default)({}, property, value));
}

function hateoasForm(config) {
  if (!config || !config.url) {
    throw new Error('You must provide a URL in your HATEOAS form!');
  }

  return {
    fetchResource: fetchResource.bind(undefined, config),
    setProperty: setProperty.bind(undefined, config),
    setProperties: setProperties.bind(undefined, config)
  };
}

exports.default = hateoasForm;