import handleFetch from './handleFetch';

export default function createResource(context, href, properties) {
  const _fetch = context.config.fetch || fetch;
  
  return handleFetch(_fetch, href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: properties ? JSON.stringify(properties) : undefined
    })
    .then(response => {
      if (response.status === 201) {
        return handleFetch(_fetch, response.headers.get('Location'), {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      return response;
    })
    .then(response => response.resource);
};
