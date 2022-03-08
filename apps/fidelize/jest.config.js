module.exports = {
  displayName: 'fidelize',
  preset: '../../jest.preset.js',
  transform: {
    '.+\\.(js|jsx)$': 'babel-jest',
    '.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/fidelize',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: [
    '/src/app/config/',
    '/src/app/services/types',
    'index.ts',
    'index.tsx',
    'polyfills.ts',
    'main.tsx',
  ],
  transformIgnorePatterns: ['node_modules/(?!junto-design-system/.*)'],
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
    '.+\\.(svg)$': '<rootDir>../../__mocks__/svgMock.ts',
  },
};
