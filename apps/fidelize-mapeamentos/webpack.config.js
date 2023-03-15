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
        '@modules/fidelize-mapeamentos-import': path.resolve(
          __dirname,
          '..',
          '..',
          'modules',
          'fidelize-mapeamentos-import',
          'src',
        ),
        '@services': path.resolve(
          __dirname,
          '..',
          '..',
          'libs',
          'services',
          'src',
        ),
        '@infrastructure/http-client': path.resolve(
          __dirname,
          '..',
          '..',
          'libs',
          'infrastructure',
          'http-client',
          'src',
        ),
        '@shared/ui': path.resolve(
          __dirname,
          '..',
          '..',
          'libs',
          'shared',
          'ui',
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
