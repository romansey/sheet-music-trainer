var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    rimraf = require('rimraf'),
    sourcemaps = require('gulp-sourcemaps'),
    buffer = require('vinyl-buffer'),
    jshint = require('gulp-jshint');

gulp.task('default', ['lint', 'html', 'css', 'js']);
gulp.task('debug', ['lint', 'html', 'css', 'jsdebug']);
gulp.task('dev', ['debug', 'watch']);

gulp.task('clean', function (cb) {
    rimraf('./dist', cb);
});

gulp.task('html', function () {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task('js', function() {
    browserify({
        entries: './src/js/main.js'
    })
        .transform(babelify)
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
});

gulp.task('jsdebug', function() {
    browserify({
            entries: './src/js/main.js',
            debug: true
        })
        .transform(babelify)
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'))
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
    gulp.watch('src/js/**/*.js', ['jsdebug']);
    gulp.watch('src/css/**/*.css', ['css']);
    gulp.watch('src/**/*.html', ['html']);
});
