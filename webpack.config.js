const path = require('path');
const webpack = require('webpack');

module.exports = {
    target: "electron",
    devtool: "eval-source-map",
    entry: {
        entry: './app/renderer/entry.js',
        main: './app/main/main.js'
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
        preLoaders: [
            {
                test: /(\.js$|\.jsx$)/,
                include: path.resolve(__dirname, "app"),
                loader: "eslint"
            }
        ],
        loaders: [
            {
                test: /\.css$/,
                include: path.resolve(__dirname, "app/renderer/public/css"),
                loaders: ['style', 'css']
            }, {
                test: /\.json$/,
                include: path.resolve(__dirname),
                loaders: ['json']
            }, {
                test: /(\.js$|\.jsx$)/,
                include: path.resolve(__dirname, "app"),
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    },

    eslint: {
        configFile: '.eslintrc'
    },

    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx']
    },

    plugins: [new webpack.HotModuleReplacementPlugin()]
}
