export default function handleFetch(fetch, url, init) {
  return fetch(url, init)
    .then(response => response.text())
    .then(text => {
      try {
        return text ? JSON.parse(text) : undefined
      } catch (err) {
        console.error('Cannot parse response body to JSON', text);
        throw err;
      }
    });
};
