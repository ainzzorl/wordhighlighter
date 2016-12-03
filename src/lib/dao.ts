///<reference path="../../node_modules/@types/chrome/index.d.ts" />
///<reference path="dictionaryEntry.ts" />

// TODO: use synced storage
// TODO: unit test
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

    addEntry(value: string, description: string, callback: (newEntry: DictionaryEntry) => void): void {
        chrome.storage.local.get(['dictionary', 'idSequenceNumber'],
                function(result: { dictionary: Array<DictionaryEntry>, idSequenceNumber: number }) {
            let now: Date = new Date();
            let entry: DictionaryEntry = new DictionaryEntry(
                result.idSequenceNumber, value, description, now, now
            );
            result.dictionary.push(entry);
            chrome.storage.local.set({ dictionary: result.dictionary, idSequenceNumber: result.idSequenceNumber + 1 }, function() {
                console.debug('Word ' + entry.value + ' has been added to the storages');
                callback(entry);
            });
        });
    }

    saveDictionary(dictionary: Array<DictionaryEntry>, callback: () => void): void {
        let needsToGenerateIds = dictionary.filter(function(dictionaryEntry: DictionaryEntry) {
            return !dictionaryEntry.id;
        });
        if (needsToGenerateIds.length === 0) {
            chrome.storage.local.set({ dictionary: dictionary }, function() {
                console.debug('Saved dictionary');
                callback();
            });
            return;
        }
        chrome.storage.local.get('idSequenceNumber', function(result: { idSequenceNumber: number }) {
            let idSequenceNumber = result.idSequenceNumber;
            needsToGenerateIds.forEach(function(dictionaryEntry: DictionaryEntry) {
                dictionaryEntry.id = idSequenceNumber++;
            });
            chrome.storage.local.set({ idSequenceNumber: idSequenceNumber, dictionary: dictionary }, function() {
                console.log('Saved the dictionary. New id sequence number: ' + idSequenceNumber);
            });
        });
    }
}