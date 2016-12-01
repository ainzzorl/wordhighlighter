var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProjectSrc = ts.createProject('tsconfig-src.json');
var tsProjectSpec = ts.createProject('tsconfig-spec.json');
var jasmine = require('gulp-jasmine');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var browserify = require('gulp-browserify');
var tslint = require('gulp-tslint');
var Server = require('karma').Server;

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

gulp.task('copy-fonts', function () {
    return gulp.src(['node_modules/bootstrap/dist/fonts/**/*'])
        .pipe(gulp.dest('build/fonts'));
});

gulp.task('copy-css', function () {
    return gulp.src(['css/**/*'])
        .pipe(gulp.dest('build/css'));
});

gulp.task('copy-static-content', ['copy-html', 'copy-icons', 'copy-fonts', 'copy-css'], function () {
    return gulp.src(['manifest.json', 'node_modules/angular/angular.min.js',
                    'node_modules/ng-table/bundles/ng-table.min.js', 'node_modules/ng-table/bundles/ng-table.min.css',
                    'node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/bootstrap/dist/css/bootstrap.min.css'])
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

gulp.task('browserify-imports', [], function() {
    gulp.src('src/imports/imports.js')
        .pipe(browserify({
            insertGlobals : true
        }))
        .pipe(gulp.dest('./build'))
});

gulp.task('tslint', function() {
    return gulp.src(['src/**/*.ts', 'spec/**/*.ts'])
        .pipe(tslint({
            formatter: 'verbose',
            configuration: {
                'rules': {
                    'class-name': true,
                    'comment-format': [true, 'check-space'],
                    'indent': [true, 'spaces'],
                    'no-duplicate-variable': true,
                    'no-eval': true,
                    'no-internal-module': true,
                    'no-trailing-whitespace': true,
                    'no-var-keyword': true,
                    'one-line': [true, 'check-open-brace', 'check-whitespace'],
                    'quotemark': [true, 'single'],
                    'semicolon': true,
                    'triple-equals': [true, 'allow-null-check'],
                    'typedef-whitespace': [true, {
                        'call-signature': 'nospace',
                        'index-signature': 'nospace',
                        'parameter': 'nospace',
                        'property-declaration': 'nospace',
                        'variable-declaration': 'nospace'
                    }],
                    'variable-name': [true, 'ban-keywords'],
                    'whitespace': [true,
                        'check-branch',
                        'check-decl',
                        'check-operator',
                        'check-separator',
                        'check-type'
                    ]
                }
            }
        }))
        .pipe(tslint.report())
});

gulp.task('concat-lib', ['compile-src'], function() {
    return gulp
        .src(['build/lib/*.js'])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('concat-main-dialog', ['compile-src'], function() {
    return gulp
        .src(['build/mainDialog/*.js'])
        .pipe(concat('mainDialog.js'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('spec', ['compile-src', 'compile-spec', 'concat-lib', 'concat-main-dialog'], function(done) {
    return new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
        }, done).start();
});

gulp.task('release', function(callback) {
  runSequence('clean',
              ['copy-static-content', 'compile-src', 'compile-spec', 'browserify-imports', 'tslint'],
              ['concat-lib', 'concat-main-dialog'],
              'spec',
              callback);
});

gulp.task('fast-build', ['copy-static-content', 'compile-src', 'concat-lib', 'concat-main-dialog']);

gulp.task('default', ['fast-build']);
