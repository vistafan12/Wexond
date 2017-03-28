const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    history: './app/pages/history/history.js',
    newtab: './app/pages/newtab/newtab.js'
  },
  node: {
    __dirname: false,
    __filename: false
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')})
  ],

  devServer: {
    contentBase: './',
    publicPath: 'http://localhost:8181/dist/'
  },

  module: {
    rules: [
      {
        test: /(\.js$|\.jsx$)/,
        include: path.resolve(__dirname, 'app'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react', 'es2015', 'stage-0']
            }
          }
        ]
      }, {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'app/resources'),
        use: [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
}
