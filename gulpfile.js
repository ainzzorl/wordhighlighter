var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProjectSrc = ts.createProject('tsconfig-src.json');
var tsProjectSpec = ts.createProject('tsconfig-spec.json');
var concat = require('gulp-concat');
var gutil = require('gulp-util');

function onTsCompilationError(error) {
    var log = gutil.log, colors = gutil.colors;
    log('TypeScript compilation exited with ' + colors.red(error));
    process.exit(1);
}

gulp.task('clean', function () {
    var clean = require('gulp-clean');
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

gulp.task('copy-fonts', function () {
    return gulp.src(['node_modules/bootstrap/dist/fonts/**/*', 'node_modules/font-awesome/fonts/*'])
        .pipe(gulp.dest('build/thirdparty/fonts'));
});

gulp.task('copy-css', function () {
    return gulp.src(['css/**/*'])
        .pipe(gulp.dest('build/css'));
});

gulp.task('copy-third-party-css', function () {
    return gulp.src(['node_modules/ng-table/bundles/ng-table.min.css', 'node_modules/bootstrap/dist/css/bootstrap.min.css', 'node_modules/font-awesome/css/font-awesome.min.css'])
        .pipe(gulp.dest('build/thirdparty/css'));
});

gulp.task('copy-third-party-js', function () {
    return gulp.src(['node_modules/angular/angular.min.js',
                    'node_modules/ng-table/bundles/ng-table.min.js'])
        .pipe(gulp.dest('build/thirdparty/js'));
});

gulp.task('copy-static-content', ['copy-html', 'copy-icons', 'copy-fonts', 'copy-css', 'copy-third-party-css', 'copy-third-party-js'], function () {
    return gulp.src(['manifest.json'])
        .pipe(gulp.dest('build'));
});

gulp.task('compile-src', function () {
    return tsProjectSrc.src()
        .pipe(tsProjectSrc())
        .on('error', onTsCompilationError)
        .js.pipe(gulp.dest('build'));
});

gulp.task('compile-spec', function () {
    return tsProjectSpec.src()
            .pipe(tsProjectSpec())
            .on('error', onTsCompilationError)
            .js.pipe(gulp.dest('build/spec'));
});

gulp.task('browserify-imports', [], function() {
    var browserify = require('gulp-browserify');
    gulp.src('src/imports/imports.js')
        .pipe(browserify({
            insertGlobals : true
        }))
        .pipe(gulp.dest('./build/js/'))
});

// Lint rules are specified in tslint.json
gulp.task('tslint', function() {
    var tslint = require('gulp-tslint');
    return gulp.src(['src/**/*.ts', 'spec/**/*.ts'])
        .pipe(tslint({
            formatter: 'verbose'}))
        .pipe(tslint.report())
});

gulp.task('concat-lib', ['compile-src'], function() {
    return gulp
        .src(['build/lib/**/*.js'])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('./build/js/'));
});

gulp.task('concat-main-dialog', ['compile-src'], function() {
    return gulp
        .src(['build/mainDialog/*.js'])
        .pipe(concat('mainDialog.js'))
        .pipe(gulp.dest('./build/js/'));
});

gulp.task('spec', ['compile-src', 'compile-spec', 'concat-lib', 'concat-main-dialog', 'browserify-imports'], function(done) {
    var Server = require('karma').Server;
    return new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
        }, done).start();
});

gulp.task('clean-pre-package', function () {
    var clean = require('gulp-clean');
    return gulp.src(['build/spec', 'build/lib', 'build/mainDialog'], {read: false})
        .pipe(clean());
});

// TODO: optimize: some tasks are called twice
gulp.task('release', function(callback) {
    var runSequence = require('run-sequence');
    runSequence('clean',
              ['copy-static-content', 'compile-src', 'compile-spec', 'browserify-imports', 'tslint'],
              ['concat-lib', 'concat-main-dialog'],
              'spec',
              'clean-pre-package',
              callback);
});

gulp.task('fast-build', ['copy-static-content', 'compile-src', 'concat-lib', 'concat-main-dialog']);

gulp.task('default', ['fast-build']);
