import { getLinkHref } from 'hateoas-form';

export default function getClientUrlFromLink(link) {
  const {
    location: {
      protocol,
      host
    }
  } = window;

  return `/#${getLinkHref(link).replace(`${protocol}//${host}/api`, '')}`;
}