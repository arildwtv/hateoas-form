import handleFetch from './handleFetch';
import get from 'lodash.get';

export default function getEmbeddedResource(config, resource, embeddedName) {
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
};
