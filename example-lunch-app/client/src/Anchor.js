import React from 'react';
import getClientUrlFromLink from './util/getClientUrlFromLink';

const Anchor = ({ link, children, ...rest }) =>
  <a {...rest} href={getClientUrlFromLink(link)}>{children}</a>;

export default Anchor;
