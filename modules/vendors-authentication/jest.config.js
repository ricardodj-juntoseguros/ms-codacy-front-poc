module.exports = {
  displayName: 'vendors-authentication',
  preset: '../../jest.preset.js',
  transform: {
    '.+\\.(js|jsx)$': 'babel-jest',
    '.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/modules/vendors-authentication',
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
    '.+\\.(svg)$': '<rootDir>../../__mocks__/svgMock.ts',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>../../__mocks__/fileMock.js'
  },
};
