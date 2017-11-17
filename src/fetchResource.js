import handleFetch from './internals/handleFetch';

export default function fetchResource(context, url) {
  if (!url) {
    throw new Error('You must provide a URL from which to fetch the resource!');
  }

  const _fetch = context.config.fetch || fetch;

  context.emitter.emitFetching(url);
  
  try {
    return handleFetch(_fetch, url)
      .then(response => {
        if (response.ok) {
          context.emitter.emitFetched(response.resource);
          return response.resource;
        }

        context.emitter.emitFetchFailed(response);
        throw new Error(`Failed to fetch resource ${url} (${response.status} ${response.statusText})`);
      });
  } catch (err) {
    context.emitter.emitFetchFailed(err);
    return Promise.reject(err);
  }
};
