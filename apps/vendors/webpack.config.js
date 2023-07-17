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
        '@modules/vendors-proposal': path.resolve(
          __dirname,
          '..',
          '..',
          'modules',
          'vendors-proposal',
          'src',
        ),
        '@modules/vendors-authentication': path.resolve(
          __dirname,
          '..',
          '..',
          'modules',
          'vendors-authentication',
          'src',
        ),
        '@modules/vendors-policies': path.resolve(
          __dirname,
          '..',
          '..',
          'modules',
          'vendors-policies',
          'src',
        ),
        '@modules/vendors-pre-approval': path.resolve(
          __dirname,
          '..',
          '..',
          'modules',
          'vendors-pre-approval',
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
        '@shared/ui': path.resolve(
          __dirname,
          '..',
          '..',
          'libs',
          'shared',
          'ui',
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
