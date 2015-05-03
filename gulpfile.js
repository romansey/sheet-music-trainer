var gulp = require('gulp'),
    webpack = require('gulp-webpack'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    webpackConfig = require('./webpack.config');

gulp.task('default', ['lint', 'html', 'css', 'js']);
gulp.task('debug', ['lint', 'html', 'css', 'jsdebug']);
gulp.task('dev', ['debug', 'watch']);

gulp.task('html', function () {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task('js', function() {
    gulp.src('src/js/main.js')
        .pipe(webpack(webpackConfig))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('jsdebug', function() {
    gulp.src('src/js/main.js')
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('css', function() {
    gulp.src('src/css/**/*.css')
        .pipe(minifyCSS())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('lint', function () {
    gulp.src('src/js/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/css/**/*.css', ['css']);
    gulp.watch('src/**/*.html', ['html']);
});
