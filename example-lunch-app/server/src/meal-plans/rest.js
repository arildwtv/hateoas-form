const { applyLink, applyEmbedding, stripMongooseProperties } = require('../rest');
const { toISOWeek, compose } = require('../util');

const createMealPlanCollectionHref = contextPath => `${contextPath}/meal-plans`;
const createMealPlanHref = (contextPath, isoWeek) => `${contextPath}/meal-plans/${isoWeek}`;
const createFindMealPlanHref = contextPath => `${contextPath}/meal-plans{?isoWeek}`;

const applyMealPlanCollectionLink = (rel, title) => contextPath =>
  applyLink(rel, title, createMealPlanCollectionHref(contextPath));

const applyMealPlanLink = (rel, title) => (contextPath, isoWeek) => mealPlan =>
  applyLink(rel, title, createMealPlanHref(contextPath, isoWeek || mealPlan.isoWeek))(mealPlan);

const applyFindMealPlanLink = (rel, title) => contextPath =>
  applyLink(rel, title, createFindMealPlanHref(contextPath), true);

const applyCurrentMealPlanLink = (rel, title) => contextPath =>
  applyLink(rel, title, createMealPlanHref(contextPath, toISOWeek(new Date())));

const toMealPlanCollectionResource = contextPath => mealPlans =>
  compose(
    applyEmbedding('items', mealPlans.map(toMealPlanResource(contextPath))),
    applyMealPlanCollectionLink('self', 'Meal Plans')(contextPath)
  )({});

const toMealPlanResource = contextPath => mealPlan =>
  compose(
    stripMongooseProperties,
    applyMealPlanLink('self', 'Meal Plan')(contextPath)
  )(mealPlan);

module.exports = {
  createMealPlanCollectionHref,
  createMealPlanHref,
  applyMealPlanCollectionLink,
  applyMealPlanLink,
  applyFindMealPlanLink,
  applyCurrentMealPlanLink,
  toMealPlanCollectionResource,
  toMealPlanResource
};
