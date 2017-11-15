const isType = type => expect => value => expect(typeof value).to.equal(type);
const isFunction = isType('function');
const isObject = isType('object');
const isThenable = expect => value => isObject(expect)(value) && isFunction(expect)(value.then);

const typeCheck = expect => ({
  isFunction: isFunction(expect),
  isThenable: isThenable(expect),
  isObject: isObject(expect)
});

export default typeCheck;