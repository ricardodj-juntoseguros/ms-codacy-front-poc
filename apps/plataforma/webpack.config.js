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
        '@shared/hooks': path.resolve(
          __dirname,
          '..',
          '..',
          'libs',
          'shared',
          'hooks',
          'src',
        ),
        '@modules/corretor-emissao': path.resolve(
          __dirname,
          '..',
          '..',
          'modules',
          'corretor-emissao',
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
