"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var stripEmbeddings = function stripEmbeddings(resource) {
  if (!resource) {
    return resource;
  }

  if (Array.isArray(resource)) {
    return resource.map(stripEmbeddings);
  }

  var _resource$_embedded = resource._embedded,
      _embedded = _resource$_embedded === undefined ? {} : _resource$_embedded,
      properties = _objectWithoutProperties(resource, ["_embedded"]);

  var strippedEmbeddings = Object.keys(_embedded).reduce(function (acc, embeddedKey) {
    return _extends({}, acc, _defineProperty({}, embeddedKey, stripEmbeddings(resource._embedded[embeddedKey])));
  }, {});

  return _extends({}, properties, strippedEmbeddings);
};

exports.default = stripEmbeddings;