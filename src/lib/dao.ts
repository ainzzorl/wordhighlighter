///<reference path="../../node_modules/@types/chrome/index.d.ts" />
///<reference path="dictionaryEntry.ts" />

// TODO: use synced storage
class DAO {
    getDictionary(callback: (dictionary: Array<DictionaryEntry>) => void): void {
        chrome.storage.local.get('dictionary', function(result: { dictionary: Array<DictionaryEntry> }) {
            let dictionary: Array<DictionaryEntry> = result.dictionary;
            callback(result.dictionary);
        });
    }

    // TODO: don't overwrite existing
    init() {
        var dictionary = new Array<DictionaryEntry>();
        dictionary.push(new DictionaryEntry('people'));
        dictionary.push(new DictionaryEntry('profit'));
        chrome.storage.local.set({ dictionary: dictionary }, function() {
            console.debug('Initialized the store');
        });
    }

    addEntry(entry: DictionaryEntry, callback: () => void): void {
        this.getDictionary(function(dictionary) {
            dictionary.push(entry);
            chrome.storage.local.set({ dictionary: dictionary }, function() {
                console.debug('Word ' + entry.value + ' has been added to the storages');
            });
        });
    }

    saveDictionary(dictionary: Array<DictionaryEntry>, callback: () => void): void {
        chrome.storage.local.set({ dictionary: dictionary }, function() {
            console.debug('Saved dictionary');
        });
    }
}