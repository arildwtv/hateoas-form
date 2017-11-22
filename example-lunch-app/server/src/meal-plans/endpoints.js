const getISOWeek = require('date-fns/get_iso_week');
const setISOWeek = require('date-fns/set_iso_week');
const getYear = require('date-fns/get_year');
const setYear = require('date-fns/set_year');
const addWeeks = require('date-fns/add_weeks');
const subWeeks = require('date-fns/sub_weeks');
const differenceInWeeks = require('date-fns/difference_in_weeks');
const startOfWeek = require('date-fns/start_of_week');
const { toISOWeek, getYearAndWeek, compose } = require('../util');
const { whenTrue } = require('../rest');
const {
  createMealPlanCollectionHref,
  createMealPlanHref,
  applyMealPlanCollectionLink,
  applyMealPlanLink,
  applyCurrentMealPlanLink,
  applyFindMealPlanLink
} = require('./rest');

module.exports = (app, rootUrl, contextPath) => {
  app.get(createMealPlanCollectionHref(contextPath), (req, res) => {
    const now = new Date();

    res.send(compose(
      applyMealPlanCollectionLink('self', 'Meal Plans')(rootUrl),
      applyCurrentMealPlanLink('now', 'Meal Plan Current Week')(rootUrl),
      applyFindMealPlanLink('find', 'Find Meal Plan By Week')(rootUrl)
    )({}));
  });

  app.get(createMealPlanHref(contextPath, ':isoWeek'), (req, res) => {
    const { year, week } = getYearAndWeek(req.params.isoWeek);
    const now = new Date();
    const yearQuery = year ? parseInt(year, 10) : getYear(now);
    const weekQuery = week ? parseInt(week, 10) : getISOWeek(now);
    const contextWeek = setISOWeek(setYear(new Date(), yearQuery), weekQuery);
    const nextWeek = addWeeks(contextWeek, 1);
    const previousWeek = subWeeks(contextWeek, 1);

    const diff = differenceInWeeks(contextWeek, now);

    res.send(compose(
      applyMealPlanLink('self', `Meal Plan Week ${getISOWeek(contextWeek)}`)(rootUrl, toISOWeek(contextWeek)),
      whenTrue(diff < 1)(applyMealPlanLink('next', `Meal Plan Week ${getISOWeek(nextWeek)}`)(rootUrl, toISOWeek(nextWeek))),
      applyMealPlanLink('previous', `Meal Plan Week ${getISOWeek(previousWeek)}`)(rootUrl, toISOWeek(previousWeek)),
      applyCurrentMealPlanLink('now', 'Meal Plan Current Week')(rootUrl)
    )({
      isoWeek: toISOWeek(contextWeek),
      year: getYear(contextWeek),
      week: getISOWeek(contextWeek)
    }));
  });
}