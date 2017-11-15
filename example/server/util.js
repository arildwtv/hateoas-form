const compose = (...fns) => (...args) => {
  return fns.reduceRight((acc, fn) => {
      let ret = fn.apply(null, acc);
      if (!Array.isArray(ret)) ret = [ret];
      acc.unshift(...ret);
      return acc;
  }, args)[0];
};

module.exports = {
  compose
};
