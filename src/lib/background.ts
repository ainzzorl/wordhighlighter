///<reference path="dao.ts" />
///<reference path="logger.ts" />

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

    // TODO: skip dupes
    addWord(value: string): void {
        this.dao.addEntry(value, '', false, function() {
            WHLogger.log('Word ' + value + ' has been added to the dictionary through the context menu');
        });
    }
}