import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';
import hateoasForm from './hateoasForm';
import typeCheck from '../test/typeCheck';

const expectType = typeCheck(expect);

describe('fetchResource', () => {
  let url;
  let fetchStub;
  let formInstance;
  let response;
  
  beforeEach(() => {
    url = 'https://api.example.com/person/1';
    fetchStub = stub();
    formInstance = hateoasForm({ fetch: fetchStub });
  });

  describe('when fetch succeeds', () => {
    beforeEach(() => {
      response = Promise.resolve({
        ok: true,
        text: () => '{"a": 1}'
      });
      fetchStub.returns(response);
    });
    
    it('returns a thenable', () => {
      const returned = formInstance.fetchResource(url);
      expectType.isThenable(returned);
    });
  
    it('throws an error when no URL is provided', () => {
      expect(() => formInstance.fetchResource()).to.throw('You must provide a URL from which to fetch the resource!');
    });
    
    it('fetches resource using the provided fetch function', () => {
      formInstance.fetchResource(url);
      expect(fetchStub.calledOnce).to.equal(true);
      expect(fetchStub.getCall(0).args).to.deep.equal([url, undefined]);
    });
    
    it('fetches resource with the provided URL', () => {
      formInstance.fetchResource(url);
      expect(fetchStub.getCall(0).args).to.deep.equal([url, undefined]);
    });
  
    it('returns a promise that resolves to the fetched resource', () =>
      formInstance.fetchResource(url)
        .then(resource => expect(resource).to.deep.equal({ a: 1})));
    
    it('emits a "fetching" event', done => {
      const unsubscribe = formInstance.onResourceFetching(fetchUrl => {
        expect(fetchUrl).to.deep.equal(url);
        unsubscribe();
        done();
      });
      formInstance.fetchResource(url);
    });
  
    it('emits a "fetched" event', done => {
      const unsubscribe = formInstance.onResourceFetched(resource => {
        expect(resource).to.deep.equal({ a: 1 });
        unsubscribe();
        done();
      });
      formInstance.fetchResource(url);
    });
  });

  describe('when fetch throws an error', () => {
    let mockedError;

    beforeEach(() => {
      mockedError = new Error('Failed!');
      fetchStub.throws(mockedError);
    });
    
    it('rejects with the error', done => {
      formInstance.fetchResource(url)
        .catch(err => {
          expect(err).to.equal(mockedError);
          done();
        });
    });

    it('emits a "fetchFailed" event', done => {
      const unsubscribe = formInstance.onResourceFetchFailed(err => {
        expect(err).to.equal(mockedError);
        unsubscribe();
        done();
      });
      formInstance.fetchResource(url).catch(Function.prototype);
    });
  });
  
  describe('when fetch returns a non-OK response', () => {
    let response;
    
    beforeEach(() => {
      response = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: () => ''
      };
      fetchStub.returns(Promise.resolve(response));
    });
    
    it('rejects with an error', () =>
      formInstance.fetchResource(url)
        .catch(err => {
          expect(err.message).to.equal(`Failed to fetch resource ${url} (404 Not Found)`);
        }));

    it('emits a "fetchFailed" event', done => {
      const unsubscribe = formInstance.onResourceFetchFailed(errResponse => {
        try {
          expect(errResponse).to.equal(response);
          unsubscribe();
          done();
        } catch (err) {
          done(err);
        }
      });

      formInstance.fetchResource(url).catch(Function.prototype);
    });
  });
});