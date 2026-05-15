import propertyGroups from 'stylelint-config-recess-order/groups'

/** @type {import('stylelint').Config} */
export default {
  plugins: [
    'stylelint-order',
    'stylelint-high-performance-animation',
    '@stylistic/stylelint-plugin'
  ],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue'
  ],
  reportDescriptionlessDisables: true,
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
  rules: {
    'at-rule-no-unknown': null,
    'plugin/no-low-performance-animation-properties': true,
    '@stylistic/indentation': [
      2,
      { baseIndentLevel: 0 }
    ],
    '@stylistic/block-closing-brace-empty-line-before': 'never',
    '@stylistic/block-closing-brace-newline-before': 'always',
    '@stylistic/block-opening-brace-newline-after': 'always',
    '@stylistic/block-opening-brace-space-before': 'always',
    'order/properties-order': propertyGroups.map((group) => ({
      ...group,
      emptyLineBefore: 'never',
      noEmptyLineBetween: true
    })),
    'order/order': [
      'custom-properties',
      'declarations',
      { type: 'at-rule', name: 'extends' },
      { type: 'rule', selector: '&:hover' },
      { type: 'rule', selector: '&:focus' },
      { type: 'rule', selector: '&:active' },
      { type: 'rule', selector: '&:first-child' },
      { type: 'rule', selector: '&:nth-child' },
      { type: 'rule', selector: '&:last-child' },
      {
        type: 'at-rule',
        name: 'media'
      },
      {
        type: 'rule',
        selector: String.raw`media-:\w`
      },
      {
        type: 'rule',
        selector: '^&::(before|after)'
      },
      {
        type: 'rule',
        selector: String.raw`^&:\w`
      },
      {
        type: 'rule',
        selector: '^.'
      }
    ],
    'value-keyword-case': [
      'lower',
      { camelCaseSvgKeywords: true }
    ],
    'selector-class-pattern': [
      // eslint-disable-next-line @stylistic/max-len
      '^[a-z]([-]?[a-z0-9]+)*(__[a-z0-9]([-]?[a-z0-9]+)*)?(--[a-z0-9]([-]?[a-z0-9]+)*)?$',
      {
        resolveNestedSelectors: true,
        message: function expected(selectorValue) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          return `Expected class selector "${selectorValue}" to match BEM CSS pattern https://en.bem.info/methodology/css. Selector validation tool: https://regexr.com/3apms`
        }
      }
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global'] }
    ]
  },
  overrides: [{
    files: [
      '*.scss',
      '**/*.scss'
    ],
    customSyntax: 'postcss-scss'
  }]
}
