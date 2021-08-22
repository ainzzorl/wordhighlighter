// A website is blocked if there's something blocking it and nothing allowing it.
function isBlocked(
  url: string,
  blockedWebsites: Array<string>,
  allowedWebsites: Array<string>
) {
  function matches(value: string, regexpStr: string) {
    // To support patterns like *.wikipedia.org,
    // which are not valid regexps,
    // we just ignore leading stars.
    while (regexpStr.startsWith('*')) {
      regexpStr = regexpStr.substring(1);
    }
    try {
      return new RegExp(regexpStr).test(value);
    } catch (error) {
      WHLogger.log(`Error testing with regex=${regexpStr}, error=${error}`);
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
