import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';
import hateoasForm from './hateoasForm';
import typeCheck from '../test/typeCheck';

const expectType = typeCheck(expect);

describe('hateoasForm', () => {
  it('returns HATEOAS form instance', () => {
    const formInstance = hateoasForm();
    expectType.isObject(formInstance);
    expect(formInstance.hasOwnProperty('fetchResource')).to.equal(true);
    expectType.isFunction(formInstance.fetchResource);
    expect(formInstance.hasOwnProperty('setProperty')).to.equal(true);
    expectType.isFunction(formInstance.setProperty);
    expect(formInstance.hasOwnProperty('setProperties')).to.equal(true);
    expectType.isFunction(formInstance.setProperties);
  });
});