'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stripEmbeddings = exports.createHateoasComponent = undefined;

var _createHateoasComponent = require('./react/createHateoasComponent');

Object.defineProperty(exports, 'createHateoasComponent', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createHateoasComponent).default;
  }
});

var _stripEmbeddings = require('./react/stripEmbeddings');

Object.defineProperty(exports, 'stripEmbeddings', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_stripEmbeddings).default;
  }
});

var _hateoasForm = require('./hateoasForm');

var _hateoasForm2 = _interopRequireDefault(_hateoasForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _hateoasForm2.default;