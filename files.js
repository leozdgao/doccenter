module.exports = {
    js: [
      'src/js/**/*.jsx?'
    ],
    css: [
      'src/css/**/*.css'
    ],
    views: [
      'index.html'
    ],
    vendor: [
      './node_modules/react/dist/react.min.js'
    ],
    destCss: 'style.css',
    release: './assets',
    entry: './index.html'
};
