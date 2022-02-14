module.exports = {
  displayName: 'shared-utils',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: '../../../coverage/libs/shared/utils',
};
