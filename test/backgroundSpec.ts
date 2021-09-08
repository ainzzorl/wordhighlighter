///<reference path="../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../src/lib/background.ts" />
///<reference path="../src/lib/common/dictionaryEntry.ts" />

describe('background', () => {
  let dao: any;

  describe('start', () => {
    beforeEach(() => {
      dao = {
        init: () => {},
      };
      spyOn(dao, 'init');
      const background = new Background(dao);
      background.start();
    });

    it('initializes the DAO', () => {
      expect(dao.init).toHaveBeenCalled();
    });
  });

  describe('addWord', () => {
    let background: Background;

    beforeEach(() => {
      dao = {
        addEntry(
          value: string,
          description: string,
          strictMatch: boolean,
          callback: (_dictionaryEntry: DictionaryEntry) => void
        ) {
          return Promise.resolve(
            new DictionaryEntry(
              1,
              value,
              description,
              new Date(),
              new Date(),
              strictMatch,
              123
            )
          );
        },
        getDictionary(): Promise<Array<DictionaryEntry>> {
          return Promise.resolve([new DictionaryEntry(1, 'existingWord', '')]);
        },
      };
      spyOn(dao, 'addEntry').and.callThrough();
      background = new Background(dao);
    });

    describe('not duplicate', () => {
      beforeEach(async () => {
        await background.addWord('differentWord', 123);
      });

      it('adds the word', () => {
        expect(dao.addEntry).toHaveBeenCalledWith(
          'differentWord',
          '',
          false,
          123
        );
      });
    });

    describe('duplicate', () => {
      beforeEach(() => {
        background.addWord('existingWord', 123);
      });

      it('does not add the word', () => {
        expect(dao.addEntry).not.toHaveBeenCalled();
      });
    });
  });

  describe('getMenuItems', () => {
    let background: Background;

    describe('one group', () => {
      it('creates menu with one item', async () => {
        dao = {
          getGroups(): Promise<Array<Group>> {
            return Promise.resolve([
              new Group(
                Group.DEFAULT_GROUP_ID,
                'default-group',
                'matching-color',
                MatchingType.SMART,
                'matching-language'
              ),
            ]);
          },
        };
        background = new Background(dao);
        let items = await background.getMenuItems();
        expect(items.length).toBe(1);
        expect(items[0].id).toBe('add-word');
        expect(items[0].parentId).toBeNull();
        expect(items[0].title).toBe('Add word');
        expect(items[0].onclick).not.toBeNull();
      });
    });

    describe('multiple groups', () => {
      it('creates menu with nested items', async () => {
        dao = {
          getGroups(): Promise<Array<Group>> {
            return Promise.resolve([
              new Group(
                Group.DEFAULT_GROUP_ID,
                'default-group',
                'matching-color-1',
                MatchingType.SMART,
                'matching-language'
              ),
              new Group(
                Group.DEFAULT_GROUP_ID + 1,
                'group-2',
                'matching-color-2',
                MatchingType.SMART,
                'matching-language'
              ),
              new Group(
                Group.DEFAULT_GROUP_ID + 2,
                'group-3',
                'matching-color-3',
                MatchingType.SMART,
                'matching-language'
              ),
            ]);
          },
        };
        background = new Background(dao);
        let items = await background.getMenuItems();
        expect(items.length).toBe(4);

        // Root item
        expect(items[0].id).toBe('add-word-root');
        expect(items[0].parentId).toBeNull();
        expect(items[0].title).toBe('Add word');
        expect(items[0].onclick).toBeUndefined();

        // Nested groups
        expect(items[1].id).toBe('add-word-' + Group.DEFAULT_GROUP_ID);
        expect(items[1].parentId).toBe('add-word-root');
        expect(items[1].title).toBe('default-group');
        expect(items[1].onclick).not.toBeNull();
        expect(items[2].id).toBe('add-word-2');
        expect(items[2].parentId).toBe('add-word-root');
        expect(items[2].title).toBe('group-2');
        expect(items[2].onclick).not.toBeNull();
        expect(items[3].id).toBe('add-word-3');
        expect(items[3].parentId).toBe('add-word-root');
        expect(items[3].title).toBe('group-3');
        expect(items[3].onclick).not.toBeNull();
      });
    });
  });
});
