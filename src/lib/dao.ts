///<reference path="../../node_modules/@types/chrome/index.d.ts" />
///<reference path="dictionaryEntry.ts" />
///<reference path="settings.ts" />

// TODO: use synced storage
// TODO: unit test
class DAO {

    getDictionary(callback: (dictionary: Array<DictionaryEntry>) => void): void {
        let self: DAO = this;
        chrome.storage.local.get('dictionary', function(result: { dictionary: Array<DictionaryEntry> }) {
            callback(self.deserializeDictionary(result.dictionary));
        });
    }

    getSettings(callback: (settings: Settings) => void): void {
        chrome.storage.local.get('settings', function(result: { settings: Settings }) {
            callback(result.settings);
        });
    }

    init() {
        chrome.storage.local.get('dictionary', function(result: { dictionary: Array<DictionaryEntry> }) {
            if (!result.dictionary) {
                chrome.storage.local.set({ dictionary: [] }, function() {
                    console.log('Initialized the dictionary');
                });
            }
        });
        chrome.storage.local.get('idSequenceNumber', function(result: { idSequenceNumber: number }) {
            if (!result.idSequenceNumber) {
                chrome.storage.local.set({ idSequenceNumber: 1 }, function() {
                    console.log('Initialized the id sequence');
                });
            }
        });
        chrome.storage.local.get('settings', function(result: { settings: Settings }) {
            if (!result.settings) {
                let settings = new Settings();
                settings.enableHighlighting = true;
                settings.timeout = 3;
                chrome.storage.local.set({ settings: settings }, function() {
                    console.log('Initialized the settings');
                });
            }
        });
    }

    addEntry(value: string, description: string, strictMatch: boolean, callback: (newEntry: DictionaryEntry) => void): void {
        let self: DAO = this;
        chrome.storage.local.get(['dictionary', 'idSequenceNumber'],
                function(result: { dictionary: Array<any>, idSequenceNumber: number }) {
            let now: Date = new Date();
            let entry = {
                id: result.idSequenceNumber,
                value: value,
                description: description,
                strictMatch: strictMatch,
                createdAt: now,
                updatedAt: now
            };
            result.dictionary.push(entry);
            chrome.storage.local.set({ dictionary: result.dictionary, idSequenceNumber: result.idSequenceNumber + 1 }, function() {
                console.debug('Word ' + entry.value + ' has been added to the storages');
                callback(self.serializeDictionaryEntry(entry));
            });
        });
    }

    saveDictionary(dictionary: Array<DictionaryEntry>, callback: () => void): void {
        let self: DAO = this;
        let needsToGenerateIds = dictionary.filter(function(dictionaryEntry: DictionaryEntry) {
            return !dictionaryEntry.id;
        });
        if (needsToGenerateIds.length === 0) {
            chrome.storage.local.set({ dictionary: self.serializeDictionary(dictionary) }, function() {
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
            chrome.storage.local.set({ idSequenceNumber: idSequenceNumber, dictionary: self.serializeDictionary(dictionary) }, function() {
                console.log('Saved the dictionary. New id sequence number: ' + idSequenceNumber);
                callback();
            });
        });
    }

    saveSettings(settings: Settings, callback: () => void): void {
        chrome.storage.local.set({ settings: settings }, function() {
            console.log('Saved the settings');
            callback();
        });
    }

    deserializeDictionary(input: Array<any>): Array<DictionaryEntry> {
        if (input === null) {
            return null;
        }
        return input.map(this.deserializeDictionaryEntry);
    }

    deserializeDictionaryEntry(input: any): DictionaryEntry {
        return new DictionaryEntry(
            input['id'],
            input['value'],
            input['description'],
            input['createdAt'],
            input['updatedAt'],
            input['strictMatch']
        );
    }

    serializeDictionary(input: Array<DictionaryEntry>): Array<any> {
        if (input === null) {
            return null;
        }
        return input.map(this.serializeDictionaryEntry);
    }

    serializeDictionaryEntry(input: DictionaryEntry): any {
        return {
            id: input.id,
            value: input.value,
            description: input.description,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
            strictMatch: input.strictMatch
        };
    }
}