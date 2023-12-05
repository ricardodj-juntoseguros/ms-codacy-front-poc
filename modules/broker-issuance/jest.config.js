module.exports = {
  displayName: 'broker-issuance',
  preset: '../../jest.preset.js',
  transform: {
    '.+\\.(js|jsx)$': 'babel-jest',
    '.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/modules/broker-issuance',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  transformIgnorePatterns: ['node_modules/(?!junto-design-system/.*)'],
  coveragePathIgnorePatterns: [
    '/src/config/',
    '/src/constants/',
    '/src/application/types/',
    '/src/application/validations/',
    'index.ts',
    'index.tsx',
  ],
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
    '.+\\.(svg)$': '<rootDir>../../__mocks__/svgMock.ts',
  },
};
