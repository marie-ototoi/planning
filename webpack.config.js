const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: {
        calendar: './views/calendar',
        styles: './views/styles/styles'
    },
    output: {
        path: './public',
        filename: 'scripts/[name].js',
        devtoolModuleFilenameTemplate: 'webpack:///[resource-path]',
        library: 'Calendar'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            { test: /\.pug$/, loader: 'pug-loader' },
            { test: /\.jsx?/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.css$/, loader: ExtractTextPlugin.extract({ use: 'css-loader', fallback: 'style-loader' }) },
            { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file-loader?name=fonts/[name].[ext]' }
        ]
    },
    plugins: [
        new ExtractTextPlugin('styles/calendar.css')
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    }
}
