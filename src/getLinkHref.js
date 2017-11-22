export default function getLinkHref(link, args = {}) {
  if (!link) {
    return undefined;
  }

  if (!link.templated) {
    return link.href;
  }

  const interpolatedHref = Object.keys(args).reduce(
    (acc, argName) => acc
      .replace(new RegExp(`\\{\\?${argName}}`, 'g'), `/${args[argName]}`)
      .replace(new RegExp(`\\{${argName}}`, 'g'), args[argName]),
    link.href);

  return interpolatedHref.replace(/\{\?[^}]+}/g, '');
};
