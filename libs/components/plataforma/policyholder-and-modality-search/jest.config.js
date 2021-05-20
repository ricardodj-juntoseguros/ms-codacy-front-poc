module.exports = {
  displayName: 'policyholder-and-modality-search',
  preset: '../../../../jest.preset.js',
  transform: {
    '.+\\.(js|jsx)$': 'babel-jest',
    '.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../coverage/libs/components/plataforma/policyholder-and-modality-search',
  transformIgnorePatterns: ['node_modules/(?!junto-design-system/.*)'],
};
