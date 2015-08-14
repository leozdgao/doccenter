import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import yargs from 'yargs';

// create babel cache directory
const babelCache = path.resolve(path.join(__dirname, '../.babel-cache'));
if (!fs.existsSync(babelCache)) {
  try {
    fs.mkdirSync(babelCache);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      console.error(err.stack);
    }
  }
}

// concat js loader
export const jsLoader = `babel?cacheDirectory=${babelCache}`;

// options
export const options = yargs
  .alias('p', 'optimize-minimize') // production mode
  .alias('d', 'debug') // development mode
  .option('port', {
    default: '8080',
    type: 'string'
  })
  .argv;

const baseConfig = {
    entry: undefined,
    output: undefined,
    externals: {
        'react': 'React',
        'react-router': 'ReactRouter',
        'marked': 'marked',
        'highlight': 'hljs',
        'reflux': 'Reflux',
        'echarts': 'echarts'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(options.optimizeMinimize ? 'production' : 'development')
        }
      })
    ],
    module: {
        loaders: [
            { test: /\.jsx?$/, loader: jsLoader, exclude: /node_modules/ }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
}

if (options.optimizeMinimize) {
  baseConfig.devtool = 'source-map';
}

export default baseConfig;
