import fetchResource from './fetchResource';
import setProperty from './setProperty';
import setProperties from './setProperties';

function hateoasForm(config = {}) {
  return {
    fetchResource: fetchResource.bind(undefined, config),
    setProperty: setProperty.bind(undefined, config),
    setProperties: setProperties.bind(undefined, config)
  };
}

export default hateoasForm;
