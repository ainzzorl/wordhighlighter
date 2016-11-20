var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProjectSrc = ts.createProject('tsconfig-src.json');
var tsProjectSpec = ts.createProject('tsconfig-spec.json');
var jasmine = require('gulp-jasmine');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var zip = require('gulp-zip');
var runSequence = require('run-sequence');
var Server = require('karma').Server;

var XPI_NAME = 'word-highlighter.xpi';

gulp.task('clean', function () {
    return gulp.src('build/*', {read: false})
        .pipe(clean());
});

gulp.task('copy-html', function () {
    return gulp.src(['html/**/*'])
        .pipe(gulp.dest('build/html'));
});

gulp.task('copy-icons', function () {
    return gulp.src(['icons/**/*'])
        .pipe(gulp.dest('build/icons'));
});

gulp.task('copy-static-content', ['copy-html', 'copy-icons'], function () {
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

gulp.task('concat-lib', ['compile-src'], function() {
    return gulp
        .src(['build/lib/*.js'])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('spec', ['compile-src', 'compile-spec'], function(done) {
    return new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
        }, done).start();
});

gulp.task('zip', ['copy-static-content', 'compile-src'], function() {
  gulp.src('build/**/*')
    .pipe(zip(XPI_NAME))
    .pipe(gulp.dest('build/'));
});

gulp.task('release', function(callback) {
  runSequence('clean',
              ['copy-static-content', 'compile-src', 'compile-spec'],
              'concat-lib',
              'spec',
              'zip',
              callback);
});

gulp.task('fast-build', ['copy-static-content', 'compile-src', 'concat-lib']);

gulp.task('default', ['fast-build']);
