///<reference path="../lib/background.ts" />
///<reference path="../lib/common/dao.ts" />

// Background script: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Background_scripts

let background: Background = new Background(new DAO());
background.start();

background
  .getMenuItems()
  .then((menuItems: Array<chrome.contextMenus.CreateProperties>) => {
    menuItems.forEach((menuItem) => {
      chrome.contextMenus.create(menuItem);
    });
  });
