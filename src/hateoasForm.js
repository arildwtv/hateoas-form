import fetchResource from './fetchResource';
import setProperty from './setProperty';
import setProperties from './setProperties';

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

export default hateoasForm;