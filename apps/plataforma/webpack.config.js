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
        '@shared/ui': path.resolve(
          __dirname,
          '..',
          '..',
          'libs',
          'shared',
          'ui',
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
        '@shared/hooks': path.resolve(
          __dirname,
          '..',
          '..',
          'libs',
          'shared',
          'hooks',
          'src',
        ),
        '@modules/broker-issuance': path.resolve(
          __dirname,
          '..',
          '..',
          'modules',
          'broker-issuance',
          'src',
        ),
        '@modules/broker-signup': path.resolve(
          __dirname,
          '..',
          '..',
          'modules',
          'broker-signup',
          'src',
        ),
        '@modules/broker-signup-direct': path.resolve(
          __dirname,
          '..',
          '..',
          'modules',
          'broker-signup-direct',
          'src',
        ),
        '@modules/broker-campaigns': path.resolve(
          __dirname,
          '..',
          '..',
          'modules',
          'broker-campaigns',
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
        '@services': path.resolve(
          __dirname,
          '..',
          '..',
          'libs',
          'services',
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
