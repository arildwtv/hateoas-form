import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';
import hateoasForm from './hateoasForm';
import typeCheck from '../test/typeCheck';

const expectType = typeCheck(expect);

describe('hateoasForm', () => {
  let url;
  let fetchStub;

  beforeEach(() => {
    url = 'https://api.example.com/person/1';
    fetchStub = stub();
  });

  describe('construction', () => {
    it('throws when no URL is provided', () => {
      expect(() => hateoasForm()).to.throw(/^You must provide a URL in your HATEOAS form!$/);
    });

    it('returns HATEOAS form instance', () => {
      const formInstance = hateoasForm({ url, fetch: fetchStub });
      expectType.isObject(formInstance);
      expect(formInstance.hasOwnProperty('fetchResource')).to.equal(true);
      expectType.isFunction(formInstance.fetchResource);
      expect(formInstance.hasOwnProperty('setProperty')).to.equal(true);
      expectType.isFunction(formInstance.setProperty);
      expect(formInstance.hasOwnProperty('setProperties')).to.equal(true);
      expectType.isFunction(formInstance.setProperties);
    });
  });

  describe('fetchResource', () => {
    let formInstance;
    let response;

    beforeEach(() => {
      formInstance = hateoasForm({ url, fetch: fetchStub });
      response = Promise.resolve({
        text: () => '{"a": 1}'
      });
      fetchStub.returns(response);
    });
    
    it('returns a thenable', () => {
      const returned = formInstance.fetchResource();
      expectType.isThenable(returned);
    });
    
    it('fetches resource using the provided fetch function', () => {
      formInstance.fetchResource();
      expect(fetchStub.calledOnce).to.equal(true);
      expect(fetchStub.getCall(0).args).to.deep.equal([url, undefined]);
    });
    
    it('fetches resource with the provided URL', () => {
      formInstance.fetchResource();
      expect(fetchStub.getCall(0).args).to.deep.equal([url, undefined]);
    });

    it('returns a promise that resolves to the fetched resource', () =>
      formInstance.fetchResource()
        .then(resource => expect(resource).to.deep.equal({ a: 1})));
  });

  describe('setProperties', () => {
    let formInstance;

    beforeEach(() => {
      formInstance = hateoasForm({ url, fetch: fetchStub });
    });

    describe('when properties argument is undefined', () => {
      let response;
      let resource;
      let setPropertiesPromise;
      
      beforeEach(() => {
        response = Promise.resolve({
          text: () => ''
        });
        resource = {
          _links: {
            self: {
              href: url
            }
          }
        };
        fetchStub.returns(response);
        setPropertiesPromise = formInstance.setProperties(resource, undefined);
      });
      
      it('returns a thenable', () => {
        expectType.isThenable(formInstance.setProperties(resource, undefined));
      });

      it('does not call backend', () => {
        expect(fetchStub.callCount).to.equal(0);
      });

      it('resolves to the unmodified resource', () =>
        setPropertiesPromise.then(resolvedResource =>
          expect(resolvedResource).to.equal(resource)));
    });

    describe('when properties argument contains plain property', () => {
      let setPropertiesPromise;
      let properties;
      let resource;
      let patchedResource;
      let response;
      
      beforeEach(() => {
        properties = { b: 2 };
        resource = {
          _links: {
            self: {
              href: url
            }
          }
        };
        patchedResource = { ...resource, ...properties };
        response = Promise.resolve({
          text: () => JSON.stringify(patchedResource)
        });
        fetchStub.returns(response);
        setPropertiesPromise = formInstance.setProperties(resource, properties);
      });

      it('PATCHes resource with the correct arguments', () => {
        expect(fetchStub.calledOnce).to.equal(true);
        expect(fetchStub.getCall(0).args).to.deep.equal([
          url,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(properties)
          }
        ]);
      });

      it('resolves to the PATCHed resource', () =>
        setPropertiesPromise.then(resolvedResource =>
          expect(resolvedResource).to.deep.equal(patchedResource)));
    });
  });
});