export default function handleFetch(fetch, url, init) {
  return fetch(url, init)
    .then(response => Promise.all([response, response.text()]))
    .then(([response, text]) => {
      if (!response.ok) {
        return response;
      }
      
      const json = text ? JSON.parse(text) : undefined;
      return {
        headers: response.headers,
        ok: response.ok,
        redirected: response.redirected,
        status: response.status,
        statusText: response.statusText,
        type: response.type,
        url: response.url,
        resource: json
      };
    });
};
