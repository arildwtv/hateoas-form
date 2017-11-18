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
      setPropertiesPromise = formInstance.setProperties(resource, undefined);
    });
    
    it('returns a thenable', () => {
      expectType.isThenable(setPropertiesPromise);
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
    });
    
    it('returns a thenable', () => {
      expectType.isThenable(formInstance.setProperties(resource, properties));
    });

    it('PATCHes resource with the correct arguments', () => {
      formInstance.setProperties(resource, properties)
        .then(() => {
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
    });

    it('emits an "updating" event', done => {
      const unsubscribe = formInstance.onResourceUpdating(updateUrl => {
        expect(updateUrl).to.deep.equal(url);
        unsubscribe();
        done();
      });
      
      formInstance.setProperties(resource, properties);
    });

    describe('when update succeeds', () => {
      it('emits an "updated" event', done => {
        const unsubscribe = formInstance.onResourceUpdated(updatedResource => {
          expect(updatedResource).to.deep.equal(patchedResource);
          unsubscribe();
          done();
        });
        
        formInstance.setProperties(resource, properties);
      });

      it('resolves to the PATCHed resource', () =>
        formInstance.setProperties(resource, properties)
          .then(resolvedResource =>
            expect(resolvedResource).to.deep.equal(patchedResource)));
    });

    describe('when fetch throws an error', () => {
      let mockedError;

      beforeEach(() => {
        mockedError = new Error('Failed!');
        fetchStub.throws(mockedError);
      });

      it('rejects with the error', () =>
        formInstance.setProperties(resource, properties)
          .catch(err => expect(err).to.equal(mockedError)));

      it('emits an "updateFailed" event', done => {
        const unsubscribe = formInstance.onResourceUpdateFailed(err => {
          expect(err).to.equal(mockedError);
          unsubscribe();
          done();
        });
        formInstance.setProperties(resource, properties).catch(Function.prototype);
      });
    });
    
    describe('when fetch returns a non-OK response', () => {
      let response;

      beforeEach(() => {
        response = {
          ok: false,
          status: 400,
          statusText: 'Bad Request',
          text: () => '',
          url
        };
        fetchStub.returns(Promise.resolve(response));
      });
      
      it('rejects with an error', () =>
        formInstance.setProperties(resource, properties)
          .catch(err => {
            expect(err.message).to.equal(`Failed to update resource ${url} (400 Bad Request)`);
          }));

      it('emits an "updateFailed" event', done => {
        const unsubscribe = formInstance.onResourceUpdateFailed(errResponse => {
          try {
            expect(errResponse).to.equal(response);
            unsubscribe();
            done();
          } catch (err) {
            done(err);
          }
        });
  
        formInstance.setProperties(resource, properties).catch(Function.prototype);
      });
    });
  });

  describe('when properties argument is identical to those of the resource to update', () => {
    let properties;
    let response;
    let resource;
    let setPropertiesPromise;
    
    beforeEach(() => {
      properties = { firstName: 'John', lastName: 'Doe' };
      resource = {
        ...properties,
        _links: {
          self: {
            href: url
          }
        }
      };
      setPropertiesPromise = formInstance.setProperties(resource, properties);
    });
    
    it('returns a thenable', () => {
      expectType.isThenable(setPropertiesPromise);
    });

    it('does not call backend', () => {
      expect(fetchStub.callCount).to.equal(0);
    });

    it('resolves to the unmodified resource', () =>
      setPropertiesPromise.then(resolvedResource =>
        expect(resolvedResource).to.equal(resource)));
  });
});