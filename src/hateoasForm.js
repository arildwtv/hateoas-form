import fetchResource from './fetchResource';
import setProperty from './setProperty';
import setProperties from './setProperties';
import eventTypes from './internals/eventTypes';
import createEventEmitter, { createSubscribable } from './eventEmitter';

function hateoasForm(config = {}) {
  const emitter = createEventEmitter();

  const context = {
    config,
    emitter
  };

  const {
    on,
    once
  } = emitter;

  return {
    fetchResource: fetchResource.bind(undefined, context),
    setProperty: setProperty.bind(undefined, context),
    setProperties: setProperties.bind(undefined, context),
    onResourceFetching: createSubscribable(emitter)(on)(eventTypes.FETCHING),
    onResourceFetchingOnce: createSubscribable(emitter)(once)(eventTypes.FETCHING),
    onResourceFetched: createSubscribable(emitter)(on)(eventTypes.FETCHED),
    onResourceFetchedOnce: createSubscribable(emitter)(once)(eventTypes.FETCHED),
    onResourceFetchFailed: createSubscribable(emitter)(on)(eventTypes.FETCH_FAILED),
    onResourceFetchFailedOnce: createSubscribable(emitter)(once)(eventTypes.FETCH_FAILED),
    onResourceUpdating: createSubscribable(emitter)(on)(eventTypes.UPDATING),
    onResourceUpdatingOnce: createSubscribable(emitter)(once)(eventTypes.UPDATING),
    onResourceUpdated: createSubscribable(emitter)(on)(eventTypes.UPDATED),
    onResourceUpdatedOnce: createSubscribable(emitter)(once)(eventTypes.UPDATED),
    onResourceUpdateFailed: createSubscribable(emitter)(on)(eventTypes.UPDATE_FAILED),
    onResourceUpdateFailedOnce: createSubscribable(emitter)(once)(eventTypes.UPDATE_FAILED),
  };
}

export default hateoasForm;
