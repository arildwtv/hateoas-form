import handleFetch from './internals/handleFetch';

export default function fetchResource(config) {
  const { url } = config;
  const _fetch = config.fetch || fetch;
  
  return handleFetch(_fetch, url);
};
