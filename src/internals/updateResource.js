import pickBy from 'lodash.pickby';
import get from 'lodash.get';
import handleFetch from './handleFetch';

export default function updateResource(context, resource, properties) {
  const _fetch = context.config.fetch || fetch;

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
    })
    .then(response => response.resource);
};
