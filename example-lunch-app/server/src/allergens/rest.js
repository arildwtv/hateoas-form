const { applyLink, applyEmbedding, stripMongooseProperties } = require('../rest');
const { compose } = require('../util');

const createAllergenCollectionHref = contextPath => `${contextPath}/allergens`;
const createAllergenHref = (contextPath, id) => `${contextPath}/allergens/${id}`;
const createFindAllergenHref = contextPath => `${contextPath}/allergens{?id}`;

const applyAllergenCollectionLink = (rel, title) => contextPath =>
  applyLink(rel, title, createAllergenCollectionHref(contextPath));
  
const applyAllergenLink = (rel, title) => contextPath => allergen =>
  applyLink(rel, title, createAllergenHref(contextPath, allergen._id))(allergen);

const applyFindAllergenLink = (rel, title) => contextPath =>
  applyLink(rel, title, createFindAllergenHref(contextPath), true);

const toAllergenCollectionResource = contextPath => allergens =>
  compose(
    applyEmbedding('items', allergens.map(toAllergenResource(contextPath))),
    applyAllergenCollectionLink('self', 'Allergens')(contextPath)
  )({});

const toAllergenResource = contextPath => allergen =>
  compose(
    stripMongooseProperties,
    applyAllergenLink('self', 'Allergen')(contextPath)
  )(allergen);

module.exports = {
  createAllergenCollectionHref,
  createAllergenHref,
  applyAllergenCollectionLink,
  applyAllergenLink,
  applyFindAllergenLink,
  toAllergenCollectionResource,
  toAllergenResource
};
