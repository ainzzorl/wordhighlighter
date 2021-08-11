///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../src/lib/common/dao.ts" />

// Backwards compatibility tests.
// Makes sure that blobs stored by previous versions are loaded correcty.
// These tests allow us to change the schema with confidence.
// There's a lot of duplication between the tests, but we are ok with it.
describe('backwards compatibility', () => {
  let dao: DAO;
  let store: any = {};
  let data: any;

  beforeEach(() => {
    data = {};
    dao = new DAO(<chrome.storage.StorageArea>store);
    stubStore();
  });

  // Major data changes in 1.7:
  // - Added group matching type and smart matching language.
  // - Highlight key type changed from string to number.
  // - Added settings.showTooltip
  describe('1.6', () => {
    beforeEach(() => {
      data['dictionary'] = [
        {
          id: 1,
          value: 'word 1',
          description: 'description 1',
          createdAt: '2021-03-19T14:07:48.171Z',
          updatedAt: '2021-03-19T14:07:48.171Z',
          strictMatch: true,
          groupId: 1,
        },
        {
          id: 1,
          value: 'word 2',
          description: 'description 2',
          createdAt: '2021-03-19T14:07:48.171Z',
          updatedAt: '2021-03-19T14:07:48.171Z',
          strictMatch: false,
          groupId: 6,
        },
      ];
      data['highlightingLog'] = [
        {
          url: 'https://example.com/page1',
          date: 1616162953869,
          highlights: [['1', 3]],
        },
        {
          url: 'https://example.com/page2',
          date: 1616162978512,
          highlights: [['2', 5]],
        },
      ];
      data['idSequenceNumber'] = 5;
      data['groupIdSequenceNumber'] = 10;
      data['settings'] = {
        timeout: 5,
        enableHighlighting: true,
        enablePageStats: true,
        backgroundColor: 'eeff00',
      };
      data['groups'] = [
        {
          id: 1,
          name: 'group-1',
          backgroundColor: 'group-1-color',
          createdAt: '2021-07-16T12:27:44.573Z',
          updatedAt: '2021-07-16T12:27:44.573Z',
        },
        {
          id: 6,
          name: 'group-2',
          backgroundColor: 'group-2-color',
          createdAt: '2021-07-16T12:27:44.573Z',
          updatedAt: '2021-07-16T12:27:44.573Z',
        },
      ];
      dao.init();
    });

    it('can read the dictionary', async () => {
      let dictionary = await dao.getDictionary();
      expect(dictionary.length).toEqual(2);
      expect(dictionary[0].value).toEqual('word 1');
      expect(dictionary[0].description).toEqual('description 1');
      expect(dictionary[0].strictMatch).toEqual(true);
      expect(dictionary[0].id).toBe(1);
      expect(dictionary[0].groupId).toEqual(1);
    });

    it('can read the word sequence', async () => {
      await dao.addEntry('word 5', 'description 4', true, 0);
      let dictionary = await dao.getDictionary();
      expect(dictionary.length).toEqual(3);
      expect(dictionary[2].id).toEqual(5);
    });

    it('can read the dictionary sequence', async () => {
      await dao.addGroup(
        'group 10',
        'group 10 color',
        MatchingType.SMART,
        'group 10 language'
      );
      let groups = await dao.getGroups();
      expect(groups.length).toEqual(3);
      expect(groups[2].id).toEqual(10);
    });

    it('can read settings', async () => {
      let settings = await dao.getSettings();
      expect(settings.timeout).toEqual(5);
      expect(settings.enableHighlighting).toEqual(true);
      expect(settings.enablePageStats).toEqual(true);
      expect(settings.showTooltip).toEqual(ShowTooltip.ALWAYS);
    });

    it('can read highlighting log', async () => {
      let highlightingLog = await dao.getHighlightingLog();
      expect(highlightingLog.entries.length).toEqual(2);
      expect(highlightingLog.entries[0].url).toEqual(
        'https://example.com/page1'
      );
      expect(highlightingLog.entries[0].highlights).toEqual(new Map([[1, 3]]));
    });

    it('can read groups', async () => {
      let groups = await dao.getGroups();
      expect(groups.length).toEqual(2);
      expect(groups[0].id).toBe(1);
      expect(groups[0].name).toBe('group-1');
      expect(groups[0].backgroundColor).toBe('group-1-color');
      // Defaults
      expect(groups[0].matchingType).toBe(MatchingType.SMART);
      expect(groups[0].matchingLanguage).toBe('en');
    });
  });

  // Major data changes in 1.6:
  // - Added groups.
  // - Moved background color from settings to groups.
  describe('1.5', () => {
    beforeEach(() => {
      data['dictionary'] = [
        {
          id: 1,
          value: 'word 1',
          description: 'description 1',
          createdAt: '2021-03-19T14:07:48.171Z',
          updatedAt: '2021-03-19T14:07:48.171Z',
          strictMatch: true,
        },
        {
          id: 1,
          value: 'word 2',
          description: 'description 2',
          createdAt: '2021-03-19T14:07:48.171Z',
          updatedAt: '2021-03-19T14:07:48.171Z',
          strictMatch: false,
        },
      ];
      data['highlightingLog'] = [
        {
          url: 'https://example.com/page1',
          date: 1616162953869,
          highlights: [['1', 3]],
        },
        {
          url: 'https://example.com/page2',
          date: 1616162978512,
          highlights: [['2', 5]],
        },
      ];
      data['idSequenceNumber'] = 5;
      data['settings'] = {
        timeout: 5,
        enableHighlighting: true,
        enablePageStats: true,
        backgroundColor: 'eeff00',
      };
      dao.init();
    });

    it('can read the dictionary', async () => {
      let dictionary = await dao.getDictionary();
      expect(dictionary.length).toEqual(2);
      expect(dictionary[0].value).toEqual('word 1');
      expect(dictionary[0].description).toEqual('description 1');
      expect(dictionary[0].strictMatch).toEqual(true);
      expect(dictionary[0].id).toBe(1);
      expect(dictionary[1].groupId).toEqual(Group.DEFAULT_GROUP_ID);
    });

    it('can read the sequence', async () => {
      await dao.addEntry('word 5', 'description 4', true, 0);
      let dictionary = await dao.getDictionary();
      expect(dictionary.length).toEqual(3);
      expect(dictionary[2].id).toEqual(5);
    });

    it('can read settings', async () => {
      let settings = await dao.getSettings();
      expect(settings.timeout).toEqual(5);
      expect(settings.enableHighlighting).toEqual(true);
      expect(settings.enablePageStats).toEqual(true);
      expect(settings.showTooltip).toEqual(ShowTooltip.ALWAYS);
    });

    it('can read highlighting log', async () => {
      let highlightingLog = await dao.getHighlightingLog();
      expect(highlightingLog.entries.length).toEqual(2);
      expect(highlightingLog.entries[0].url).toEqual(
        'https://example.com/page1'
      );
      expect(highlightingLog.entries[0].highlights).toEqual(new Map([[1, 3]]));
    });

    it('initializes groups', async () => {
      let groups = await dao.getGroups();
      expect(groups.length).toEqual(1);
      expect(groups[0].id).toEqual(Group.DEFAULT_GROUP_ID);
      // Inherited from Settings
      expect(groups[0].backgroundColor).toEqual('eeff00');
      expect(groups[0].name).toEqual('Default');
      expect(groups[0].matchingType).toBe(MatchingType.SMART);
      expect(groups[0].matchingLanguage).toBe('en');

      // Checking that the sequence number is correct
      await dao.addGroup(
        'group-2',
        'aabbcc',
        MatchingType.SMART,
        'group-2-language'
      );
      groups = await dao.getGroups();
      expect(groups.length).toEqual(2);
      expect(groups[1].id).toEqual(2);
    });
  });

  // Major data changes in 1.5:
  // - Added Settings.backgroundColor
  describe('1.4', () => {
    beforeEach(() => {
      data['dictionary'] = [
        {
          id: 1,
          value: 'word 1',
          description: 'description 1',
          createdAt: '2021-03-19T14:07:48.171Z',
          updatedAt: '2021-03-19T14:07:48.171Z',
          strictMatch: true,
        },
        {
          id: 1,
          value: 'word 2',
          description: 'description 2',
          createdAt: '2021-03-19T14:07:48.171Z',
          updatedAt: '2021-03-19T14:07:48.171Z',
          strictMatch: false,
        },
      ];
      data['highlightingLog'] = [
        {
          url: 'https://example.com/page1',
          date: 1616162953869,
          highlights: [['1', 3]],
        },
        {
          url: 'https://example.com/page2',
          date: 1616162978512,
          highlights: [['2', 5]],
        },
      ];
      data['idSequenceNumber'] = 5;
      data['settings'] = {
        timeout: 5,
        enableHighlighting: true,
        enablePageStats: true,
      };
      dao.init();
    });

    it('can read the dictionary', async () => {
      let dictionary = await dao.getDictionary();
      expect(dictionary.length).toEqual(2);
      expect(dictionary[0].value).toEqual('word 1');
      expect(dictionary[0].description).toEqual('description 1');
      expect(dictionary[0].strictMatch).toEqual(true);
      expect(dictionary[0].id).toBe(1);
      expect(dictionary[1].groupId).toEqual(Group.DEFAULT_GROUP_ID);
    });

    it('can read the sequence', async () => {
      await dao.addEntry('word 5', 'description 4', true, 0);
      let dictionary = await dao.getDictionary();
      expect(dictionary.length).toEqual(3);
      expect(dictionary[2].id).toEqual(5);
    });

    it('can read settings', async () => {
      let settings = await dao.getSettings();
      expect(settings.timeout).toEqual(5);
      expect(settings.enableHighlighting).toEqual(true);
      expect(settings.enablePageStats).toEqual(true);
      expect(settings.showTooltip).toEqual(ShowTooltip.ALWAYS);
    });

    it('can read highlighting log', async () => {
      let highlightingLog = await dao.getHighlightingLog();
      expect(highlightingLog.entries.length).toEqual(2);
      expect(highlightingLog.entries[0].url).toEqual(
        'https://example.com/page1'
      );
      expect(highlightingLog.entries[0].highlights).toEqual(new Map([[1, 3]]));
    });

    it('initializes groups', async () => {
      let groups = await dao.getGroups();
      expect(groups.length).toEqual(1);
      expect(groups[0].id).toEqual(Group.DEFAULT_GROUP_ID);
      expect(groups[0].backgroundColor).toEqual(
        Settings.DEFAULT_BACKGROUND_COLOR
      );
      expect(groups[0].name).toEqual('Default');
      expect(groups[0].matchingType).toBe(MatchingType.SMART);
      expect(groups[0].matchingLanguage).toBe('en');

      // Checking that the sequence number is correct
      await dao.addGroup(
        'group-2',
        'aabbcc',
        MatchingType.SMART,
        'group-2-language'
      );
      groups = await dao.getGroups();
      expect(groups.length).toEqual(2);
      expect(groups[1].id).toEqual(2);
    });
  });

  // Stub the store.
  // Emulates chrome's local store.
  function stubStore() {
    store.get = (
      keys: any,
      callback: (items: { [key: string]: any }) => void
    ): void => {
      let result = {};
      if (Array.isArray(keys)) {
        keys.forEach((key: string) => {
          result[key] = data[key] || null;
        });
      } else {
        result[keys] = data[keys] || null;
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
