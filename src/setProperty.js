import set from 'lodash.set';
import setProperties from './setProperties';

export default function setProperty(context, resource, property, value) {
  return setProperties(context, resource, set({}, property, value));
};
