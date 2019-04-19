const path = require("path");

const webpack = require("webpack");
const WebpackBar = require("webpackbar");
const extractTextPlugin = require("extract-text-webpack-plugin");

const banner = `TC Blog [hash] build at ${new Date().toISOString()} (https://tautcony.github.io/)
Copyright ${new Date().getFullYear()} TautCony
Licensed under Apache-2.0 (https://github.com/tautcony/tautcony.github.io/blob/master/LICENSE)`;

module.exports = {
    target: "web",
    entry: path.join(__dirname, "..", "ts", "tc-blog"),
    output: {
        filename: "js/tc-blog.min.js",
        path: path.resolve(__dirname, ".."),
        devtoolModuleFilenameTemplate: "[absolute-resource-path]"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                enforce: "pre",
                use: [
                    {
                        loader: "tslint-loader",
                        options: {
                            typeCheck: true
                        },
                    },
                ],
            },
            {
                test: /.tsx?$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    },
                    "ts-loader"
                ],
                exclude: /node_modules/  
            },
            {
                test: /\.less$/,
                use: extractTextPlugin.extract({
                    use: [
                        'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: (loader) => [
                                require('autoprefixer')(),
                                require('cssnano')()
                              ]
                        }
                    },
                    'less-loader']
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000
                }
            }
        ]
    },
    plugins: [
        new WebpackBar(),
        new extractTextPlugin('css/tc-blog.min.css'),
        new webpack.BannerPlugin(banner)],
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".less"]
    },
}