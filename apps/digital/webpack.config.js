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
        '@junto-design-system': path.resolve(
          __dirname,
          '..',
          '..',
          'libs',
          'shared',
          'junto-design-system',
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
