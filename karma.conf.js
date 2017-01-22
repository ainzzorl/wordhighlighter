module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],
    files: [
      'node_modules/angular/angular.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/ng-table/bundles/ng-table.min.js', // TODO: mock it instead
      'build/js/lib.js',
      'build/js/mainDialog.js',
      'build/spec/*.js'
    ]
  });
};
