///<reference path="../lib/background.ts" />
///<reference path="../lib/dao.ts" />

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