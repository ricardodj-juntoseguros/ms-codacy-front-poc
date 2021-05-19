module.exports = {
  displayName: 'digital',
  preset: '../../jest.preset.js',
  transform: {
    '.+\\.(js|jsx)$': 'babel-jest',
    '.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/digital',
  transformIgnorePatterns: ['node_modules/(?!junto-design-system/.*)'],
};
