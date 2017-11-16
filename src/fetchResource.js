import handleFetch from './internals/handleFetch';

export default function fetchResource(config, url) {
  if (!url) {
    throw new Error('You must provide a URL from which to fetch the resource!');
  }

  const _fetch = config.fetch || fetch;
  
  return handleFetch(_fetch, url);
};
