///<reference path="../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../src/lib/textNodeHandler.ts" />
///<reference path="../src/lib/dao.ts" />

describe('textNodeHandler', function() {
    let handler: TextNodeHandler;
    let dao: DAO;
    let element: Text;
    let result: Array<HTMLElement>;

    beforeEach(function() {
        let dictionary = [];
        dictionary.push(new DictionaryEntry('people'));
        dictionary.push(new DictionaryEntry('profit'));
        handler = new TextNodeHandler(dictionary);
    });

    describe('1 match in the middle', function() {
        beforeEach(function() {
            element = document.createTextNode('Internet for people and');
            result = handler.injectMarkip(element);
        });

        it('injects markup', function() {
            expect(result.length).toEqual(3);
            expect(result[0].nodeValue).toEqual('Internet for ');
            expect(result[1].outerHTML).toEqual('<span class="highlighted-word">people</span>');
            expect(result[2].nodeValue).toEqual(' and');
        });
    });
});
