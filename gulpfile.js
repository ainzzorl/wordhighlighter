var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProjectSrc = ts.createProject('tsconfig-src.json');
var tsProjectSpec = ts.createProject('tsconfig-spec.json');
var jasmine = require('gulp-jasmine');

gulp.task('copy-static-content', function () {
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

gulp.task('spec', ['compile-src', 'compile-spec'], function() {
    return gulp.src('build/spec/*Spec.js').pipe(jasmine());
});


gulp.task('default', ['copy-static-content', 'compile-src', 'compile-spec', 'spec']);
