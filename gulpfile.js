'use strict';
var gulp = require('gulp');
var electron = require('electron-connect').server.create();
gulp.task('default', function() {
    process.env.ENV = 'dev';
    electron.start('build/main.bundle.js');
    gulp.watch([
        'main.js', 'bootstrapper.js', 'package.json', 'gulpfile.js'
    ], electron.restart);
    gulp.watch([
        'index.html','package.json', 'app/**/*.css', 'app/**/*.js'
    ], electron.reload);
});
