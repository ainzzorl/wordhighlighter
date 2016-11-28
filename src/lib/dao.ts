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

    init() {
        chrome.storage.local.get('dictionary', function(result: { dictionary: Array<DictionaryEntry> }) {
            if (!result.dictionary) {
                chrome.storage.local.set({ dictionary: [] }, function() {
                    console.log('Initialize the dictionary');
                });
            }
        });
        chrome.storage.local.get('idSequenceNumber', function(result: { idSequenceNumber: number }) {
            if (!result.idSequenceNumber) {
                chrome.storage.local.set({ idSequenceNumber: 1 }, function() {
                    console.log('Initialize the id sequence');
                });
            }
        });
    }

    addEntry(value: string, description: string, callback: () => void): void {
        chrome.storage.local.get(['dictionary', 'idSequenceNumber'],
                function(result: { dictionary: Array<DictionaryEntry>, idSequenceNumber: number }) {
            let now: Date = new Date();
            let entry: DictionaryEntry = new DictionaryEntry(
                result.idSequenceNumber, value, description, now, now
            );
            result.dictionary.push(entry);
            chrome.storage.local.set({ dictionary: result.dictionary, idSequenceNumber: result.idSequenceNumber + 1 }, function() {
                console.debug('Word ' + entry.value + ' has been added to the storages');
                callback();
            });
        });
    }

    saveDictionary(dictionary: Array<DictionaryEntry>, callback: () => void): void {
        chrome.storage.local.set({ dictionary: dictionary }, function() {
            console.debug('Saved dictionary');
            callback();
        });
    }
}