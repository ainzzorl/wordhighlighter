///<reference path="../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../src/lib/Content.ts" />

describe('content', function() {
    let dao;

    describe('start', function() {
        let rootElement;

        beforeEach(function() {
            let dao = new DAO();
            dao.getDictionary = function(callback: (dictionary: Array<DictionaryEntry>) => void) {
                let dictionary = [];
                dictionary.push(new DictionaryEntry('people'));
                dictionary.push(new DictionaryEntry('profit'));
                callback(dictionary);
            };

            rootElement = document.createElement('div');
            rootElement.innerHTML = '<h2>Internet for people,<br>not profit.</h2>';
            document.body.appendChild(rootElement);

            let content = new Content(dao, document);
            content.start();
        });

        it('replaces the text entries', function() {
            expect(rootElement.innerHTML).toEqual(
                '<h2>Internet for <span class="highlighted-word">people</span>,<br>not <span class="highlighted-word">profit</span>.</h2>');
        });
    });
});
