const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: "eval-source-map",
    entry: {
        history: './app/renderer/components/history/history.js'
    },
    node: {
        __dirname: false,
        __filename: false
    },

    output: {
        path: path.join(__dirname, 'app/renderer/public/history/build'),
        filename: '[name].bundle.js'
    },

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
