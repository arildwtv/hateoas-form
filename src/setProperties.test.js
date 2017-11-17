import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';
import hateoasForm from './hateoasForm';
import typeCheck from '../test/typeCheck';

const expectType = typeCheck(expect);

describe('setProperties', () => {
  let url;
  let fetchStub;
  let formInstance;

  beforeEach(() => {
    url = 'https://api.example.com/person/1';
    fetchStub = stub();
    formInstance = hateoasForm({ url, fetch: fetchStub });
  });

  describe('when properties argument is undefined', () => {
    let response;
    let resource;
    let setPropertiesPromise;
    
    beforeEach(() => {
      response = Promise.resolve({
        ok: true,
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
        ok: true,
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