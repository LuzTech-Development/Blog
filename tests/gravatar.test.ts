import { describe, expect, it } from 'vite-plus/test';
import { gravatarSrcSet, gravatarUrl } from '../src/utils/gravatar';

describe('gravatarUrl', () => {
  it('hashes the lowercased, trimmed email', () => {
    const a = gravatarUrl('User@Example.com ');
    const b = gravatarUrl('user@example.com');
    expect(a).toBe(b);
  });

  it('defaults fallback to "mp"', () => {
    expect(gravatarUrl('a@b.com')).toContain('d=mp');
  });

  it('includes size when provided', () => {
    expect(gravatarUrl('a@b.com', 80)).toContain('s=80');
  });

  it('omits size when undefined', () => {
    expect(gravatarUrl('a@b.com')).not.toContain('s=');
  });

  it('handles null/undefined email', () => {
    expect(gravatarUrl(null)).toContain('d=mp');
    expect(gravatarUrl(undefined)).toContain('d=mp');
  });
});

describe('gravatarSrcSet', () => {
  it('emits one entry per density', () => {
    const srcset = gravatarSrcSet('a@b.com', 40);
    expect(srcset.split(', ')).toHaveLength(3);
    expect(srcset).toContain('s=40');
    expect(srcset).toContain('s=80');
    expect(srcset).toContain('s=120');
    expect(srcset).toContain('1x');
    expect(srcset).toContain('2x');
    expect(srcset).toContain('3x');
  });
});
