///<reference path="../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../src/lib/background.ts" />

describe('background', function() {
    let dao;

    describe('start', function() {

        beforeEach(function() {
            dao = {
                init: function() {}
            };
            spyOn(dao, 'init');
            let background = new Background(dao);
            background.start();
        });

        it('initializes the DAO', function() {
            expect(dao.init).toHaveBeenCalled();
        });
    });

    describe('addWord', function() {
        beforeEach(function() {
            dao = {
                addEntry(value: string, description: string, strictMatch: boolean, callback: (dictionaryEntry: DictionaryEntry) => void): void {
                    callback(new DictionaryEntry(1, value, description, new Date(), new Date(), strictMatch));
                }
            };
            spyOn(dao, 'addEntry').and.callThrough();
            let background = new Background(dao);
            background.addWord('test-value');
        });

        it('adds the word', function() {
            expect(dao.addEntry).toHaveBeenCalledWith('test-value', '', false, jasmine.any(Function));
        });
    });
});
