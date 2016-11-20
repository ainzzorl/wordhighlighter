module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],
    files: [
      'build/lib.js',
      'build/spec/*.js'
    ]
  });
};
