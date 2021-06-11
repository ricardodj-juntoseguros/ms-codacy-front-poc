module.exports = {
  displayName: 'corretor-emissao',
  preset: '../../jest.preset.js',
  transform: {
    '.+\\.(js|jsx)$': 'babel-jest',
    '.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/modules/corretor-emissao',
  transformIgnorePatterns: ['node_modules/(?!junto-design-system/.*)'],
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
  },
};
