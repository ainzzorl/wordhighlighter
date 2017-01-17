# wordhighlighter

## About
Word Highlighter is a web extension that, given a list of words, highlights their occurences in the browser. It's written in TypeScript + AngularJS. The intended use case is helping to memorize new words.

The functionality is similar to [Vocabulary Highligher](https://addons.mozilla.org/en-US/firefox/addon/vocabulary-highlighter/), but:
- Doesn't crash the browser that often.
- Word matching is more intelligent.

## Building the project

### Prerequisites
- Install [Node.js](https://nodejs.org/)
- Install [Gulp](http://gulpjs.com/)
  - "npm install --global gulp"
- Install [web-ext](https://github.com/mozilla/web-ext)
  - "npm install --global web-ext"
- Install a browser that allows unsigned extention, for example [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/)
  - Configure it to allow unsigned extentions. In case of Firefox Developer Edition, go to about:config and set xpinstall.signatures.required=false.

### Steps
- Clone the repo.
- Run "npm install"
- Run "gulp release". It should generate build artifacts in ./build/
- Run "web-ext run --f PATH-TO-BROWSER-EXECUTABLE -s build" to start the browser with the add-on installed.
