import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';
import hateoasForm from './hateoasForm';
import typeCheck from '../test/typeCheck';

const expectType = typeCheck(expect);

const createNotFoundResponse = () => ({
  ok: false,
  status: 404,
  statusText: 'Not Found',
  text: () => ''
});

describe('setProperties', () => {
  let url;
  let fetchStub;
  let formInstance;

  beforeEach(() => {
    url = 'https://api.example.com/person/1';
    fetchStub = stub();
    formInstance = hateoasForm({ url, fetch: fetchStub });
  });

  describe('when properties is undefined', () => {
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
    
    it('returns a thenable', () =>
      expectType.isThenable(setPropertiesPromise));

    it('does not call backend', () =>
      expect(fetchStub.callCount).to.equal(0));

    it('resolves to the unmodified resource', () =>
      setPropertiesPromise.then(resolvedResource =>
        expect(resolvedResource).to.equal(resource)));
  });

  describe('when properties are plain property on resource', () => {
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
    
    it('returns a thenable', () =>
      expectType.isThenable(formInstance.setProperties(resource, properties)));

    it('PATCHes resource with the correct arguments', () =>
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
        }));

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

  describe('when properties are identical to those of the resource to update', () => {
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
    
    it('returns a thenable', () =>
      expectType.isThenable(setPropertiesPromise));

    it('does not call backend', () =>
      expect(fetchStub.callCount).to.equal(0));

    it('resolves to the unmodified resource', () =>
      setPropertiesPromise.then(resolvedResource =>
        expect(resolvedResource).to.equal(resource)));
  });

  describe('when properties are on linked resource', () => {
    let contactUrl;
    let properties;
    let resource;
    let contactResource;

    beforeEach(() => {
      contactUrl = 'https://api.example.com/person/1/contact';
      properties = {
        contact: {
          streetAddress: 'Foobar Street 1'
        }
      };
      resource = {
        _links: {
          self: {
            href: url
          },
          contact: {
            href: contactUrl
          }
        }
      };
      contactResource = {
        streetAddress: 'Foobar Street 1',
        _links: {
          self: {
            href: contactUrl
          }
        }
      };
    });

    describe('when linked resource already exists', () => {
      beforeEach(() => {
        const response = {
          ok: true,
          status: 200,
          text: () => JSON.stringify(contactResource)
        };

        fetchStub.withArgs(contactUrl, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .returns(Promise.resolve(response));
      });

      it('returns a thenable', () =>
        expectType.isThenable(formInstance.setProperties(resource, properties)));

      it('returns the resource with the linked resource embedded', () =>
        formInstance.setProperties(resource, properties)
          .then(updatedResource =>
            expect(updatedResource).to.deep.equal({
              ...resource,
              _embedded: {
                contact: contactResource
              }
            })));
    });

    describe('when linked resource does not exist and POST call returns 200 OK', () => {
      beforeEach(() => {
        fetchStub.withArgs(contactUrl, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .returns(Promise.resolve(createNotFoundResponse()));

      const response = {
        ok: true,
        status: 200,
        text: () => JSON.stringify(contactResource)
      };

      fetchStub.withArgs(contactUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(properties.contact)
        })
        .returns(Promise.resolve(response));
      });

      it('returns a thenable', () =>
        expectType.isThenable(formInstance.setProperties(resource, properties)));

      it('returns the resource with the linked resource embedded', () =>
      formInstance.setProperties(resource, properties)
        .then(updatedResource =>
          expect(updatedResource).to.deep.equal({
            ...resource,
            _embedded: {
              contact: contactResource
            }
          })));
    });
    
    describe('when linked resource does not exist and POST call returns 201 Created', () => {
      beforeEach(() => {
        const postResponse = {
          ok: true,
          status: 201,
          headers: {
            get: name => name === 'Location' && contactUrl 
          },
          text: () => ''
        };

        const getResponse = {
          ok: true,
          status: 200,
          text: () => JSON.stringify(contactResource)
        };

        fetchStub.withArgs(contactUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(properties.contact)
          })
          .returns(Promise.resolve(postResponse));
        
        fetchStub.withArgs(contactUrl, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .onFirstCall()
          .returns(Promise.resolve(createNotFoundResponse()))
          .onSecondCall()
          .returns(Promise.resolve(getResponse));
      });

      it('returns a thenable', () =>
        expectType.isThenable(formInstance.setProperties(resource, properties)));

      it('checks existence of linked resource in the backend first', () =>
        formInstance.setProperties(resource, properties)
          .then(() =>
            expect(fetchStub.getCall(0).args).to.deep.equal([
                contactUrl,
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              ])));
      
      it('posts the linked resource to the backend', () => 
        formInstance.setProperties(resource, properties)
          .then(() =>
            expect(fetchStub.getCall(1).args).to.deep.equal([
                contactUrl,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(properties.contact)
                }
              ])));

      it('gets the created linked resource from the backend using the Location header', () =>
        formInstance.setProperties(resource, properties)
          .then(() =>
            expect(fetchStub.getCall(2).args).to.deep.equal([
                contactUrl,
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              ])));

      it('returns the resource with the linked resource embedded', () =>
        formInstance.setProperties(resource, properties)
          .then(updatedResource =>
            expect(updatedResource).to.deep.equal({
              ...resource,
              _embedded: {
                contact: contactResource
              }
            })));
    });
  });
});