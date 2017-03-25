const path = require('path');
const webpack = require('webpack');

module.exports = {
    target: "electron",
    devtool: "eval-source-map",
    entry: {
        browserEntry: './app/browser/browser-entry.js',
        menuEntry: './app/menu/menu-entry.js'
    },
    node: {
        __dirname: false,
        __filename: false
    },

    output: {
        path: path.join(__dirname, 'dist'),
        filename: "[name].bundle.js"
    },

    devServer: {
        contentBase: './',
        publicPath: 'http://localhost:8080/dist/'
    },

    module: {
        rules: [
            {
                test: /\.(scss)$/,
                include: path.resolve(__dirname, 'app/resources'),
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    }, {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }, {
                test: /\.(png|gif|jpg|woff2|tff)$/,
                include: path.resolve(__dirname, 'app/resources'),
                use: [
                    {
                        loader: "url-loader"
                    }
                ]
            }, {
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, "app"),
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['react', 'es2015', 'stage-0']
                        }
                    }
                ]
            }
        ]
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

    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx']
    }
}
