// Used as a custom equality tester.
let equalityIgnoreWhitespaces = function (first, second) {
  if (typeof first !== 'string' || typeof second !== 'string') {
    fail('equalityIgnoreWhitespaces is only applicable to strings');
    return false;
  }
  return first.replace(/\s/g, '') === second.replace(/\s/g, '');
};
