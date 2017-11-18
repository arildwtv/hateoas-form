import isObjectLike from 'lodash.isobjectlike';
import mapValues from 'lodash.mapvalues';

const stripLinks = resource => {
  if (!resource) {
    return resource;
  }
  
  if (Array.isArray(resource)) {
    return resource.map(stripLinks);
  }

  if (isObjectLike(resource)) {
    const { _links, ...restProperties } = resource;
    return mapValues(restProperties, property => stripLinks(property));
  }

  return resource;
};
 
export default stripLinks;