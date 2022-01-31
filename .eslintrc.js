module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'prettier'],
  rules: {
    'react/prop-types': 'off',
    'prettier/prettier': 'off',
    'react/jsx-filename-extension': [
      'warn',
      { extensions: ['.tsx', '.ts', '.js', '.jsx'] },
    ],
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/no-named-as-default': 'off',
    'import/extensions': [
      'off',
      'always',
      {
        ignorePackages: true,
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-props-no-spreading': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'no-unused-expressions': 'off',
    'no-param-reassign': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'no-return-await': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.spec.tsx'] },
    ],
    'no-shadow': 'off',
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      rules: {
        'react/prop-types': 'warn',
        '@typescript-eslint/no-empty-function': 'off',
      },
    },
  ],
};
