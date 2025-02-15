module.exports = {
  displayName: 'shared-ui',
  preset: '../../../jest.preset.js',
  transform: {
    '.+\\.(js|jsx)$': 'babel-jest',
    '.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/shared/ui',
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
    '.+\\.(svg)$': '<rootDir>../../../__mocks__/svgMock.ts',
  },
};
