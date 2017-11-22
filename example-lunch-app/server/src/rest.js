const set = require('lodash.set');
const { compose } = require('./util');

const applyEmbedding = (embeddingName, embeddableResource) => resource => {
  if (!embeddableResource) {
    return resource;
  }

  return set(Object.assign({}, resource), `_embedded.${embeddingName}`, embeddableResource);
};

const applyLink = (rel, title, href, templated) => resource => {
  return set(Object.assign({}, resource), `_links.${rel}`, { title, href, templated });
};

const stripMongooseProperties = resource => {
  const { __v, _id, ...restProperties } = resource;
  return restProperties;
};

const throwNotFoundError = () => {
  throw new Error('Not Found');
};

const isNotFoundError = err =>
  err && err.message === 'Not Found';

const whenTrue = statement => apply =>
  statement ? apply : value => value;

module.exports = {
  applyEmbedding,
  applyLink,
  stripMongooseProperties,
  throwNotFoundError,
  isNotFoundError,
  whenTrue
};
