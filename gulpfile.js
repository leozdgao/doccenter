'use strict';

var gulp = require('gulp');
var fs = require('fs');
var os = require('os');
var files = require('./files');
var config = require('./config');

// load dependencies
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var less = require('gulp-less');
var minify = require('gulp-minify-css'); //css
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var webpack = require('gulp-webpack');
var connect = require('gulp-connect');
var open = require('gulp-open');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');

// release
gulp.task('default', ['release']);
gulp.task('release', ['release:css', 'release:js', 'copy:vendor']);

gulp.task('release:css', function() {

    //css
    return gulp.src(files.mainStyle)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['> 5%', 'last 5 version']
        })) // auto-prefix
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(files.release))
        // livereload when develop
        // .pipe(connect.reload());
        .pipe(livereload());
});

gulp.task('release:js', function() { // add jslint and uTest later maybe

    //js
    return gulp.src(files.js)
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest(files.release))
        // livereload when develop
        // .pipe(connect.reload());
        .pipe(livereload());
});

gulp.task('copy:vendor', function() {
    return gulp.src(files.vendor)
        .pipe(gulp.dest(files.release));
});

//-----------------------------------------------> for dev

gulp.task('dev', ['release'], function() {
  livereload.listen();

  nodemon({
    script: 'server/server.js',
    watch: ['src/', 'server/', 'util/'],
    ext: 'js jsx less html',
    env: { 'NODE_ENV': 'development' },
    tasks: ['release']
  });
});

function getChromeAppName() {
    switch (os.platform()) {
        case 'win32':
            return 'chrome';
        case 'darwin':
            return 'google chrome'; // mac os
        case 'linux':
            return 'google-chrome';
    }
}
