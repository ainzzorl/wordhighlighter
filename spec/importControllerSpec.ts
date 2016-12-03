///<reference path="../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../node_modules/@types/angular/index.d.ts" />
///<reference path="../src/lib/dictionaryEntry.ts" />

describe('importController', function() {

    let controller;
    let $scope: any;
    let dao;

    let mod: any = module;
    beforeEach(mod('mainDialog'));

    beforeEach(function() {
        dao = {
            saveDictionary(dictionary: Array<DictionaryEntry>, callback: () => void): void {
                callback();
            }
        };
    });

    beforeEach(inject(function($controller, $rootScope) {
        $scope = $rootScope.$new();
        controller = $controller('importController', { $scope: $scope, dao: dao });
    }));

    describe('parseInput', function() {
        let result: Array<DictionaryEntry>;

        beforeEach(function() {
            $scope.importInput.data = ''
                + 'word1;description1' + '\n' // word + description
                + 'word2' + '\n' // no description
                + 'word3;description;3' + '\n' // description with semicolumns
                + '    '  + '\n' // empty
                + '    word   4  ;  description  4    ';  // leading and trailing spaces
            result = $scope.parseInput();
        });

        it ('detects the number of entries', function() {
            expect(result.length).toEqual(4);
        });

        it ('reads word + description', function() {
            expect(result[0].value).toEqual('word1');
            expect(result[0].description).toEqual('description1');
        });

        it ('reads word with no description', function() {
            expect(result[1].value).toEqual('word2');
            expect(result[1].description).toEqual('');
        });

        it ('reads description with semicolumns', function() {
            expect(result[2].value).toEqual('word3');
            expect(result[2].description).toEqual('description;3');
        });

        it ('trims leading and trailing spaces', function() {
            expect(result[3].value).toEqual('word   4');
            expect(result[3].description).toEqual('description  4');
        });
    });

    describe('getDuplicateEntries', function() {
        let result: Array<string>;

        describe('contains duplicates', function() {
            beforeEach(function() {
                let input =  [
                    new DictionaryEntry(null, 'word 1', '', null, null),
                    new DictionaryEntry(null, 'word 1', '', null, null),
                    new DictionaryEntry(null, 'word 2', '', null, null),
                    new DictionaryEntry(null, 'word 1', '', null, null),
                    new DictionaryEntry(null, 'word 2', '', null, null),
                    new DictionaryEntry(null, 'word 3', '', null, null),
                ];
                result = $scope.getDuplicateEntries(input);
            });

            it ('detects duplicates', function() {
                expect(result.length).toEqual(2);
                expect(result.indexOf('word 1') >= 0).toBe(true);
                expect(result.indexOf('word 2') >= 0).toBe(true);
            });
        });

        describe('no duplicates', function() {
            beforeEach(function() {
                let input =  [
                    new DictionaryEntry(null, 'word 1', '', null, null),
                    new DictionaryEntry(null, 'word 2', '', null, null),
                    new DictionaryEntry(null, 'word 3', '', null, null),
                ];
                result = $scope.getDuplicateEntries(input);
            });

            it ('detects no duplicates', function() {
                expect(result.length).toEqual(0);
            });
        });
    });

    describe('importAsReplacement', function() {
        let input;

        beforeEach(function() {
            input = [new DictionaryEntry(null, 'word 1', 'desc 1', null, null)];
            spyOn(dao, 'saveDictionary');
            $scope.importAsReplacement(input);
        });

        it('saves the dictionary', function() {
            expect(dao.saveDictionary).toHaveBeenCalledWith(input, jasmine.any(Function));
        });
    });
});
