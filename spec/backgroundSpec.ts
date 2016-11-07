///<reference path="../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../src/lib/Background.ts" />

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
});
