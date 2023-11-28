module.exports = {
  displayName: 'broker-issuance',
  preset: '../../jest.preset.js',
  transform: {
    '.+\\.(js|jsx)$': 'babel-jest',
    '.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/modules/broker-issuance',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/config/*.{ts,tsx}',
    '!src/constants/*.{ts,tsx}',
    '!src/application/types/*/*.{ts,tsx}',
    '!src/application/validations/*.{ts,tsx}',
    '!src/application/validations/*/*.{ts,tsx}',
    '!src/application/validations/**/**/*.{ts,tsx}',
    '!src/application/**/dataPresenter/*.{ts,tsx}',
    '!src/declarations.d.ts',
    '!src/presentation/assets/*.{svg,png,jpg}',
    '!dist/*',
  ],
  transformIgnorePatterns: ['node_modules/(?!junto-design-system/.*)'],
  coveragePathIgnorePatterns: ['/node_modules/', 'index.ts', 'index.tsx'],
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
    '.+\\.(svg)$': '<rootDir>../../__mocks__/svgMock.ts',
  },
};
