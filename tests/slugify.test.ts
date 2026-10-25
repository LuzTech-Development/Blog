import { describe, expect, it } from 'vite-plus/test';
import { slugifyAll, slugifyStr } from '../src/utils/slugify';

describe('slugifyStr', () => {
  it('slugifies Latin strings', () => {
    expect(slugifyStr('E2E Testing')).toBe('e2e-testing');
    expect(slugifyStr('Hello World')).toBe('hello-world');
  });

  it('preserves non-Latin characters via kebabcase', () => {
    expect(slugifyStr('你好世界')).toBe('你好世界');
  });

  it('handles empty strings', () => {
    expect(slugifyStr('')).toBe('');
  });
});

describe('slugifyAll', () => {
  it('slugifies every element', () => {
    expect(slugifyAll(['Hello World', 'Foo Bar'])).toEqual([
      'hello-world',
      'foo-bar'
    ]);
  });
});
