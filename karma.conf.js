process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({
    preprocessors: {
      '**/*.js': ['sourcemap']
    },
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['ChromeHeadless'],
    files: [
      'node_modules/angular/angular.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/ng-table/bundles/ng-table.min.js',
      'node_modules/tinycolor2/dist/tinycolor-min.js',
      'node_modules/angularjs-color-picker/dist/angularjs-color-picker.min.js',
      'node_modules/papaparse/papaparse.min.js',

      // for fixtures
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/jasmine-jquery/lib/jasmine-jquery.js',

      'node_modules/babel-polyfill/dist/polyfill.js',

      'build/js/imports.js',
      'build/lib/**/*.js',
      'build/mainDialog/**/*.js',
      'build/test/**/*.js',

      // Fixtures
      {
        pattern: 'test/fixtures/*',
        watched:  true,
        served:   true,
        included: false
      },

      {
        pattern: 'build/maps/**/*.js.map',
        included: false
      },
    ]
  });
};
