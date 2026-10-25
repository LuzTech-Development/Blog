import { describe, expect, it } from 'vite-plus/test';
import { toTransitionName } from '../src/utils/toTransitionName';

describe('toTransitionName', () => {
  it('produces a valid CSS custom-ident for ASCII slugs', () => {
    expect(toTransitionName('my-post')).toBe('my-post');
  });

  it('replaces invalid ASCII chars with hyphens', () => {
    // slugifyStr already converts `/` and `:` to `-`, collapsing them
    expect(toTransitionName('a/b:c')).toBe('ab-c');
  });

  it('hex-encodes non-ASCII characters', () => {
    const result = toTransitionName('你好');
    expect(result).toMatch(/^u[0-9a-f]{6}/);
  });

  it('prefixes a leading digit', () => {
    expect(toTransitionName('123')).toBe('p-123');
  });

  it('falls back to "post" for empty input', () => {
    expect(toTransitionName('')).toBe('post');
  });
});
