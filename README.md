# wordhighlighter

## About
TBD

## Building the project

### Prerequisites
- Install [Node.js](https://nodejs.org/)
- Install [Gulp](http://gulpjs.com/)
- Install a browser that allows unsigned extention, for example [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/)
  - Configure it to allow unsigned extentions. In case of Firefox Developer Edition, go to about:config and set xpinstall.signatures.required=false.

### Steps
- Clone the repo.
- Run "npm install"
- Run "gulp release". It should create file ./build/word-highlighter.xpi
- Install the XPI. [Firefox](https://blog.mozilla.org/addons/2015/12/23/loading-temporary-add-ons/)
