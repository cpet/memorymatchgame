// @ts-check
const HtmlWebPackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const webpack = require('webpack');
const path = require('path');

module.exports = {
    devServer: {
        host: 'localhost',
        port: '1234'
    },
    entry: {
        main: path.resolve(__dirname, 'src/main.ts')
    },
    resolve: {
        extensions: ['.ts', '.js'],
        //@ts-ignore
        plugins: [new TsconfigPathsPlugin()]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            // {
            //     test: /lib[\\\/]dragonBones[\\\/]dragonBones.js$/,
            //     use: 'file-loader'
            // },
            {
                test: [/\.vert$/, /\.frag$/],
                use: 'raw-loader'
            },
            {
                test: [
                    /\.(png|fnt|mp3|ogg)$/
                ],
                use: [{ loader: 'file-loader', options: { name: 'assets/[name].[hash].[ext]' } }]
            },
            {
                type: 'javascript/auto',
                test: /\.json$/,
                use: [{ loader: 'file-loader', options: { name: 'assets/[name].[hash].[ext]' } }]
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            WEBGL_RENDERER: true,
            CANVAS_RENDERER: true
        }),
        new HtmlWebPackPlugin({
            template: './src/index.html'
        })
    ]
}