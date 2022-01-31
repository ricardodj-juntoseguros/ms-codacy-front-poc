module.exports = {
  displayName: 'fidelize',
  preset: '../../jest.preset.js',
  transform: {
    '.+\\.(js|jsx)$': 'babel-jest',
    '.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/fidelize',
  transformIgnorePatterns: ['node_modules/(?!junto-design-system/.*)'],
};
