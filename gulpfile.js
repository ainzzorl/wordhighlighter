var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProjectSrc = ts.createProject('tsconfig-src.json');
var tsProjectTest = ts.createProject('tsconfig-test.json');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var babel = require('babelify');
var source = require('vinyl-source-stream');
var browserify = require('browserify');

function onTsCompilationError(error) {
    var log = gutil.log, colors = gutil.colors;
    log('TypeScript compilation exited with ' + colors.red(error));
    process.exit(1);
}

gulp.task('clean', gulp.series(function () {
    var clean = require('gulp-clean');
    return gulp.src('build/*', {read: false})
        .pipe(clean());
}));

gulp.task('copy-html', gulp.series(function () {
    return gulp.src(['html/**/*'])
        .pipe(gulp.dest('build/html'));
}));

gulp.task('copy-icons', gulp.series(function () {
    return gulp.src(['icons/**/*'])
        .pipe(gulp.dest('build/icons'));
}));

gulp.task('copy-fonts', gulp.series(function () {
    return gulp.src(['node_modules/bootstrap/dist/fonts/**/*', 'node_modules/font-awesome/fonts/*'])
        .pipe(gulp.dest('build/thirdparty/fonts'));
}));

gulp.task('copy-css', gulp.series(function () {
    return gulp.src(['css/**/*'])
        .pipe(gulp.dest('build/css'));
}));

gulp.task('copy-third-party-css', gulp.series(function () {
    return gulp.src(['node_modules/ng-table/bundles/ng-table.min.css', 'node_modules/bootstrap/dist/css/bootstrap.min.css', 'node_modules/font-awesome/css/font-awesome.min.css'])
        .pipe(gulp.dest('build/thirdparty/css'));
}));

gulp.task('copy-third-party-js', gulp.series(function () {
    return gulp.src(['node_modules/angular/angular.min.js',
                    'node_modules/ng-table/bundles/ng-table.min.js'])
        .pipe(gulp.dest('build/thirdparty/js'));
}));

gulp.task('copy-static-content', gulp.parallel('copy-html', 'copy-icons', 'copy-fonts', 'copy-css', 'copy-third-party-css', 'copy-third-party-js', function () {
    return gulp.src(['manifest.json'])
        .pipe(gulp.dest('build'));
}));

gulp.task('compile-src', gulp.series(function () {
    return tsProjectSrc.src()
        .pipe(tsProjectSrc())
        .on('error', onTsCompilationError)
        .js.pipe(gulp.dest('build'));
}));

gulp.task('compile-test', gulp.series(function () {
    return tsProjectTest.src()
            .pipe(tsProjectTest())
            .on('error', onTsCompilationError)
            .js.pipe(gulp.dest('build/test'));
}));

gulp.task('browserify-imports', function () {
    return browserify({
        entries: ['./src/imports/imports.js', './node_modules/natural/lib/natural/stemmers/porter_stemmer.js'],
        debug: false,
      })
    .transform(babel.configure({
        presets : ["@babel/preset-env"],
    }))
    .bundle()
      .pipe(source('imports.js'))
      .pipe(gulp.dest('./build/js/'));
  });

// Lint rules are specified in tslint.json
gulp.task('tslint', gulp.series(function() {
    var tslint = require('gulp-tslint');
    return gulp.src(['src/**/*.ts', 'test/**/*.ts'])
        .pipe(tslint({
            formatter: 'verbose'}))
        .pipe(tslint.report())
}));

gulp.task('concat-lib', gulp.series(function() {
    return gulp
        .src(['build/lib/**/*.js'])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('./build/js/'));
}));

gulp.task('concat-main-dialog', gulp.series(function() {
    return gulp
        .src(['build/mainDialog/*.js'])
        .pipe(concat('mainDialog.js'))
        .pipe(gulp.dest('./build/js/'));
}));

gulp.task('test-no-dependencies', gulp.series(function(done) {
    var Server = require('karma').Server;
    return new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
        }, done).start();
}));

gulp.task('test', gulp.series(gulp.parallel('compile-src', 'compile-test', 'browserify-imports'),
    gulp.parallel('concat-lib', 'concat-main-dialog'), 'test-no-dependencies'
));

gulp.task('clean-pre-package', gulp.series(function () {
    var clean = require('gulp-clean');
    return gulp.src(['build/test', 'build/lib', 'build/mainDialog'], {read: false})
        .pipe(clean());
}));

gulp.task('release', gulp.series('clean',
              gulp.parallel('copy-static-content', 'browserify-imports', 'tslint'),
              gulp.parallel('compile-src', 'compile-test'),
              gulp.parallel('concat-lib', 'concat-main-dialog'),
              'test-no-dependencies',
              'clean-pre-package')
);

gulp.task('fast-build', gulp.series(
    gulp.parallel('copy-static-content', 'compile-src'),
    gulp.parallel('concat-lib', 'concat-main-dialog')));

gulp.task('default', gulp.series('fast-build'));
