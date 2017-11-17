import ee from 'event-emitter';
import eventTypes from './internals/eventTypes';

const createEmit = emitter => eventType => payload => emitter.emit(eventType, payload);

export default function createEventEmitter() {
  const emitter = ee();
  emitter.emitFetching = createEmit(emitter)(eventTypes.FETCHING);
  emitter.emitFetched = createEmit(emitter)(eventTypes.FETCHED);
  emitter.emitFetchFailed = createEmit(emitter)(eventTypes.FETCH_FAILED);
  emitter.emitUpdating = createEmit(emitter)(eventTypes.UPDATING);
  emitter.emitUpdated = createEmit(emitter)(eventTypes.UPDATED);
  emitter.emitUpdateFailed = createEmit(emitter)(eventTypes.UPDATE_FAILED);
  return emitter;
}

export const createSubscribable = emitter => subscriptionFunc => eventType => listener => {
  subscriptionFunc.call(emitter, eventType, listener);
  return () => emitter.off(eventType, listener);
};
