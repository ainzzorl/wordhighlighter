///<reference path="../../node_modules/@types/chrome/index.d.ts" />

// TODO: use synced storage
class DAO {
    getWords(callback: (words: Array<string>) => void): void {
        chrome.storage.local.get('words', function(result: { words: Array<string> }) {
            let words: Array<string> = result.words;
            callback(result.words);
        });
    }

    // TODO: don't overwrite existing
    init() {
        var words = ['people', 'profit'];
        chrome.storage.local.set({ words: words }, function() {
            console.debug('Initialized the store');
        });
    }

    addWord(word: string, callback: () => void): void {
        this.getWords(function(words) {
            words.push(word);
            chrome.storage.local.set({ words: words }, function() {
                console.debug('Word ' + word + ' has been added to the storages');
            });
        });
    }
}