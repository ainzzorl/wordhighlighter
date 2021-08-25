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
      isBlocked('https://blocked.example.com/foo', ['blocked.example.com'], [])
    ).toBe(true);
  });

  it('can block everything', async () => {
    expect(isBlocked('foo.example.com', ['*'], [])).toBe(true);
    expect(isBlocked('bar.example.com', ['*'], [])).toBe(true);
  });

  it('can override blocks with allows', async () => {
    expect(
      isBlocked('allowed.example.com', ['*'], ['allowed.example.com'])
    ).toBe(false);
    expect(
      isBlocked('something-else.example.com', ['*'], ['allowed.example.com'])
    ).toBe(true);
  });

  it('supports leading *s', async () => {
    expect(isBlocked('foo.example.com', ['*'], [])).toBe(true);
    expect(isBlocked('foo.example.com', ['*.example.com'], [])).toBe(true);
    expect(isBlocked('foo.example-not.com', ['*.example.com'], [])).toBe(false);
  });

  it('supports ?', async () => {
    expect(isBlocked('example.a.com', ['example.?.com'], [])).toBe(true);
    expect(isBlocked('example.aa.com', ['example.?.com'], [])).toBe(false);
    expect(isBlocked('example-not.a.com', ['example.?.com'], [])).toBe(false);
    expect(isBlocked('example.com?a=b', ['example.com?a=b'], [])).toBe(true);
    expect(isBlocked('example.com/a=b', ['example.com?a=b'], [])).toBe(true);
    expect(isBlocked('example.com/a', ['example.com/?'], [])).toBe(true);
  });

  it('does not use any other regexp features', async () => {
    expect(isBlocked('example-com', ['example.com'], [])).toBe(false);
    expect(isBlocked('example.com', ['[a-z]*.com'], [])).toBe(false);
    expect(isBlocked('example.com', ['p{L}*.com'], [])).toBe(false);
    expect(isBlocked('example.com', ['\\p{L}*.com'], [])).toBe(false);
  });
});
