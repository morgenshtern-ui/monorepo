/* eslint perfectionist/sort-objects: "error" */
import makeEslintConfig from '@antfu/eslint-config'

export const eslintConfig = makeEslintConfig({
  javascript: {
    overrides: {
      'array-callback-return': ['error', { allowImplicit: false, allowVoid: false, checkForEach: true }],
      'arrow-body-style': 'off', // TODO: enable?
      'camelcase': ['error', { allow: ['^UNSAFE_'], ignoreDestructuring: false, ignoreImports: false, properties: 'never' }],
      'capitalized-comments': 'off',
      'class-methods-use-this': ['error', { exceptMethods: [] }],
      'complexity': 'off',
      'consistent-return': 'off', // TODO: enable?
      'consistent-this': ['error', 'self'],
      'curly': ['error', 'all'],
      'default-case': ['error', { commentPattern: '^no default$' }],
      'default-param-last': 'error',
      'for-direction': 'off',
      'func-name-matching': 'off',
      'func-names': ['error', 'as-needed'],
      'func-style': 'off', // TODO: enable?
      'getter-return': ['error', { allowImplicit: false }], // TODO: ts
      'grouped-accessor-pairs': ['error', 'getBeforeSet'],
      'guard-for-in': 'error',
      'id-denylist': 'off',
      'id-length': 'off',
      'id-match': 'off',
      'init-declarations': ['error', 'always'],
      'line-comment-position': 'off',
      'logical-assignment-operators': ['error', 'always'],
      'max-classes-per-file': ['error', 1],
      'max-depth': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-nested-callbacks': 'off',
      'max-params': 'off',
      'max-statements': 'off',
      'multiline-comment-style': 'off',
      'no-await-in-loop': 'error',
      'no-bitwise': ['error', { allow: ['~'] }],
      'no-constant-binary-expression': 'error',
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-constructor-return': 'error',
      'no-continue': 'off', // TODO: enable?
      'no-div-regex': 'error',
      'no-dupe-else-if': 'error',
      'no-duplicate-imports': 'off', // handled by `import/no-duplicates` TODO:
      'no-else-return': ['error', { allowElseIf: false }],
      'no-empty-function': ['error', { allow: ['arrowFunctions', 'functions', 'methods'] }],
      'no-empty-static-block': 'error',
      'no-eq-null': 'off',
      'no-extra-label': 'error',
      'no-implicit-coercion': ['error', {
        allow: ['!!', '~', '+'],
      }],
      'no-implicit-globals': 'error',
      'no-inline-comments': 'off',
      'no-inner-declarations': ['error', 'both'],
      'no-invalid-this': 'error',
      'no-label-var': 'error',
      'no-lonely-if': 'off', // TODO: enable?
      'no-loop-func': 'error',
      'no-magic-numbers': 'off',
      'no-multi-assign': 'error',
      'no-negated-condition': 'off',
      'no-nested-ternary': 'off',
      'no-new-native-nonconstructor': 'off', // TODO:
      'no-nonoctal-decimal-escape': 'error',
      'no-object-constructor': 'error',
      'no-param-reassign': 'off', // TODO: enable
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'no-promise-executor-return': 'error',
      'no-restricted-exports': ['error', { restrictedNamedExports: ['default'] }],
      'no-restricted-imports': [
        'error',
        {
          patterns: ['**/node_modules/*'],
        },
      ],
      'no-return-assign': ['error', 'always'],
      'no-script-url': 'error',
      'no-setter-return': 'error',
      'no-shadow': 'error',
      'no-ternary': 'off',
      'no-undefined': 'off',
      'no-underscore-dangle': 'off',
      'no-unsafe-optional-chaining': ['error', { disallowArithmeticOperators: true }],
      'no-unused-labels': 'error',
      'no-unused-private-class-members': 'error',
      'no-useless-concat': 'error',
      'no-useless-escape': 'off',
      'no-void': 'error',
      'no-warning-comments': 'off',
      'operator-assignment': ['error', 'always'],
      'prefer-destructuring': 'off', // TODO: enable?
      'prefer-named-capture-group': 'off',
      'prefer-numeric-literals': 'error',
      'prefer-object-has-own': 'error',
      'prefer-object-spread': 'error',
      'radix': ['error', 'as-needed'],
      // 'sort-keys': 'off',
      'require-atomic-updates': 'error',
      'require-await': 'off',
      'require-unicode-regexp': 'off',
      'require-yield': 'error',
      // 'sort-vars': 'off',
      'strict': ['error', 'never'],
    },
  },

  stylistic: true,
}, {
  // Without `files`, they are general rules for all files
  rules: {
    'node/file-extension-in-import': ['error', 'always'],
  },
})
