///<reference path="../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../src/lib/background.ts" />
///<reference path="../src/lib/common/dictionaryEntry.ts" />

describe('background', () => {
  let dao;

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
    let background;

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
              strictMatch
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
        await background.addWord('differentWord');
      });

      it('adds the word', () => {
        expect(dao.addEntry).toHaveBeenCalledWith(
          'differentWord',
          '',
          false,
          Group.DEFAULT_GROUP_ID
        );
      });
    });

    describe('duplicate', () => {
      beforeEach(() => {
        background.addWord('existingWord');
      });

      it('does not add the word', () => {
        expect(dao.addEntry).not.toHaveBeenCalled();
      });
    });
  });
});
