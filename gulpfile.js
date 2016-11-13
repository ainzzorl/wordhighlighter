var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProjectSrc = ts.createProject('tsconfig-src.json');
var tsProjectSpec = ts.createProject('tsconfig-spec.json');
var jasmine = require('gulp-jasmine');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');

gulp.task('clean', function () {
    return gulp.src('build/*', {read: false})
        .pipe(clean());
});

gulp.task('copy-html', function () {
    return gulp.src(['html/**/*'])
        .pipe(gulp.dest('build/html'));
});

gulp.task('copy-static-content', ['copy-html'], function () {
    return gulp.src(['manifest.json', 'wordhighlighter.css'])
        .pipe(gulp.dest('build'));
});

gulp.task('compile-src', function () {
    return tsProjectSrc.src()
        .pipe(tsProjectSrc())
        .js.pipe(gulp.dest('build'));
});

gulp.task('compile-spec', function () {
    return tsProjectSpec.src()
            .pipe(tsProjectSpec())
            .js.pipe(gulp.dest('build/spec'));
});

gulp.task('concat-spec', ['compile-src', 'compile-spec'], function() {
    return gulp
        .src(['build/lib/*.js', 'build/spec/*Spec.js'])
        .pipe(concat('spec-all.js'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('spec', ['compile-src', 'compile-spec', 'concat-spec'], function() {
    return gulp
        .src('build/spec-all.js')
        .pipe(jasmine());
});

gulp.task('release', function(callback) {
  runSequence('clean',
              ['copy-static-content', 'compile-src', 'compile-spec'],
              'concat-spec',
              'spec',
              callback);
});

gulp.task('fast-build', ['copy-static-content', 'compile-src']);

gulp.task('default', ['fast-build']);
