module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],
    files: [
      'node_modules/angular/angular.min.js',
      'build/lib.js',
      'build/spec/*.js'
    ]
  });
};
