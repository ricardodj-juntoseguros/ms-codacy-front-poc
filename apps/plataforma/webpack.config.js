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
        '@libs': path.resolve(__dirname, '..', '..', 'libs'),
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
  };
};
