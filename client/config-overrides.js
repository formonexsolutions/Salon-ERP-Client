const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = function override(config) {
  if (config.optimization && config.optimization.minimizer) {
    config.optimization.minimizer = config.optimization.minimizer.map(
      minimizer => {
        if (minimizer.constructor.name === 'CssMinimizerPlugin') {
          return new CssMinimizerPlugin({
            minimizerOptions: {
              preset: [
                'default',
                {
                  discardComments: { removeAll: true },
                  // Add additional customization here
                },
              ],
            },
          });
        }
        return minimizer;
      }
    );
  }
  return config;
};
