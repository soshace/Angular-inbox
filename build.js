var gulp = require('gulp');
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var babel = require('gulp-babel');
var es2015 = require('babel-preset-es2015');

gulp.task('build-minify', function() {
    gulp.src('public/index.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', babel({ presets: [es2015] })))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

gulp.start('build-minify');
