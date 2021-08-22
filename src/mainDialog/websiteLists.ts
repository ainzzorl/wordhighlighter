// Functions to convert lists of websites to and from strings (textarea contents).

function websiteListToStrings(websites: Array<string>) {
  return websites.join('\n');
}

function stringToWebsiteList(str: string) {
  return str
    .split('\n')
    .map((w) => w.trim())
    .filter((w) => w);
}
