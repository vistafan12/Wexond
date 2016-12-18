'use strict';
var gulp = require('gulp');
var electron = require('electron-connect').server.create();
gulp.task('default', function () {
 electron.start();
 gulp.watch('main.js', electron.restart);
 gulp.watch(['index.html', 'package.json', '.babelrc', 'bootstrapper.js', 'app/**/*.jsx', 'app/*.jsx', 'app/**/*.js', 'app/*.js', 'css/*.css', 'js/*.js'], electron.reload);
});
