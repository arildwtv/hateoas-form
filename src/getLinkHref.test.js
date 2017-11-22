import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';
import getLinkHref from './getLinkHref';

describe('getLinkHref', () => {
  it('returns plain href when templated property is not set', () => {
    const link = { href: 'http://url' };
    expect(getLinkHref(link)).to.equal(link.href);
  });

  it('returns plain href when templated property is false', () => {
    const link = { href: 'http://url', templated: false };
    expect(getLinkHref(link)).to.equal(link.href);
  });
  
  describe('when templated property is true', () => {
    describe('when template contains mandatory parameters', () => {
      it('returns interpolated href', () => {
        const link = { href: 'http://url/{test}', templated: true };
        const args = { test: 123 };
        expect(getLinkHref(link, args)).to.equal('http://url/123');
      });
    });
  
    describe('when template contains optional parameters', () => {
      describe('when optional arguments are not provided', () => {
        it('removes the optional parameters', () => {
          const link = { href: 'http://url{?foo}', templated: true };
          expect(getLinkHref(link)).to.equal('http://url');
        });
      });

      describe('when optional arguments are provided', () => {
        it('returns interpolated href when templated property is true', () => {
          const link = { href: 'http://url{?foo}', templated: true };
          const args = { foo: 'bar' }
          expect(getLinkHref(link, args)).to.equal('http://url/bar');
        });
      });
    });
  });
});