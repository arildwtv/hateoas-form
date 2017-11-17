import handleFetch from './handleFetch';
import get from 'lodash.get';

export default function getEmbeddedResource(context, resource, embeddedName) {
  const _fetch = context.config.fetch || fetch;

  const link = get(resource, `_links.${embeddedName}`);
  const embedded = get(resource, `_embedded.${embeddedName}`);

  if (!embedded) {
    return handleFetch(_fetch, link.href, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.resource);
  }
  
  return Promise.resolve(embedded);
};
