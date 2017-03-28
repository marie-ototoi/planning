var nodeExternals = require('webpack-node-externals')

module.exports = {
    target: 'node', // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    devtool: 'source-map',
    module: {
        loaders: [
            { test: /\.pug$/, loader: 'pug-loader' },
            { test: /\.jsx?/, loader: 'babel-loader', exclude: /node_modules/ }
        ]
    },
    output: {
        devtoolModuleFilenameTemplate: '[absolute-resource-path]'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
}
