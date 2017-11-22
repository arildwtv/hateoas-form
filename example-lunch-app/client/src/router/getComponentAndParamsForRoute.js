import pathToRegExp from 'path-to-regexp';

export default function getComponentAndParamsForRoute(routes, route) {
  const matches = Object.keys(routes)
    .map(path => {
      const keys = [];
      const re = pathToRegExp(path, keys);
      const match = re.exec(route);
      if (!match) {
        return match;
      }

      const params = keys.reduce((acc, key, index) => Object.assign(acc, { [key.name]: match[index + 1] }), {});
      return { path, params };
    })
    .filter(match => match);

  const firstMatch = matches[0];

  if (!firstMatch) {
    return { component: routes.default };
  }

  return { component: routes[firstMatch.path], params: firstMatch.params };
}