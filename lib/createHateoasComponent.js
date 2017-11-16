'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createHateoasComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hateoasForm = require('./hateoasForm');

var _hateoasForm2 = _interopRequireDefault(_hateoasForm);

var _stripEmbeddings = require('./stripEmbeddings');

var _stripEmbeddings2 = _interopRequireDefault(_stripEmbeddings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _patch(key, value) {
  var _this = this;

  this.setState({ updating: true });
  this.hateoasForm.setProperty(this.state.resource, key, value).then(function (resource) {
    return _this.setState({ resource: resource, updating: false });
  });
};

function _patchFromEvent(filter, event) {
  _patch.call(this, event.target.name, filter(event.target.type.toLowerCase() === 'checkbox' ? event.target.checked : event.target.value));
};

function createHateoasComponent(config) {
  return function (Component) {
    return function (_React$Component) {
      _inherits(HateoasComponent, _React$Component);

      function HateoasComponent(props) {
        _classCallCheck(this, HateoasComponent);

        var _this2 = _possibleConstructorReturn(this, (HateoasComponent.__proto__ || Object.getPrototypeOf(HateoasComponent)).call(this, props));

        _this2.state = { resource: null, links: [], fetching: true };
        _this2.patch = _patchFromEvent.bind(_this2, function (value) {
          return value;
        });
        _this2.patchBoolean = _patchFromEvent.bind(_this2, function (value) {
          return ['1', 'true', true, 1].indexOf(value) > -1;
        });
        _this2.patchNumber = _patchFromEvent.bind(_this2, function (value) {
          return parseInt(value, 10);
        });
        return _this2;
      }

      _createClass(HateoasComponent, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          this.fetchResource(this.props);
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          if (nextProps.url !== this.props.url) {
            this.fetchResource(this.props);
          }
        }
      }, {
        key: 'fetchResource',
        value: function fetchResource(props) {
          var _this3 = this;

          this.hateoasForm = (0, _hateoasForm2.default)({
            url: props.url || config.url
          });

          this.hateoasForm.fetchResource().then(function (resource) {
            _this3.setState({ resource: resource, fetching: false });
          });
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(Component, _extends({}, this.props, {
            rawResource: this.state.resource,
            resource: (0, _stripEmbeddings2.default)(this.state.resource),
            patch: this.patch,
            patchBoolean: this.patchBoolean,
            patchNumber: this.patchNumber,
            fetching: this.state.fetching,
            updating: this.state.updating
          }));
        }
      }]);

      return HateoasComponent;
    }(_react2.default.Component);
  };
}