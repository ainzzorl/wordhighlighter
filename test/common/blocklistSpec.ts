///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../src/lib/common/blocklist.ts" />

describe('isBlocked', () => {
  it('allows everything if lists are empty', async () => {
    expect(isBlocked('foo.example.com', [], [])).toBe(false);
  });

  it('allows everything if blocked list is empty', async () => {
    expect(isBlocked('foo.example.com', [], ['bar.example.com'])).toBe(false);
  });

  it('can block one page', async () => {
    expect(isBlocked('blocked.example.com', ['blocked.example.com'], [])).toBe(
      true
    );
  });

  it('blocks partial matches', async () => {
    expect(
      isBlocked('https://blocked.example.com/', ['blocked.example.com'], [])
    ).toBe(true);
  });

  it('can block everything', async () => {
    expect(isBlocked('foo.example.com', ['.*'], [])).toBe(true);
    expect(isBlocked('bar.example.com', ['.*'], [])).toBe(true);
  });

  it('can override blocks with allows', async () => {
    expect(
      isBlocked('allowed.example.com', ['.*'], ['allowed.example.com'])
    ).toBe(false);
    expect(
      isBlocked('something-else.example.com', ['.*'], ['allowed.example.com'])
    ).toBe(true);
  });

  it('supports leading *s', async () => {
    expect(isBlocked('foo.example.com', ['*'], [])).toBe(true);
    expect(isBlocked('foo.example.com', ['*.example.com'], [])).toBe(true);
    expect(isBlocked('foo.example-not.com', ['*.example.com'], [])).toBe(false);
  });

  it('ignores invalid regexps', async () => {
    expect(isBlocked('foo.example.com', ['\\'], [])).toBe(false);
  });
});
