import fs from 'node:fs'
import js from '@eslint/js'
import pluginI18n from '@intlify/eslint-plugin-vue-i18n'
import pluginStylistic from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'
import { importX as pluginImport } from 'eslint-plugin-import-x'
import pluginJsonc, { configs as jsoncConfigs } from 'eslint-plugin-jsonc'
import pluginPromise from 'eslint-plugin-promise'
import pluginUnicorn from 'eslint-plugin-unicorn'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import { configs as tsConfigs, parser as tsParser, plugin as tsPlugin } from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

const autoImportFilePath = new URL('.eslintrc-auto-import.json', import.meta.url)
const autoImportGlobals = fs.existsSync(autoImportFilePath)
  ? JSON.parse(fs.readFileSync(autoImportFilePath)).globals
  : {}

export default defineConfig(
  js.configs.recommended,
  pluginImport.flatConfigs.recommended,
  pluginImport.flatConfigs.typescript,
  pluginUnicorn.configs.all,
  pluginStylistic.configs.recommended,
  pluginPromise.configs['flat/recommended'],
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.json'],
    languageOptions: { parser: pluginJsonc.parser },
    plugins: { jsonc: pluginJsonc },
    rules: { ...jsoncConfigs['recommended-with-json'].rules }
  },
  { ignores: ['**/*.json'] },
  {
    files: ['**/*.{ts,tsx,vue}'],
    plugins: { '@typescript-eslint': tsPlugin },
    extends: [
      ...tsConfigs.strictTypeChecked,
      ...tsConfigs.stylisticTypeChecked
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue']
      }
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'separate-type-imports' }
      ],
      '@typescript-eslint/no-unnecessary-condition': 'error'
    }
  },
  {
    files: ['**/*.{ts,jsx,js,mjs,tsx,vue}'],
    plugins: { '@typescript-eslint': tsPlugin },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...autoImportGlobals
      }
    },
    rules: {
      'curly': ['error', 'all'],
      'arrow-body-style': ['error', 'as-needed'],
      'prefer-arrow-callback': 'off',
      'no-console': ['error', { allow: ['warn', 'info', 'error'] }],
      'no-underscore-dangle': 'off',
      'no-async-promise-executor': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-unsafe-assignment': 0,
      '@typescript-eslint/no-unsafe-argument': 0,
      '@typescript-eslint/no-unsafe-return': 0,
      '@typescript-eslint/no-unsafe-call': 0,
      '@typescript-eslint/no-unsafe-member-access': 0,
      '@typescript-eslint/consistent-type-definitions': 0,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: false
        }
      ],
      'import-x/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type', 'object'],
          'pathGroups': [{ pattern: '~/components/**', group: 'internal', position: 'after' }],
          'alphabetize': { order: 'asc', caseInsensitive: true },
          'newlines-between': 'never',
          'named': { enabled: true, types: 'types-last' }
        }
      ],
      'import-x/no-unresolved': ['error', { ignore: ['^virtual:'] }],
      'promise/prefer-await-to-then': 'off',
      'promise/always-return': 'off',
      'promise/catch-or-return': [2, { allowThen: true, allowFinally: true }],
      'unicorn/no-array-reduce': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-abusive-eslint-disable': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-anonymous-default-export': 'off',
      'unicorn/prefer-global-this': 'off'
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        sourceType: 'module'
      }
    },
    rules: {
      'vue/multi-word-component-names': 0,
      'vue/require-default-prop': 0,
      'vue/no-v-html': 0,
      'vue/html-quotes': ['error', 'single'],
      'vue/block-order': ['error', { order: [['script', 'template'], 'style'] }],
      'vue/no-unused-vars': ['error', { ignorePattern: '^_' }],
      'vue/max-attributes-per-line': ['error', { singleline: 1, multiline: 1 }],
      'vue/block-tag-newline': ['error', { singleline: 'always', multiline: 'always', maxEmptyLines: 0 }]
    }
  },
  {
    files: ['**/*.vue', 'src/client/locales/**/*.json'],
    plugins: { '@intlify/vue-i18n': pluginI18n },
    rules: {
      ...pluginI18n.configs.recommended.rules,
      '@intlify/vue-i18n/no-raw-text': 'off'
    },
    settings: {
      'vue-i18n': {
        localeDir: './src/client/locales/**/*.{json}',
        messageSyntaxVersion: '^11.4.2'
      }
    }
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs', 'eslint.config.js'],
    ...tsConfigs.disableTypeChecked
  },
  {
    files: ['**/*.{ts,tsx,js,mjs,vue}', 'eslint.config.js'],
    plugins: { '@stylistic': pluginStylistic },
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
      '@stylistic/curly-newline': ['error', { consistent: true }],
      '@stylistic/nonblock-statement-body-position': ['error', 'below'],
      '@stylistic/object-curly-newline': ['error', { multiline: true }],
      '@stylistic/function-paren-newline': ['error', 'multiline'],
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/array-bracket-newline': ['error', 'consistent'],
      '@stylistic/array-element-newline': ['error', { consistent: true }],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        { blankLine: 'always', prev: '*', next: 'return' }
      ],
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
      '@stylistic/type-annotation-spacing': [
        'error',
        { before: true, after: true, overrides: { colon: { before: false, after: true } } }
      ],
      '@stylistic/arrow-spacing': ['error', { before: true, after: true }],
      '@stylistic/no-multi-spaces': ['error', { ignoreEOLComments: true }],
      '@stylistic/eol-last': 'error',
      '@stylistic/jsx-curly-newline': ['error', { multiline: 'require', singleline: 'require' }],
      '@stylistic/space-before-blocks': 'error',
      '@stylistic/spaced-comment': ['error', 'always', { block: { balanced: true } }],
      '@stylistic/lines-around-comment': ['error', { beforeBlockComment: true, allowBlockStart: true }],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/max-statements-per-line': 'off',
      '@stylistic/max-len': [
        'error',
        200,
        {
          ignoreComments: true,
          ignoreStrings: true,
          ignorePattern: String.raw`^(import\s.+\sfrom\s)`
        }
      ]
    }
  }
)
