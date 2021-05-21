module.exports = {
  displayName: 'plataforma-ui',
  preset: '../../../jest.preset.js',
  transform: {
    '.+\\.(js|jsx)$': 'babel-jest',
    '.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/plataforma/ui',
  transformIgnorePatterns: ['node_modules/(?!junto-design-system/.*)'],
};
