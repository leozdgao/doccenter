import path from 'path';
import webpack from 'webpack';
import glob from 'glob';

export default {
    entry: {
      app: path.join(__dirname, '../src/js/app.main.js')
    },
    output: {
        path: path.join(__dirname, '../assets'),
        filename: '[name].min.js',
        sourceMapFilename: '[file].map',
        publicPath: ''
    },
    externals: {
        'react': 'React',
        'react-router': 'ReactRouter',
        'marked': 'marked',
        'highlight': 'hljs',
        'reflux': 'Reflux'
    },
    devtool: 'source-map',
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
}
