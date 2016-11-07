var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

gulp.task('copy-static-content', function () {
    return gulp.src(['manifest.json', 'wordhighlighter.css'])
        .pipe(gulp.dest('build'));
});

gulp.task('compile', function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('build'));
});

gulp.task('default', ['copy-static-content', 'compile']);
