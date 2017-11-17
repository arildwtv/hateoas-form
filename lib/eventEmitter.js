'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSubscribable = undefined;
exports.default = createEventEmitter;

var _eventEmitter = require('event-emitter');

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

var _eventTypes = require('./internals/eventTypes');

var _eventTypes2 = _interopRequireDefault(_eventTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createEmit = function createEmit(emitter) {
  return function (eventType) {
    return function (payload) {
      return emitter.emit(eventType, payload);
    };
  };
};

function createEventEmitter() {
  var emitter = (0, _eventEmitter2.default)();
  emitter.emitFetching = createEmit(emitter)(_eventTypes2.default.FETCHING);
  emitter.emitFetched = createEmit(emitter)(_eventTypes2.default.FETCHED);
  emitter.emitFetchFailed = createEmit(emitter)(_eventTypes2.default.FETCH_FAILED);
  emitter.emitUpdating = createEmit(emitter)(_eventTypes2.default.UPDATING);
  emitter.emitUpdated = createEmit(emitter)(_eventTypes2.default.UPDATED);
  emitter.emitUpdateFailed = createEmit(emitter)(_eventTypes2.default.UPDATE_FAILED);
  return emitter;
}

var createSubscribable = exports.createSubscribable = function createSubscribable(emitter) {
  return function (subscriptionFunc) {
    return function (eventType) {
      return function (listener) {
        subscriptionFunc.call(emitter, eventType, listener);
        return function () {
          return emitter.off(eventType, listener);
        };
      };
    };
  };
};