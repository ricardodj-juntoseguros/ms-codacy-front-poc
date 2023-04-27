module.exports = {
  displayName: 'vendors',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': 'babel-jest',
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
  ],
  transformIgnorePatterns: ['node_modules/(?!junto-design-system/.*)'],
};
