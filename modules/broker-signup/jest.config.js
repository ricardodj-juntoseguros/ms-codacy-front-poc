module.exports = {
  displayName: 'broker-signup',
  preset: '../../jest.preset.js',
  transform: {
    '.+\\.(js|jsx)$': 'babel-jest',
    '.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/modules/broker-signup',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/config/*.{ts,tsx}',
    '!src/constants/*.{ts,tsx}',
    '!src/application/types/*.{ts,tsx}',
    '!src/application/validations/*.{ts,tsx}',
    '!src/application/**/dataPresenter/*.{ts,tsx}',
    '!src/declarations.d.ts',
  ],
  transformIgnorePatterns: ['node_modules/(?!junto-design-system/.*)'],
  coveragePathIgnorePatterns: ['/node_modules/', 'index.ts', 'index.tsx'],
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
  },
};
