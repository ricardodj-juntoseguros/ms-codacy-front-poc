const nrwlConfig = require('@nrwl/react/plugins/webpack.js');
const path = require('path');

module.exports = (config, context) => {
  nrwlConfig(config);

  return {
    ...config,
    resolve: {
      extensions: [...config.resolve.extensions, '.scss'],
      alias: {
        ...config.resolve.alias,
        '@modules/fidelize-dashboard': path.resolve(
          __dirname,
          '..',
          '..',
          'modules',
          'fidelize-dashboard',
          'src',
        ),
        '@shared/utils': path.resolve(
          __dirname,
          '..',
          '..',
          'libs',
          'shared',
          'utils',
          'src',
        ),
      },
    },
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.(ts|tsx)$/,
          loader: 'ts-loader',
          options: {
            allowTsInNodeModules: true,
          },
        },
      ],
    },
    devServer: {
      ...config.devServer,
      compress: true,
    },
  };
};
