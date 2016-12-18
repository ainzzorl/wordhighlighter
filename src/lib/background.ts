///<reference path="dao.ts" />

class Background {
    dao: DAO;

    constructor(dao: DAO) {
        this.dao = dao;
    }

    start(): void {
        this.dao.init();
    }

    // TODO: skip dupes?
    addWord(value: string): void {
        this.dao.addEntry(value, '', false, function() {
            console.log('Word ' + value + ' has been added to the dictionary through the context menu');
        });
    }
}