import isObjectLike from 'lodash.isobjectlike';
import pickBy from 'lodash.pickby';
import createResource from './createResource';

export default function createResourceAndSetProperties(config, href, properties, setProperties) {
  // Resolve properties that we safely can assume are not links.
  const plainPropertiesForEmbeddedResource =
    pickBy(properties, value => !isObjectLike(value));

  // Resolve properties that may be links.
  const objectPropertiesForEmbeddedResource =
    pickBy(properties, (value, key) =>
      !plainPropertiesForEmbeddedResource.hasOwnProperty(key));

  return createResource(config, href, plainPropertiesForEmbeddedResource)
    .then(createdEmbeddedResource =>
      setProperties(config, createdEmbeddedResource, objectPropertiesForEmbeddedResource));
};
