const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    resolve: {
        fallback: {
            "querystring": require.resolve("querystring-es3"),
            "path": require.resolve("path-browserify"),
            "zlib": require.resolve("browserify-zlib"),
            "stream": require.resolve("stream-browserify"),
            "util": require.resolve("util/"),
            "assert": require.resolve("assert/"),
            "buffer": require.resolve("buffer/"),
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "url": require.resolve("url/"),
            "os": require.resolve("os-browserify/browser"),
            "net": false,
            "tls": false,
            "child_process": false,
            "async_hooks": false,
            "cluster": false,
            "v8": false,
            "perf_hooks": false,
            "fs": false // fs e outros, não podem ser polyfilled no navegador, então defina como false
        }
    },
    plugins: [
        new NodePolyfillPlugin(),
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
            global: require.resolve('process/browser')
        }),
        new webpack.ContextReplacementPlugin(
            /express[\/\\]lib/,
            path.resolve(__dirname, 'src')
        )
    ],
    externals: {
        'metrics-server': 'commonjs2 metrics-server'
    }
};
