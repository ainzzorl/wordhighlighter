# wordhighlighter

## About
TBD

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
