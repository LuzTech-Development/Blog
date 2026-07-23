import type { Locale } from '../i18n';

/**
 * Canonical Obsidian callout types recognized by `rehype-callouts` with the
 * default `theme: 'obsidian'`, plus the GitHub-flavored `important` /
 * `caution` types that the plugin also accepts. Aliases (e.g. `tldr` →
 * `abstract`, `hint` → `tip`) inherit the title of their canonical type at
 * runtime, so only these roots need to be translated — except when we want
 * a distinct title for a well-known alias (`important` gets its own entry
 * to match GitHub semantics rather than falling back to "Tip").
 *
 * If a future version of the plugin adds a new canonical callout, extend
 * this union — TypeScript will then require every locale in
 * `CALLOUT_TITLES` to provide the missing translation.
 */
export type CalloutType =
  | 'note'
  | 'abstract'
  | 'info'
  | 'todo'
  | 'tip'
  | 'important'
  | 'success'
  | 'question'
  | 'warning'
  | 'caution'
  | 'failure'
  | 'danger'
  | 'bug'
  | 'example'
  | 'quote';

export type CalloutTitles = Record<CalloutType, string>;

/**
 * Localized titles for every callout type, keyed by locale.
 *
 * The `Record<Locale, ...>` shape is what enforces the "fail on new locale"
 * contract: adding a value to `LOCALES` in `@/utils/i18n` without extending
 * this map is a TypeScript error surfaced by `astro check` at build time.
 */
export const CALLOUT_TITLES: Record<Locale, CalloutTitles> = {
  'en-US': {
    note: 'Note',
    abstract: 'Abstract',
    info: 'Info',
    todo: 'Todo',
    tip: 'Tip',
    important: 'Important',
    success: 'Success',
    question: 'Question',
    warning: 'Warning',
    caution: 'Caution',
    failure: 'Failure',
    danger: 'Danger',
    bug: 'Bug',
    example: 'Example',
    quote: 'Quote'
  },
  'pt-BR': {
    note: 'Nota',
    abstract: 'Resumo',
    info: 'Informação',
    todo: 'A fazer',
    tip: 'Dica',
    important: 'Importante',
    success: 'Sucesso',
    question: 'Pergunta',
    warning: 'Aviso',
    caution: 'Cuidado',
    failure: 'Falha',
    danger: 'Perigo',
    bug: 'Bug',
    example: 'Exemplo',
    quote: 'Citação'
  }
};
