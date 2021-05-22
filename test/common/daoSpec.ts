///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../src/lib/common/dao.ts" />

describe('DAO', () => {
  let dao: DAO;
  let store: any = {};

  beforeEach(() => {
    dao = new DAO(<chrome.storage.StorageArea>store);
    stubStore();
  });

  describe('dictionary', () => {
    it('creates, reads and updates the dictionary', async () => {
      dao.init();
      await dao.addEntry('value1', 'description1', true);
      let dictionary = await dao.getDictionary();
      expect(dictionary.length).toEqual(1);
      expect(dictionary[0].value).toEqual('value1');
      expect(dictionary[0].description).toEqual('description1');
      expect(dictionary[0].strictMatch).toEqual(true);
      expect(dictionary[0].createdAt).not.toBeNull();
      expect(dictionary[0].updatedAt).not.toBeNull();
      expect(dictionary[0].id).not.toBeNull();
      dictionary.push(new DictionaryEntry(null, 'value2', 'description2'));
      await dao.saveDictionary(dictionary);
      dictionary = await dao.getDictionary();
      expect(dictionary.length).toEqual(2);
      expect(dictionary[1].value).toEqual('value2');
      expect(dictionary[1].description).toEqual('description2');
      expect(dictionary[1].strictMatch).toEqual(false);
      expect(dictionary[1].id).not.toBeNull();
    });
  });

  describe('settings', () => {
    it('creates, reads and updates settings', async () => {
      dao.init();
      await dao.getSettings().then((settings: Settings) => {
        expect(settings).not.toBeNull();
        expect(settings).toEqual(Settings.DEFAULT);
      });
      let settings: Settings = new Settings();
      settings.enableHighlighting = false;
      settings.enablePageStats = false;
      settings.timeout = 123;
      settings.backgroundColor = 'ff00ff';
      await dao.saveSettings(settings);
      await dao.getSettings().then((receivedSettings: Settings) => {
        expect(receivedSettings).toEqual(settings);
      });
    });
  });

  describe('highlighting log', () => {
    it('creates, reads and updates highlighting log', async () => {
      dao.init();
      await dao
        .getHighlightingLog()
        .then((highlightingLog: HighlightingLog) => {
          expect(highlightingLog).not.toBeNull();
          expect(highlightingLog.entries).toEqual([]);
        });
      let highlightingLog: HighlightingLog = new HighlightingLog([
        new HighlightingLogEntry('example.com', new Date(), { 1: 12, 2: 34 }),
      ]);
      await dao.saveHighlightingLog(highlightingLog);
      await dao
        .getHighlightingLog()
        .then((receivedHighlightingLog: HighlightingLog) => {
          expect(receivedHighlightingLog.entries).toEqual(
            highlightingLog.entries
          );
        });
    });
  });

  // Stub the store.
  // Emulates chrome's local store.
  function stubStore() {
    let data = {};
    store.get = (
      keys: any,
      callback: (items: { [key: string]: any }) => void
    ): void => {
      let result = {};
      if (Array.isArray(keys)) {
        keys.forEach((key: string) => {
          result[key] = data[key];
        });
      } else {
        result[keys] = data[keys];
      }
      callback(result);
    };
    store.set = (items: Object, callback?: () => void): void => {
      Object.keys(items).forEach((key: string) => {
        data[key] = items[key];
      });
      callback();
    };
  }
});
