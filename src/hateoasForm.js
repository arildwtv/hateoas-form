import set from 'lodash.set';
import get from 'lodash.get';
import pickBy from 'lodash.pickby';
import isObjectLike from 'lodash.isobjectlike';
import merge from 'lodash.merge';

const handleFetch = (fetch, url, init) =>
  fetch(url, init)
    .then(response => response.text())
    .then(text => {
      try {
        return text ? JSON.parse(text) : undefined
      } catch (err) {
        console.error('Cannot parse response body to JSON', text);
        throw err;
      }
    });

function fetchResource(config) {
  const { url } = config;
  const _fetch = config.fetch || fetch;

  if (!url) {
    throw new Error('You must provide a URL in your HateoasComponent');
  }
  
  return handleFetch(_fetch, url);
}

function createResource(config, href, properties) {
  const _fetch = config.fetch || fetch;
  
  return handleFetch(_fetch, href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: properties ? JSON.stringify(properties) : undefined
    });
}

function updateResource(config, resource, properties) {
  const _fetch = config.fetch || fetch;

  const changedProperties = pickBy(properties, (value, key) => value !== resource[key]);

  if (Object.keys(changedProperties).length === 0) {
    return Promise.resolve(resource);
  }

  return handleFetch(_fetch, get(resource, '_links.self.href'), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(changedProperties)
    });
}

function getEmbeddedResource(config, resource, embeddedName) {
  const _fetch = config.fetch || fetch;

  const link = get(resource, `_links.${embeddedName}`);
  const embedded = get(resource, `_embedded.${embeddedName}`);

  if (!embedded) {
    return handleFetch(_fetch, link.href, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  return Promise.resolve(embedded);
}

function createAndUpdateResource(config, href, properties) {
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
}

function mergeArrays(array1, array2) {
  const replacedArray = [...array1];
  [...array2].forEach((item, index) => replacedArray[index] = item);
  return replacedArray;
}

function setProperties(config, resource, properties) {
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
            createAndUpdateResource(config, linkHref, propertiesForEmbeddedResource)
          ]);
        }

        const embeddedResourcePromise = Array.isArray(embeddedResource)
          ? Promise.all(
              mergeArrays(new Array(embeddedResource.length), propertiesForEmbeddedResource)
                .map((propertiesForItem, index) => {
                  if (!embeddedResource[index]) {
                    const linkHref = get(updatedResource, `_links.self.href`);
                    return createAndUpdateResource(config, linkHref, propertiesForItem);
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
}

function setProperty(config, resource, property, value) {
  return setProperties(config, resource, set({}, property, value));
}

function hateoasForm(config) {
  return {
    fetchResource: fetchResource.bind(undefined, config),
    setProperty: setProperty.bind(undefined, config),
    setProperties: setProperties.bind(undefined, config)
  };
}

export default hateoasForm;