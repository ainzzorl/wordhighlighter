///<reference path="../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../src/lib/textNodeHandler.ts" />
///<reference path="../src/lib/dao.ts" />

describe('textNodeHandler', function() {
    let handler: TextNodeHandler;
    let dao: DAO;

    describe('injectMarkup', function() {
        let element: Text;
        let result: Array<HTMLElement>;

        beforeEach(function() {
            handler = new TextNodeHandler(null);
            element = document.createTextNode('Internet for people, not profit');
        });

        describe('1 match in the middle', function() {
            beforeEach(function() {
                handler.findMatches = function(input) {
                    return [
                        { value: 'Internet for ', matchOf: null },
                        { value: 'people', matchOf: 'people' },
                        { value: ', not profit', matchOf: null }
                    ];
                }
                result = handler.injectMarkup(element);
            });

            it('injects markup', function() {
                expect(result.length).toEqual(3);
                expect(result[0].nodeValue).toEqual('Internet for ');
                expect(result[1].outerHTML).toEqual('<span class="highlighted-word">people</span>');
                expect(result[2].nodeValue).toEqual(', not profit');
            });
        });

        describe('no match', function() {
            beforeEach(function() {
                handler.findMatches = function(input) {
                    return [
                        { value: 'Internet for people, not profit', matchOf: null }
                    ];
                }
                result = handler.injectMarkup(element);
            });

            it('returns null', function() {
                expect(result).toBeNull();
            });
        });


        describe('entire input is a match', function() {
            beforeEach(function() {
                handler.findMatches = function(input) {
                    return [
                        { value: 'Internet for people, not profit', matchOf: 'Internet for people, not profit' }
                    ];
                }
                result = handler.injectMarkup(element);
            });

            it('injects markup', function() {
                expect(result.length).toEqual(1);
                expect(result[0].outerHTML).toEqual('<span class="highlighted-word">Internet for people, not profit</span>');
            });
        });
    });

    describe('findMatches', function() {
        let matchResult: Array<MatchResultEntry>;

        beforeEach(function() {
            let dictionary = [];
            dictionary.push(new DictionaryEntry('people'));
            dictionary.push(new DictionaryEntry('profit'));
            handler = new TextNodeHandler(dictionary);
        });

        describe('1 match in the middle', function() {
            beforeEach(function() {
                matchResult = handler.findMatches('Internet for people, not');
            });

            it('finds the match', function() {
                expect(matchResult.length).toEqual(3);
                expect(matchResult[0].value).toEqual('Internet for ');
                expect(matchResult[0].matchOf).toBeNull();
                expect(matchResult[1].value).toEqual('people');
                expect(matchResult[1].matchOf).toEqual('people');
                expect(matchResult[2].value).toEqual(', not');
                expect(matchResult[2].matchOf).toBeNull();
            });
        });

        describe('no match', function() {
            beforeEach(function() {
                matchResult = handler.findMatches('Text that does not match');
            });

            it('detects that there is no match', function() {
                expect(matchResult.length).toEqual(1);
                expect(matchResult[0].value).toEqual('Text that does not match');
                expect(matchResult[0].matchOf).toBeNull();
            });
        });

        describe('all string is a match', function() {
            beforeEach(function() {
                matchResult = handler.findMatches('people');
            });

            it('finds the match', function() {
                expect(matchResult.length).toEqual(1);
                expect(matchResult[0].value).toEqual('people');
                expect(matchResult[0].matchOf).toEqual('people');
            });
        });

        describe('match in the beginning', function() {
            beforeEach(function() {
                matchResult = handler.findMatches('people and');
            });

            it('finds the match', function() {
                expect(matchResult.length).toEqual(2);
                expect(matchResult[0].value).toEqual('people');
                expect(matchResult[0].matchOf).toEqual('people');
                expect(matchResult[1].value).toEqual(' and');
                expect(matchResult[1].matchOf).toBeNull();
            });
        });

        describe('match in the end', function() {
            beforeEach(function() {
                matchResult = handler.findMatches('not profit');
            });

            it('finds the match', function() {
                expect(matchResult.length).toEqual(2);
                expect(matchResult[0].value).toEqual('not ');
                expect(matchResult[0].matchOf).toBeNull();
                expect(matchResult[1].value).toEqual('profit');
                expect(matchResult[1].matchOf).toEqual('profit');
            });
        });
    });
});
