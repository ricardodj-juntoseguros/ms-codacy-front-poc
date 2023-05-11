module.exports = {
  displayName: 'vendors',
  preset: '../../jest.preset.js',
  transform: {
    '.+\\.(js|jsx)$': 'babel-jest',
    '.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/vendors',
  coveragePathIgnorePatterns: [
    '/src/app/config/',
    '/src/app/services/types',
    'index.ts',
    'index.tsx',
    'polyfills.ts',
    'main.tsx',
    '/src/app/constants'
  ],
  transformIgnorePatterns: ['node_modules/(?!junto-design-system/.*)'],
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
    '.+\\.(svg)$': '<rootDir>../../__mocks__/svgMock.ts',
  },
};
