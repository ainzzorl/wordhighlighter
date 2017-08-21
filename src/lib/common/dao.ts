///<reference path="../../../node_modules/@types/chrome/index.d.ts" />
///<reference path="dictionaryEntry.ts" />
///<reference path="logger.ts" />
///<reference path="settings.ts" />

/**
 * Data Access Object.
 * Handles all interactions with the storage.
 *
 * TODO: consider using sync storage.
 */
class DAO {
    private static readonly KEYS = {
        dictionary: 'dictionary',
        settings: 'settings',
        idSequenceNumber: 'idSequenceNumber'
    };

    private store: chrome.storage.StorageArea;

    constructor(_store: chrome.storage.StorageArea = undefined) {
        this.store = _store || chrome.storage.local;
    }

    init() {
        this.initDictionary();
        this.initIdSequence();
        this.initSettings();
    }

    getDictionary(callback: (dictionary: Array<DictionaryEntry>) => void): void {
        let self: DAO = this;
        self.store.get(DAO.KEYS.dictionary, (result: { dictionary: Array<any> }) => {
            callback(self.deserializeDictionary(result.dictionary));
        });
    }

    getSettings(callback: (settings: Settings) => void): void {
        let self: DAO = this;
        self.store.get(DAO.KEYS.settings, (result: { settings: any }) => {
            callback(self.deserializeSettings(result.settings));
        });
    }

    addEntry(value: string, description: string, strictMatch: boolean, callback: (newEntry: DictionaryEntry) => void): void {
        let self: DAO = this;
        self.store.get([DAO.KEYS.dictionary, DAO.KEYS.idSequenceNumber],
                       (result: { dictionary: Array<any>, idSequenceNumber: number }) => {
            let dictionary = self.deserializeDictionary(result.dictionary);
            let now: Date = new Date();
            let entry = new DictionaryEntry(
                result.idSequenceNumber,
                value,
                description,
                now,
                now,
                strictMatch
            );
            dictionary.push(entry);
            self.store.set({ dictionary: self.serializeDictionary(dictionary), idSequenceNumber: result.idSequenceNumber + 1 }, () => {
                WHLogger.log('Word ' + entry.value + ' has been added to the storages');
                callback(self.serializeDictionaryEntry(entry));
            });
        });
    }

    saveDictionary(dictionary: Array<DictionaryEntry>, callback: () => void): void {
        let self: DAO = this;
        let entriesWithNoIds = dictionary.filter((dictionaryEntry: DictionaryEntry) => {
            return !dictionaryEntry.id;
        });
        if (entriesWithNoIds.length === 0) {
            self.store.set({ dictionary: self.serializeDictionary(dictionary) }, () => {
                WHLogger.log('Saved dictionary');
                callback();
            });
            return;
        }
        self.store.get(DAO.KEYS.idSequenceNumber, (result: { idSequenceNumber: number }) => {
            let idSequenceNumber = result.idSequenceNumber;
            entriesWithNoIds.forEach((dictionaryEntry: DictionaryEntry) => {
                dictionaryEntry.id = idSequenceNumber++;
            });
            self.store.set({ idSequenceNumber: idSequenceNumber, dictionary: self.serializeDictionary(dictionary) }, () => {
                WHLogger.log('Saved the dictionary. New id sequence number: ' + idSequenceNumber);
                callback();
            });
        });
    }

    saveSettings(settings: Settings, callback: () => void): void {
        this.store.set({ settings: this.serializeSettings(settings) }, () => {
            WHLogger.log('Saved the settings');
            callback();
        });
    }

    private initDictionary() {
        let self: DAO = this;
        self.store.get(DAO.KEYS.dictionary, (result: { dictionary: Array<any> }) => {
            if (!result.dictionary) {
                self.store.set({ dictionary: [] }, () => {
                    WHLogger.log('Initialized the dictionary');
                });
            }
        });
    }

    private initSettings() {
        let self: DAO = this;
        self.store.get(DAO.KEYS.settings, (result: { settings: Settings }) => {
            if (!result.settings) {
                let settings = Settings.DEFAULT;
                self.store.set({ settings: self.serializeSettings(settings) }, () => {
                    WHLogger.log('Initialized the settings');
                });
            }
        });
    }

    private initIdSequence() {
        let self: DAO = this;
        self.store.get(DAO.KEYS.idSequenceNumber, (result: { idSequenceNumber: number }) => {
            if (!result.idSequenceNumber) {
                self.store.set({ idSequenceNumber: 1 }, () => {
                    WHLogger.log('Initialized the id sequence');
                });
            }
        });
    }

    private deserializeDictionary(input: Array<any>): Array<DictionaryEntry> {
        if (input === null) {
            return null;
        }
        return input.map(this.deserializeDictionaryEntry);
    }

    private deserializeDictionaryEntry(input: any): DictionaryEntry {
        return new DictionaryEntry(
            input['id'],
            input['value'],
            input['description'],
            input['createdAt'],
            input['updatedAt'],
            input['strictMatch']
        );
    }

    private deserializeSettings(input: any): Settings {
        let settings: Settings = new Settings();
        settings.timeout = input.timeout;
        settings.enableHighlighting  = input.enableHighlighting;
        if (input.enablePageStats === undefined) {
            // Was created before stats was implemented.
            input.enablePageStats = Settings.DEFAULT_ENABLE_PAGE_STATS;
        }
        settings.enablePageStats = input.enablePageStats;
        return settings;
    }

    private serializeDictionary(input: Array<DictionaryEntry>): Array<any> {
        if (input === null) {
            return null;
        }
        return input.map(this.serializeDictionaryEntry);
    }

    private serializeDictionaryEntry(input: DictionaryEntry): any {
        return {
            id: input.id,
            value: input.value,
            description: input.description,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
            strictMatch: input.strictMatch
        };
    }

    private serializeSettings(input: Settings) {
        return {
            timeout: input.timeout,
            enableHighlighting: input.enableHighlighting,
            enablePageStats: input.enablePageStats
        };
    }
}
