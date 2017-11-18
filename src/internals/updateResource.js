import pickBy from 'lodash.pickby';
import get from 'lodash.get';
import handleFetch from './handleFetch';

export default function updateResource(context, resource, properties) {
  const _fetch = context.config.fetch || fetch;

  const changedProperties = pickBy(properties, (value, key) => value !== resource[key]);

  if (Object.keys(changedProperties).length === 0) {
    return Promise.resolve(resource);
  }

  const selfHref = get(resource, '_links.self.href');
  context.emitter.emitUpdating(selfHref);

  try {
    return handleFetch(_fetch, selfHref, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(changedProperties)
      })
      .then(response => {
        if (response.ok) {
          context.emitter.emitUpdated(response.resource);
          return response.resource;
        }
        
        context.emitter.emitUpdateFailed(response);
        throw new Error(`Failed to update resource ${selfHref} (${response.status} ${response.statusText})`);
      });
  } catch (err) {
    context.emitter.emitUpdateFailed(err);
    return Promise.reject(err);
  }
};
