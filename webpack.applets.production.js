const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: "eval-source-map",
    entry: {
        history: './app/renderer/components/history/history.js',
        newtab: './app/renderer/components/newtab/newtab.js'
    },
    node: {
        __dirname: false,
        __filename: false
    },

    output: {
        path: path.join(__dirname, 'app/renderer/public/build'),
        filename: '[name].bundle.js'
    },

    plugins: [
        /* TODO: UglifyJs is not working with Babel 6 new webpack.optimize.UglifyJsPlugin() */
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],

    module: {
        rules: [
            {
                test: /(\.js$|\.jsx$)/,
                include: path.resolve(__dirname, 'app'),
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['react', 'es2015']
                    }
                }]
            }
        ]
    }
}
