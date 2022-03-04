const path = require('path')

const source = './src/site.ts'
const target = 'site.js'

// @ts-check
/**
 * @type { import('webpack').WebpackOptionsNormalized }
 */
const config = {
  optimization: {
    minimize: false,
  },
  entry: source,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: target,
    path: path.resolve(__dirname, 'dist'),
  },
}

module.exports = config
