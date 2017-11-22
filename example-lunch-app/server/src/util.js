const getISOWeek = require('date-fns/get_iso_week');
const getYear = require('date-fns/get_year');

const compose = (...fns) => (...args) => {
  return fns.reduceRight((acc, fn) => {
      let ret = fn.apply(null, acc);
      if (!Array.isArray(ret)) ret = [ret];
      acc.unshift(...ret);
      return acc;
  }, args)[0];
};

const getYearAndWeek = isoWeek => {
  const match = isoWeek.match(/^([0-9]{4})-W([0-9]{1,2})$/);

  if (!match) {
    return { year: undefined, week: undefined }
  };

  return { year: parseInt(match[1], 10), week: parseInt(match[2], 10) };
}

const toISOWeek = date => `${getYear(date)}-W${getISOWeek(date)}`;

module.exports = {
  compose,
  getYearAndWeek,
  toISOWeek
};
