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

var _eventTypes = require('./internals/eventTypes');

var _eventTypes2 = _interopRequireDefault(_eventTypes);

var _eventEmitter = require('./eventEmitter');

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hateoasForm() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var emitter = (0, _eventEmitter2.default)();

  var context = {
    config: config,
    emitter: emitter
  };

  var on = emitter.on,
      once = emitter.once;


  return {
    fetchResource: _fetchResource2.default.bind(undefined, context),
    setProperty: _setProperty2.default.bind(undefined, context),
    setProperties: _setProperties2.default.bind(undefined, context),
    onResourceFetching: (0, _eventEmitter.createSubscribable)(emitter)(on)(_eventTypes2.default.FETCHING),
    onResourceFetchingOnce: (0, _eventEmitter.createSubscribable)(emitter)(once)(_eventTypes2.default.FETCHING),
    onResourceFetched: (0, _eventEmitter.createSubscribable)(emitter)(on)(_eventTypes2.default.FETCHED),
    onResourceFetchedOnce: (0, _eventEmitter.createSubscribable)(emitter)(once)(_eventTypes2.default.FETCHED),
    onResourceFetchFailed: (0, _eventEmitter.createSubscribable)(emitter)(on)(_eventTypes2.default.FETCH_FAILED),
    onResourceFetchFailedOnce: (0, _eventEmitter.createSubscribable)(emitter)(once)(_eventTypes2.default.FETCH_FAILED),
    onResourceUpdating: (0, _eventEmitter.createSubscribable)(emitter)(on)(_eventTypes2.default.UPDATING),
    onResourceUpdatingOnce: (0, _eventEmitter.createSubscribable)(emitter)(once)(_eventTypes2.default.UPDATING),
    onResourceUpdated: (0, _eventEmitter.createSubscribable)(emitter)(on)(_eventTypes2.default.UPDATED),
    onResourceUpdatedOnce: (0, _eventEmitter.createSubscribable)(emitter)(once)(_eventTypes2.default.UPDATED),
    onResourceUpdateFailed: (0, _eventEmitter.createSubscribable)(emitter)(on)(_eventTypes2.default.UPDATE_FAILED),
    onResourceUpdateFailedOnce: (0, _eventEmitter.createSubscribable)(emitter)(once)(_eventTypes2.default.UPDATE_FAILED)
  };
}

exports.default = hateoasForm;