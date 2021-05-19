module.exports = {
  displayName: 'plataforma',
  preset: '../../jest.preset.js',
  transform: {
    '.+\\.(js|jsx)$': 'babel-jest',
    '.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/plataforma',
  transformIgnorePatterns: ['node_modules/(?!junto-design-system/.*)'],
};
