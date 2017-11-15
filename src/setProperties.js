import pickBy from 'lodash.pickby';
import get from 'lodash.get';
import updateResource from './internals/updateResource';
import getEmbeddedResource from './internals/getEmbeddedResource';
import createResourceAndSetProperties from './internals/createResourceAndSetProperties';
import mergeArrays from './util/mergeArrays';

export default function setProperties(config, resource, properties) {
  const _fetch = config.fetch || fetch;

  // Resolve which properties are regular properties on resource, and which are links.
  const linkProperties = pickBy(properties, (value, key) =>
    get(resource, `_links.${key}`) || get(resource, `_embedded.${key}`));
  const nonLinkProperties = pickBy(properties, (value, key) =>
    !get(resource, `_links.${key}`) && !get(resource, `_embedded.${key}`));
  
  // Update the resource with the non-link properties.
  const updateResourcePromise = updateResource(config, resource, nonLinkProperties);

  // Update all embedded resources.
  const allPromises = Object.keys(linkProperties).reduce((acc, linkPropertyName) => {
    const propertiesForEmbeddedResource = linkProperties[linkPropertyName];

    return acc
      .then(updatedResource =>
        Promise.all([
          updatedResource,
          getEmbeddedResource(config, updatedResource, linkPropertyName)
        ])
      )
      .then(([updatedResource, embeddedResource]) => {
        if (!embeddedResource) {
          const linkHref = get(updatedResource, `_links.${linkPropertyName}.href`);
          return Promise.all([
            updatedResource,
            createResourceAndSetProperties(config, linkHref, propertiesForEmbeddedResource, setProperties)
          ]);
        }

        const embeddedResourcePromise = Array.isArray(embeddedResource)
          ? Promise.all(
              mergeArrays(new Array(embeddedResource.length), propertiesForEmbeddedResource)
                .map((propertiesForItem, index) => {
                  if (!embeddedResource[index]) {
                    const linkHref = get(updatedResource, `_links.self.href`);
                    return createResourceAndSetProperties(config, linkHref, propertiesForItem, setProperties);
                  }
                  return setProperties(config, embeddedResource[index], propertiesForItem);
                }))
          : setProperties(config, embeddedResource, linkProperties[linkPropertyName]);

        return Promise.all([
          updatedResource,
          embeddedResourcePromise
        ]);
      })
      .then(([updatedResource, embeddedResource]) => {
        const { _embedded = {} } = updatedResource;
        const updatedEmbedded = Object.assign({}, _embedded, { [linkPropertyName] : embeddedResource });
        return Object.assign({}, updatedResource, { _embedded: updatedEmbedded });
      });
  }, updateResourcePromise);

  return allPromises
    .catch(err => console.error(err));
};
