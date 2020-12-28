const path = require('path');

const commonJSConfig = {
  entry: ['core-js/stable', './lib/XazabPlatformProtocol.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'XazabPlatformProtocol.min.js',
    library: 'XazabPlatformProtocol',
    libraryTarget: 'umd',
  },
  node: {
    fs: 'empty',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};

module.exports = [commonJSConfig];
