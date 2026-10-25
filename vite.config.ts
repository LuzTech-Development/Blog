import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    plugins: ['oxc', 'typescript', 'unicorn'],
    jsPlugins: [
      'eslint-plugin-astro',
      {
        name: 'vite-plus',
        specifier: 'vite-plus/oxlint-plugin'
      }
    ],
    categories: {
      correctness: 'warn'
    },
    env: {
      builtin: true
    },
    ignorePatterns: [
      'dist/**',
      '.astro/**',
      'public/pagefind/**',
      'public/posts/stargazed-container2wasm/**'
    ],
    rules: {
      'astro/missing-client-only-directive-value': 'error',
      'astro/no-conflict-set-directives': 'error',
      'astro/no-deprecated-astro-canonicalurl': 'error',
      'astro/no-deprecated-astro-fetchcontent': 'error',
      'astro/no-deprecated-astro-resolve': 'error',
      'astro/no-deprecated-getentrybyslug': 'error',
      'astro/no-exports-from-components': 'error',
      'astro/no-prerender-export-outside-pages': 'error',
      'astro/no-unused-define-vars-in-style': 'error',
      'no-console': 'error',
      'vite-plus/prefer-vite-plus-imports': 'error'
    },
    overrides: [
      {
        files: ['*.astro', '**/*.astro'],
        globals: {
          Fragment: 'readonly'
        },
        env: {
          astro: true,
          node: true
        }
      },
      {
        files: [
          '**/*.astro/*.js',
          '*.astro/*.js',
          '**/*.astro/*.ts',
          '*.astro/*.ts'
        ],
        rules: {},
        jsPlugins: [],
        env: {
          browser: true
        }
      },
      {
        files: ['scripts/**/*.{js,mjs,cjs,ts}'],
        rules: {
          'no-console': 'off'
        }
      }
    ],
    options: {
      typeAware: true,
      typeCheck: true
    }
  },
  fmt: {
    arrowParens: 'avoid',
    semi: true,
    tabWidth: 2,
    printWidth: 80,
    singleQuote: true,
    jsxSingleQuote: false,
    trailingComma: 'none',
    bracketSpacing: true,
    endOfLine: 'lf',
    sortPackageJson: false,
    sortTailwindcss: {},
    astro: {},
    associations: [
      {
        files: ['*.astro'],
        language: 'astro'
      }
    ],
    ignorePatterns: [
      'dist/**',
      '.astro/**',
      'public/pagefind/**',
      'public/posts/stargazed-container2wasm/**'
    ]
  },
  test: {
    include: ['tests/**/*.test.ts']
  },
  staged: {
    '*': 'vp check --fix'
  }
});
