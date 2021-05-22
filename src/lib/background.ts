///<reference path="common/dao.ts" />
///<reference path="common/logger.ts" />

/**
 * Implements background logic: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Background_scripts
 */
class Background {
  dao: DAO;

  constructor(dao: DAO) {
    this.dao = dao;
  }

  start(): void {
    this.dao.init();
  }

  // TODO: use utility method to check for dupes
  addWord(value: string): void {
    let dao = this.dao;
    dao.getDictionary().then((dictionary: Array<DictionaryEntry>) => {
      let isDupe: boolean =
        dictionary.filter(function (entry) {
          return entry.value === value;
        }).length > 0;
      if (!isDupe) {
        dao.addEntry(value, '', false, function () {
          WHLogger.log(
            'Word ' +
              value +
              ' has been added to the dictionary through the context menu'
          );
        });
      }
    });
  }
}
