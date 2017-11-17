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
    expectType.isFunction(formInstance.fetchResource);
    expectType.isFunction(formInstance.setProperty);
    expectType.isFunction(formInstance.setProperties);
    expectType.isFunction(formInstance.onResourceFetching);
    expectType.isFunction(formInstance.onResourceFetchingOnce);
    expectType.isFunction(formInstance.onResourceFetched);
    expectType.isFunction(formInstance.onResourceFetchedOnce);
    expectType.isFunction(formInstance.onResourceFetchFailed);
    expectType.isFunction(formInstance.onResourceFetchFailedOnce);
    expectType.isFunction(formInstance.onResourceUpdating);
    expectType.isFunction(formInstance.onResourceUpdatingOnce);
    expectType.isFunction(formInstance.onResourceUpdated);
    expectType.isFunction(formInstance.onResourceUpdatedOnce);
    expectType.isFunction(formInstance.onResourceUpdateFailed);
    expectType.isFunction(formInstance.onResourceUpdateFailedOnce);
  });
});