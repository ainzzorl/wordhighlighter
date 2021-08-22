# Word Highlighter

## About
Word Highlighter is a web extension (add-on) that, given a list of words, highlights their occurences on every page. It's written in TypeScript + AngularJS.

The primary use case is memorizing new words and expanding your vocabulary:
- Learn a new word.
- Add it to the dictionary.
- See it highlighted when you encounter it.
- See what words in your dictionary you encounter most often.

Word Highlighter is smart about how it matches words on the page with words in the dictionary. It understands that "cherry" and "cherries", "aprender Español" and "aprendemos Español" are the same.

## Install
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/wordhighlighter/)
- [Chrome](https://chrome.google.com/webstore/detail/word-highlighter/flpifgahbaopfmnlmcgkkodanhoifdpa)

## Building the project

### Prerequisites
- Install [Node.js](https://nodejs.org/)
- Install [Gulp](http://gulpjs.com/)
  - `npm install --global gulp`
- Install [web-ext](https://github.com/mozilla/web-ext)
  - `npm install --global web-ext`
- Install a browser that allows unsigned extention, for example [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/).

### Steps
- Clone the repo.
- Run `npm install`
- Run `gulp release`. It should generate build artifacts under `./build/`.
- Run `web-ext run -s build --firefox=PATH-TO-BROWSER-EXECUTABLE` (e.g. `web-ext run -s build --firefox=/Applications/Firefox\ Developer\ Edition.app/Contents/MacOS/firefox-bin`) to start the browser with the add-on installed.

## Release process

- Increment version in `manifest.json`.
- Tag the commit: `git tag vX.Y.Z`.
- `gulp release`
- Firefox: `web-ext sign -s build/ --api-key API-KEY --api-secret API-SECRET`
- Chrome: generate zip file (`(cd build && zip -r ../local/chrome-release.zip *)`), upload to Chrome Web Store.