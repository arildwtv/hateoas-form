import { describe, it } from 'mocha';
import { expect } from 'chai';
import stripLinks from './stripLinks';

describe('stripLinks', () => {
  it('returns undefined when resource is undefined', () => {
    expect(stripLinks(undefined)).to.equal(undefined);
  });

  it('returns empty object when resource is empty object', () => {
    expect(stripLinks({})).to.deep.equal({});
  });

  it('returns empty array when resource is empty array', () => {
    expect(stripLinks([])).to.deep.equal([]);
  });

  it('removes _links property from resource', () => {
    expect(stripLinks({
      firstName: 'John',
      _links: {
        self: {
          href: 'https://example.api.com/person/1'
        }
      }
    })).to.deep.equal({ firstName: 'John' });
  });
  
  it('removes _links properties from deeply nested resource', () => {
    expect(stripLinks({
      firstName: 'John',
      hobby: {
        description: 'HATEOAS',
        _links: {
          self: {
            href: 'https://example.api.com/person/1/hobby'
          }
        }
      },
      _links: {
        self: {
          href: 'https://example.api.com/person/1'
        }
      }
    })).to.deep.equal({
      firstName: 'John',
      hobby: {
        description: 'HATEOAS'
      }
    });
  });
});