module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@stylistic/ts',
    '@stylistic/js',
    'import-newlines',
    'react-refresh', // Included with Vite
    'simple-import-sort',
  ],
  rules: {

    // Style
    '@stylistic/js/brace-style': "error",
    '@stylistic/js/comma-dangle': ["error", "always-multiline"],
    '@stylistic/js/eol-last': ["error", "always"],
    '@stylistic/js/jsx-quotes': ["error", "prefer-double"],
    '@stylistic/js/no-multi-spaces': "error",
    '@stylistic/js/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
    '@stylistic/ts/indent': ['error', 2],
    '@stylistic/ts/object-curly-spacing': ['error', 'always'],
    '@stylistic/ts/quotes': ['error', 'single'],
    '@stylistic/ts/semi': 'error',

    // Replace JS rules with TS rules:
    'quotes': 'off',
    '@typescript-eslint/quotes': ['error', 'single'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],

    // Misc.
    "arrow-body-style": ["error", "as-needed"],

    // Plugin configurations
    'import-newlines/enforce': ['error', 2],
    'react-refresh/only-export-components': [ 'warn', { allowConstantExport: true } ],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': ['error', {
      'groups': [
        ['^react', '^@?\\w'], // External Packages (React related first)
        ['^src', '^~(/.*|$)', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // Internal packages
        ['^.+\\.?(css|scss)$'] // Style
      ]
    }],
  },
}


const path = require('path'); // used for path resolution
const oldConfig = {
  root: true,
  env: { browser: true, es2020: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.node.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  ignorePatterns: ['dist', '.eslintrc.cjs', 'cypress', 'public', '**.d.ts'],
  plugins: [
    // 'import',
    'simple-import-sort',
    'import-newlines',
    'react-refresh', // Included in Vite
    // 'import-resolver-alias',
    // '@typescript-eslint',
    //   'react'
  ],
  // settings: {
  //   'import/resolver': {
  //     typescript: {} // this loads <rootdir>/tsconfig.json to eslint
  //   },
  // },
  // settings: {
  //   'import/resolver': {
  //     alias: [
  //       ['~', './src'],
  //     ],
  //   },
  // },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
      //  Used to give aliases to absolute paths and resolve them
      alias: {
        map: ['~', path.resolve(__dirname, './src')],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      }
    },
  },
  extends: [
    'airbnb',
    'airbnb-typescript'
  ],
  rules: {
    'max-len': 'warn',
    'prefer-const': 'warn',

    // Replace JS rules with TS rules:
    'import/no-cycle': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],

    'quotes': 'off',
    '@typescript-eslint/quotes': ['error', 'single'],

    'import/no-extraneous-dependencies': ['error', {
      'devDependencies': [
        '**/*.spec.js',
        '**/*.test.js'
      ]
    }],


    'consistent-return': 'off',
    'import/no-unresolved': 'off',
    // Disable this one once the resolver works
    'import/extensions': ['error', 'ignorePackages', {
      '': 'never',
      'ts': 'never',
      'tsx': 'never',
      'js': 'never',
      'jsx': 'never',
    }],
    'import/no-extraneous-dependencies': ['error', { 'devDependencies': ['./src/mocks/**/*.ts', '**/*.test.js', '**/*.spec.js'] }],
    'import/prefer-default-export': 'off',
    'import-newlines/enforce': ['error', 2],
    // 'max-len': 'warn',
    // 'no-underscore-dangle': 'off',

    // 'prefer-const': 'warn',

    'react/function-component-definition': ['error', { 'namedComponents': 'arrow-function' }],
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-sort-props': ['error', { 'reservedFirst': ['key'] }],
    'react/no-array-index-key': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': ['error', { 'ignoreFunctionalComponents': true }],
    'sort-keys': ['error', 'asc', { 'caseSensitive': false, 'minKeys': 3, 'natural': true }],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': ['error', {
      'groups': [
        ['^react', '^@?\\w'], // External Packages (React related first)
        ['^src', '^~(/.*|$)', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // Internal packages
        ['^.+\\.?(css|scss)$'] // Style
      ]
    }],
  }
};
