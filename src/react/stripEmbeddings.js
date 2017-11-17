const stripEmbeddings = resource => {
  if (!resource) {
    return resource;
  }
  
  if (Array.isArray(resource)) {
    return resource.map(stripEmbeddings);
  }
 
  const { _embedded = {}, ...properties } = resource;
 
  const strippedEmbeddings = Object.keys(_embedded).reduce((acc, embeddedKey) => ({
    ...acc,
    [embeddedKey]: stripEmbeddings(resource._embedded[embeddedKey])
  }), {});
 
  return { ...properties, ...strippedEmbeddings };
};
 
export default stripEmbeddings;