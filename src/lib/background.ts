///<reference path="dao.ts" />

class Background {
    dao: DAO;

    constructor(dao: DAO) {
        this.dao = dao;
    }

    start(): void {
        this.dao.init();
    }
}