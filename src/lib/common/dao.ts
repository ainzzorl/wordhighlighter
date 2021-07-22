///<reference path="../../../node_modules/@types/chrome/index.d.ts" />
///<reference path="dictionaryEntry.ts" />
///<reference path="group.ts" />
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
    groups: 'groups',
    settings: 'settings',
    wordIdSequenceNumber: 'idSequenceNumber',
    groupIdSequenceNumber: 'groupIdSequenceNumber',
    highlightingLog: 'highlightingLog',
  };

  private store: chrome.storage.StorageArea;

  constructor(_store: chrome.storage.StorageArea = undefined) {
    this.store = _store || chrome.storage.local;
  }

  init() {
    this.initDictionary();
    this.initSettings();
    this.initGroups();
    this.initIdSequences();
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

  getGroups(): Promise<Array<Group>> {
    let self: DAO = this;
    return new Promise<Array<Group>>(function (resolve, _reject) {
      self.store.get(DAO.KEYS.groups, (result: { [key: string]: any }) => {
        resolve(self.deserializeGroups(result.groups));
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
    strictMatch: boolean,
    groupId: number
  ): Promise<DictionaryEntry> {
    let self: DAO = this;
    return new Promise<DictionaryEntry>((resolve, _reject) => {
      self.store.get(
        [DAO.KEYS.dictionary, DAO.KEYS.wordIdSequenceNumber],
        (result: { [key: string]: any }) => {
          let dictionary = self.deserializeDictionary(result.dictionary);
          let now: Date = new Date();
          let entry = new DictionaryEntry(
            result.idSequenceNumber,
            value,
            description,
            now,
            now,
            strictMatch,
            groupId
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

  addGroup(
    name: string,
    backgroundColor: string,
    enableSmartMatching: boolean,
    smartMatchingLanguage: string
  ): Promise<Group> {
    let self: DAO = this;
    return new Promise<Group>((resolve, _reject) => {
      self.store.get(
        [DAO.KEYS.groups, DAO.KEYS.groupIdSequenceNumber],
        (result: { [key: string]: any }) => {
          let groups = self.deserializeGroups(result.groups);
          let now: Date = new Date();
          let group = new Group(
            result.groupIdSequenceNumber,
            name,
            backgroundColor,
            enableSmartMatching,
            smartMatchingLanguage,
            now,
            now
          );
          groups.push(group);
          let newGroupIdSequenceNumber = result.groupIdSequenceNumber + 1;
          self.store.set(
            {
              groups: self.serializeGroups(groups),
              groupIdSequenceNumber: newGroupIdSequenceNumber,
            },
            () => {
              WHLogger.log(
                `Group ${name} has been added to the storage. groupIdSequenceNumber: ${newGroupIdSequenceNumber}`
              );
              resolve(self.serializeGroup(group));
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
        DAO.KEYS.wordIdSequenceNumber,
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

  saveGroups(groups: Array<Group>): Promise<void> {
    let self: DAO = this;
    return new Promise<void>((resolve, _reject) => {
      let groupsWithNoIds = groups.filter((group: Group) => {
        return !group.id;
      });
      self.store.get(
        DAO.KEYS.groupIdSequenceNumber,
        (result: { [key: string]: any }) => {
          let groupIdSequenceNumber = result.groupIdSequenceNumber;
          groupsWithNoIds.forEach((group: Group) => {
            group.id = groupIdSequenceNumber++;
          });
          self.store.set(
            {
              groupIdSequenceNumber: groupIdSequenceNumber,
              groups: self.serializeGroups(groups),
            },
            () => {
              WHLogger.log(
                `Saved groups. New group id sequence number: ${groupIdSequenceNumber}`
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

  private initGroups() {
    let self: DAO = this;
    self.store.get(
      [DAO.KEYS.groups, DAO.KEYS.settings],
      (result: { [key: string]: any }) => {
        if (!result.groups) {
          // The default group's is copied from the legacy setting, if present.
          let backgroundColor = result.settings.backgroundColor
            ? result.settings.backgroundColor
            : Settings.DEFAULT_BACKGROUND_COLOR;

          let defaultGroup = new Group(
            Group.DEFAULT_GROUP_ID,
            'Default',
            backgroundColor,
            Group.DEFAULT_ENABLE_SMART_MATCHING,
            Group.DEFAULT_SMART_MATCHING_LANGUAGE
          );
          self.store.set(
            { groups: self.serializeGroups([defaultGroup]) },
            () => {
              WHLogger.log('Initialized groups');
            }
          );
        }
      }
    );
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

  private initIdSequences() {
    let self: DAO = this;
    self.store.get(
      DAO.KEYS.wordIdSequenceNumber,
      (result: { [key: string]: any }) => {
        if (!result.idSequenceNumber) {
          self.store.set({ idSequenceNumber: 1 }, () => {
            WHLogger.log('Initialized the word id sequence');
          });
        }
      }
    );
    self.store.get(
      DAO.KEYS.groupIdSequenceNumber,
      (result: { [key: string]: any }) => {
        if (!result.groupIdSequenceNumber) {
          self.store.set({ groupIdSequenceNumber: 2 }, () => {
            WHLogger.log('Initialized the group id sequence');
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

  private deserializeGroups(input: Array<any>): Array<Group> {
    if (input === null) {
      return null;
    }
    return input.map(this.deserializeGroup);
  }

  private deserializeDictionaryEntry(input: any): DictionaryEntry {
    return new DictionaryEntry(
      input['id'],
      input['value'],
      input['description'],
      input['createdAt'],
      input['updatedAt'],
      input['strictMatch'],
      input['groupId'] || Group.DEFAULT_GROUP_ID
    );
  }

  private deserializeGroup(input: any): Group {
    return new Group(
      input['id'],
      input['name'],
      input['backgroundColor'],
      input['enableSmartMatching'] !== null &&
      input['enableSmartMatching'] !== undefined
        ? input['enableSmartMatching']
        : Group.DEFAULT_ENABLE_SMART_MATCHING,
      input['smartMatchingLanguage'] || Group.DEFAULT_SMART_MATCHING_LANGUAGE,
      input['createdAt'],
      input['updatedAt']
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
    settings.legacyBackgroundColor = input.backgroundColor;
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
      groupId: input.groupId,
    };
  }

  private serializeGroups(input: Array<Group>): Array<any> {
    if (input === null) {
      return null;
    }
    return input.map(this.serializeGroup);
  }

  private serializeGroup(input: Group): any {
    return {
      id: input.id,
      name: input.name,
      backgroundColor: input.backgroundColor,
      enableSmartMatching: input.enableSmartMatching,
      smartMatchingLanguage: input.smartMatchingLanguage,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    };
  }

  private serializeSettings(input: Settings) {
    return {
      timeout: input.timeout,
      enableHighlighting: input.enableHighlighting,
      enablePageStats: input.enablePageStats,
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
