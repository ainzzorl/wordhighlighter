///<reference path="../lib/background.ts" />
///<reference path="../lib/common/dao.ts" />

// Background script: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Background_scripts

let background: Background = new Background(new DAO());
background.start();

chrome.contextMenus.create({
    id: 'add-word',
    title: 'Add word',
    contexts: ['selection']
});

chrome.contextMenus.onClicked.addListener(function(info) {
    switch (info.menuItemId) {
        case 'add-word':
            background.addWord(info.selectionText);
            break;
    }
});
