module.exports = {
    js: [
      'src/js/**/*.js',
      'src/js/**/*.jsx'
    ],
    css: [
      'src/less/**/*.less'
    ],
    views: [
      'index.html'
    ],
    vendor: [
      './src/vendors/highlight.pack.js',
      './src/index.html',
      './node_modules/react/dist/react.js',
      './node_modules/react/dist/react.min.js',
      './node_modules/react-router/umd/ReactRouter.min.js',
      './node_modules/marked/marked.min.js',
      './node_modules/reflux/dist/reflux.min.js'
    ],
    mainStyle: 'src/less/site.less',
    destCss: 'style.css',
    release: './assets',
    entry: './assets/index.html'
};
