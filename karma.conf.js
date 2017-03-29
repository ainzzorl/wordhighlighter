module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],
    files: [
      'node_modules/angular/angular.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/ng-table/bundles/ng-table.min.js', // TODO: mock it instead

      // for fixtures
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/jasmine-jquery/lib/jasmine-jquery.js',

      'build/js/imports.js',
      'build/js/lib.js',
      'build/js/mainDialog.js',
      'build/spec/**/*.js',

      // Fixtures
      {
        pattern: 'spec/fixtures/*',
        watched:  true,
        served:   true,
        included: false
      }
    ]
  });
};
