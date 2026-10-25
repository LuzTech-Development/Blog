import { describe, expect, it } from 'vite-plus/test';
import {
  assertLocaleParam,
  isLocale,
  localeToPath,
  resolveLocale,
  swapLocaleInPath
} from '../src/utils/locale';

describe('isLocale', () => {
  it('recognizes canonical locale codes', () => {
    expect(isLocale('en-US')).toBe(true);
    expect(isLocale('pt-BR')).toBe(true);
  });

  it('rejects unknown or missing values', () => {
    expect(isLocale('fr-FR')).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(isLocale(null)).toBe(false);
  });
});

describe('resolveLocale', () => {
  it('returns canonical codes unchanged', () => {
    expect(resolveLocale('en-US')).toBe('en-US');
    expect(resolveLocale('pt-BR')).toBe('pt-BR');
  });

  it('maps URL-path forms back to canonical', () => {
    expect(resolveLocale('en-us')).toBe('en-US');
    expect(resolveLocale('pt-br')).toBe('pt-BR');
  });

  it('collapses pt-* variants to pt-BR', () => {
    expect(resolveLocale('pt-PT')).toBe('pt-BR');
    expect(resolveLocale('pt')).toBe('pt-BR');
  });

  it('collapses en-* variants to en-US', () => {
    expect(resolveLocale('en-GB')).toBe('en-US');
    expect(resolveLocale('en')).toBe('en-US');
  });

  it('falls back to the default locale', () => {
    expect(resolveLocale('fr-FR')).toBe('en-US');
    expect(resolveLocale(undefined)).toBe('en-US');
    expect(resolveLocale(null)).toBe('en-US');
  });
});

describe('localeToPath', () => {
  it('maps canonical to lowercase URL path', () => {
    expect(localeToPath('en-US')).toBe('en-us');
    expect(localeToPath('pt-BR')).toBe('pt-br');
  });
});

describe('swapLocaleInPath', () => {
  it('swaps an existing locale prefix', () => {
    expect(swapLocaleInPath('/en-us/posts/foo', 'pt-BR')).toBe(
      '/pt-br/posts/foo'
    );
    expect(swapLocaleInPath('/pt-br/posts/foo', 'en-US')).toBe(
      '/en-us/posts/foo'
    );
  });

  it('prepends the locale when none is present', () => {
    expect(swapLocaleInPath('/posts/foo', 'pt-BR')).toBe('/pt-br/posts/foo');
  });

  it('handles a bare root path', () => {
    expect(swapLocaleInPath('/', 'en-US')).toBe('/en-us/');
  });
});

describe('assertLocaleParam', () => {
  it('accepts URL-path and canonical forms', () => {
    expect(assertLocaleParam('en-us')).toBe('en-US');
    expect(assertLocaleParam('pt-BR')).toBe('pt-BR');
  });

  it('throws on unsupported values', () => {
    expect(() => assertLocaleParam('fr-FR')).toThrow();
    expect(() => assertLocaleParam(undefined)).toThrow();
  });
});
