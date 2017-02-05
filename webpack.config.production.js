const path = require('path');
const webpack = require('webpack');

module.exports = {
    target: "electron",
    devtool: "eval-source-map",
    entry: {
        entry: './app/renderer/entry.js',
        main: './app/main/main.js',
        history: './app/renderer/components/history/history.js'
    },
    node: {
        __dirname: false,
        __filename: false
    },

    output: {
        path: path.join(__dirname, 'build'),
        filename: "[name].bundle.js"
    },

    devServer: {
        contentBase: './',
        publicPath: 'http://localhost:8080/build/'
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                include: path.resolve(__dirname, "app/renderer/public/css"),
                use: ['style-loader', 'css-loader']
            }, {
                test: /(\.js$|\.jsx$)/,
                include: path.resolve(__dirname, "app"),
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['react', 'es2015']
                    }
                }]
            }
        ]
    },

    plugins: [
        /* TODO: UglifyJs is not working with Babel 6 new webpack.optimize.UglifyJsPlugin() */
    ],

    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx']
    }
}
