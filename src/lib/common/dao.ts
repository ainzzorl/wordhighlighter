///<reference path="../../../node_modules/@types/chrome/index.d.ts" />
///<reference path="dictionaryEntry.ts" />
///<reference path="logger.ts" />
///<reference path="settings.ts" />
///<reference path="../highlightingLog/highlightingLog.ts" />
///<reference path="../highlightingLog/highlightingLogEntry.ts" />

/**
 * Data Access Object.
 * Handles all interactions with the storage.
 */
class DAO {
  private static readonly KEYS = {
    dictionary: 'dictionary',
    settings: 'settings',
    idSequenceNumber: 'idSequenceNumber',
    highlightingLog: 'highlightingLog',
  };

  private store: chrome.storage.StorageArea;

  constructor(_store: chrome.storage.StorageArea = undefined) {
    this.store = _store || chrome.storage.local;
  }

  init() {
    this.initDictionary();
    this.initIdSequence();
    this.initSettings();
    this.initHighlightingLog();
  }

  getDictionary(): Promise<Array<DictionaryEntry>> {
    let self: DAO = this;
    return new Promise<Array<DictionaryEntry>>(function (resolve, _reject) {
      self.store.get(DAO.KEYS.dictionary, (result: { [key: string]: any }) => {
        resolve(self.deserializeDictionary(result.dictionary));
      });
    });
  }

  getSettings(): Promise<Settings> {
    let self: DAO = this;
    return new Promise<Settings>((resolve, _reject) => {
      self.store.get(DAO.KEYS.settings, (result: { [key: string]: any }) => {
        resolve(self.deserializeSettings(result.settings));
      });
    });
  }

  getHighlightingLog(): Promise<HighlightingLog> {
    let self: DAO = this;
    return new Promise<HighlightingLog>((resolve, _reject) => {
      self.store.get(
        DAO.KEYS.highlightingLog,
        (result: { [key: string]: any }) => {
          resolve(self.deserializeHighlightingLog(result.highlightingLog));
        }
      );
    });
  }

  addEntry(
    value: string,
    description: string,
    strictMatch: boolean
  ): Promise<DictionaryEntry> {
    let self: DAO = this;
    return new Promise<DictionaryEntry>((resolve, _reject) => {
      self.store.get(
        [DAO.KEYS.dictionary, DAO.KEYS.idSequenceNumber],
        (result: { [key: string]: any }) => {
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
          self.store.set(
            {
              dictionary: self.serializeDictionary(dictionary),
              idSequenceNumber: result.idSequenceNumber + 1,
            },
            () => {
              WHLogger.log(
                'Word ' + entry.value + ' has been added to the storages'
              );
              resolve(self.serializeDictionaryEntry(entry));
            }
          );
        }
      );
    });
  }

  saveDictionary(dictionary: Array<DictionaryEntry>): Promise<void> {
    let self: DAO = this;
    return new Promise<void>((resolve, _reject) => {
      let entriesWithNoIds = dictionary.filter(
        (dictionaryEntry: DictionaryEntry) => {
          return !dictionaryEntry.id;
        }
      );
      if (entriesWithNoIds.length === 0) {
        self.store.set(
          { dictionary: self.serializeDictionary(dictionary) },
          () => {
            WHLogger.log('Saved dictionary');
            resolve();
          }
        );
        return;
      }
      self.store.get(
        DAO.KEYS.idSequenceNumber,
        (result: { [key: string]: any }) => {
          let idSequenceNumber = result.idSequenceNumber;
          entriesWithNoIds.forEach((dictionaryEntry: DictionaryEntry) => {
            dictionaryEntry.id = idSequenceNumber++;
          });
          self.store.set(
            {
              idSequenceNumber: idSequenceNumber,
              dictionary: self.serializeDictionary(dictionary),
            },
            () => {
              WHLogger.log(
                'Saved the dictionary. New id sequence number: ' +
                  idSequenceNumber
              );
              resolve();
            }
          );
        }
      );
    });
  }

  saveSettings(settings: Settings): Promise<void> {
    return new Promise((resolve, _reject) => {
      this.store.set({ settings: this.serializeSettings(settings) }, () => {
        WHLogger.log('Saved the settings');
        resolve();
      });
    });
  }

  saveHighlightingLog(highlightingLog: HighlightingLog): Promise<void> {
    return new Promise((resolve) => {
      this.store.set(
        { highlightingLog: this.serializeHighlightingLog(highlightingLog) },
        () => {
          WHLogger.log('Saved the highlighting log');
          resolve();
        }
      );
    });
  }

  private initDictionary() {
    let self: DAO = this;
    self.store.get(DAO.KEYS.dictionary, (result: { [key: string]: any }) => {
      if (!result.dictionary) {
        self.store.set({ dictionary: [] }, () => {
          WHLogger.log('Initialized the dictionary');
        });
      }
    });
  }

  private initSettings() {
    let self: DAO = this;
    self.store.get(DAO.KEYS.settings, (result: { [key: string]: any }) => {
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
    self.store.get(
      DAO.KEYS.idSequenceNumber,
      (result: { [key: string]: any }) => {
        if (!result.idSequenceNumber) {
          self.store.set({ idSequenceNumber: 1 }, () => {
            WHLogger.log('Initialized the id sequence');
          });
        }
      }
    );
  }

  private initHighlightingLog() {
    let self: DAO = this;
    self.store.get(
      DAO.KEYS.highlightingLog,
      (result: { [key: string]: any }) => {
        if (!result.highlightingLog) {
          self.store.set(
            {
              highlightingLog: self.serializeHighlightingLog(
                new HighlightingLog()
              ),
            },
            () => {
              WHLogger.log('Initialized the highlighting log');
            }
          );
        }
      }
    );
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

  private deserializeHighlightingLog(input: Array<any>): HighlightingLog {
    return new HighlightingLog(input.map(this.deserializeHighlightingLogEntry));
  }

  private deserializeHighlightingLogEntry(input: any): HighlightingLogEntry {
    return new HighlightingLogEntry(
      input['url'],
      new Date(input['date']),
      input['highlights'].reduce((result: any, h: any) => {
        result[h[0]] = h[1];
        return result;
      }, {})
    );
  }

  private deserializeSettings(input: any): Settings {
    let settings: Settings = new Settings();
    settings.timeout = input.timeout;
    settings.enableHighlighting = input.enableHighlighting;
    if (input.enablePageStats === undefined) {
      // Was created before stats was implemented.
      input.enablePageStats = Settings.DEFAULT_ENABLE_PAGE_STATS;
    }
    settings.enablePageStats = input.enablePageStats;
    if (input.backgroundColor === undefined) {
      // Was created before background color was implemented.
      input.backgroundColor = Settings.DEFAULT_BACKGROUND_COLOR;
    }
    settings.backgroundColor = input.backgroundColor;
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
      strictMatch: input.strictMatch,
    };
  }

  private serializeSettings(input: Settings) {
    return {
      timeout: input.timeout,
      enableHighlighting: input.enableHighlighting,
      enablePageStats: input.enablePageStats,
      backgroundColor: input.backgroundColor,
    };
  }

  private serializeHighlightingLog(input: HighlightingLog): Array<any> {
    return input.entries.map(this.serializeHighlightingLogEntry);
  }

  private serializeHighlightingLogEntry(input: HighlightingLogEntry): any {
    return {
      url: input.url,
      date: input.date.getTime(),
      highlights: Object.keys(input.highlights).map((k: any) => {
        return [k, input.highlights[k]];
      }),
    };
  }
}
