///<reference path="logger.ts" />

// A website is blocked if there's something blocking it and nothing allowing it.
function isBlocked(
  url: string,
  blockedWebsites: Array<string>,
  allowedWebsites: Array<string>
) {
  function matches(value: string, pattern: string) {
    // Only support * (any number of characters) and ? (exactly one character) wildcards.
    // Partially borrowed from https://stackoverflow.com/a/32402438

    let processedPattern = pattern;
    // Escape everything except * and ?.
    processedPattern = processedPattern.replace(
      /([.+^=!:${}()|[\]/\\])/g,
      '\\$1'
    );

    // In "real" regexps, * and ? modify the previous symbol.
    // To treat them as wildcards, we prefix them with dots.
    processedPattern = processedPattern.replace(/\*/g, '.*');
    processedPattern = processedPattern.replace(/\?/g, '.?');

    try {
      return new RegExp(processedPattern).test(value);
    } catch (error) {
      // This should never happen unless there are bugs in the code above.
      WHLogger.log(
        `Error testing with pattern=${pattern}, processed=${processedPattern}, error=${error}`
      );
      return false;
    }
  }

  let somethingBlocks = blockedWebsites.some((b) => matches(url, b));
  if (!somethingBlocks) {
    return false;
  }
  let somethingAllows = allowedWebsites.some((a) => matches(url, a));
  return !somethingAllows;
}
