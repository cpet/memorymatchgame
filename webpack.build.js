// @ts-check

const config = require('./webpack.config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

config.plugins.push(
    //@ts-ignore
    new UglifyJsPlugin({
        sourceMap: false,
        cache: true,
        uglifyOptions: {
            compress: true,
            mangle: true
        },
        extractComments: true,
        parallel: 4
    })
)

module.exports = config;