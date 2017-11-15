import set from 'lodash.set';
import setProperties from './setProperties';

export default function setProperty(config, resource, property, value) {
  return setProperties(config, resource, set({}, property, value));
};
