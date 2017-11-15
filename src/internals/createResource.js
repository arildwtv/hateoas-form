import handleFetch from './handleFetch';

export default function createResource(config, href, properties) {
  const _fetch = config.fetch || fetch;
  
  return handleFetch(_fetch, href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: properties ? JSON.stringify(properties) : undefined
    });
};
