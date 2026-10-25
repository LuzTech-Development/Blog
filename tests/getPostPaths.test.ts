import { describe, expect, it, vi } from 'vite-plus/test';

vi.mock('astro:i18n', () => ({
  getRelativeLocaleUrl: (locale: string, path: string) =>
    `/${locale.toLowerCase()}/${path}`
}));

vi.mock('@/content.config', () => ({
  BLOG_PATH: 'src/content/blog',
  splitLocaleFromId: (id: string) => {
    const [locale, ...rest] = id.split('/');
    return { locale: locale.toUpperCase(), slugId: rest.join('/') };
  }
}));

vi.mock('@/config', () => ({
  default: { site: { lang: 'en-US' } }
}));

import { getPostSlug, getPostSlugPath } from '../src/utils/getPostPaths';

describe('getPostSlugPath', () => {
  it('builds a nested slug from filePath and id', () => {
    expect(
      getPostSlugPath(
        'en-us/examples/my-post',
        'src/content/blog/en-US/examples/my-post.md',
        'en-US'
      )
    ).toBe('examples/my-post');
  });

  it('filters underscore-prefixed path segments', () => {
    expect(
      getPostSlugPath(
        'en-us/my-post',
        'src/content/blog/en-US/_drafts/my-post.md',
        'en-US'
      )
    ).toBe('my-post');
  });

  it('falls back to the id slug when filePath is undefined', () => {
    expect(getPostSlugPath('en-us/my-post', undefined, 'en-US')).toBe(
      'my-post'
    );
  });
});

describe('getPostSlug', () => {
  it('returns a slug without a leading slash', () => {
    expect(
      getPostSlug(
        'en-us/examples/my-post',
        'src/content/blog/en-US/examples/my-post.md'
      )
    ).toBe('examples/my-post');
  });
});
