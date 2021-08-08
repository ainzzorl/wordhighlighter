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
      await dao.addEntry('value1', 'description1', true, 123);
      let dictionary = await dao.getDictionary();
      expect(dictionary.length).toEqual(1);
      expect(dictionary[0].value).toEqual('value1');
      expect(dictionary[0].description).toEqual('description1');
      expect(dictionary[0].strictMatch).toEqual(true);
      expect(dictionary[0].createdAt).not.toBeNull();
      expect(dictionary[0].updatedAt).not.toBeNull();
      expect(dictionary[0].id).not.toBeNull();
      expect(dictionary[0].groupId).toEqual(123);
      dictionary.push(new DictionaryEntry(null, 'value2', 'description2'));
      await dao.saveDictionary(dictionary);
      dictionary = await dao.getDictionary();
      expect(dictionary.length).toEqual(2);
      expect(dictionary[1].value).toEqual('value2');
      expect(dictionary[1].description).toEqual('description2');
      expect(dictionary[1].strictMatch).toEqual(false);
      expect(dictionary[1].id).not.toBeNull();
      expect(dictionary[1].groupId).toEqual(Group.DEFAULT_GROUP_ID);
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
      settings.showTooltip = ShowTooltip.NEVER;
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
        new HighlightingLogEntry(
          'example.com',
          new Date(),
          new Map([
            [1, 12],
            [2, 34],
          ])
        ),
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

  describe('groups', () => {
    it('creates, reads and updates groups', async () => {
      dao.init();

      let groups = await dao.getGroups();
      expect(groups.length).toEqual(1);
      expect(groups[0].name).toEqual('Default');
      expect(groups[0].backgroundColor).toEqual('ffff00');

      await dao.addGroup(
        'group-1-name',
        'group-1-color',
        true,
        'group-1-language'
      );
      groups = await dao.getGroups();
      expect(groups.length).toEqual(2);
      expect(groups[1].name).toEqual('group-1-name');
      expect(groups[1].backgroundColor).toEqual('group-1-color');
      expect(groups[1].enableSmartMatching).toBe(true);
      expect(groups[1].smartMatchingLanguage).toEqual('group-1-language');
      expect(groups[1].createdAt).not.toBeNull();
      expect(groups[1].updatedAt).not.toBeNull();
      expect(groups[1].id).toEqual(2);

      groups.push(
        new Group(
          null,
          'group-2-name',
          'group-2-color',
          false,
          'group-2-language'
        )
      );
      await dao.saveGroups(groups);
      groups = await dao.getGroups();
      expect(groups.length).toEqual(3);
      expect(groups[2].name).toEqual('group-2-name');
      expect(groups[2].backgroundColor).toEqual('group-2-color');
      expect(groups[2].enableSmartMatching).toEqual(false);
      expect(groups[2].smartMatchingLanguage).toEqual('group-2-language');
      expect(groups[2].createdAt).not.toBeNull();
      expect(groups[2].updatedAt).not.toBeNull();
      expect(groups[2].id).toEqual(3);
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
