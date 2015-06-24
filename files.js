module.exports = {
    js: [
      'src/js/**/*.js',
      'src/js/**/*.jsx'
    ],
    css: [
      'src/css/**/*.css'
    ],
    views: [
      'index.html'
    ],
    vendor: [
      './src/index.html',
      './node_modules/react/dist/react.min.js',
      './node_modules/react-router/umd/ReactRouter.min.js'
    ],
    destCss: 'style.css',
    release: './assets',
    entry: './assets/index.html'
};
