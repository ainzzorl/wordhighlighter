///<reference path="../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../node_modules/@types/angular/index.d.ts" />
///<reference path="../src/lib/dictionaryEntry.ts" />

declare let inject: any;

describe('mainDialogController', function() {

    let controller;
    let $scope: any;
    let dao;

    let mod: any = module;
    beforeEach(mod('wordhighlighter'));

    beforeEach(function() {
        dao = {
            getDictionary: function(callback: (dictionary: Array<DictionaryEntry>) => void) {
                let result = [];
                result.push(new DictionaryEntry('word1'));
                result.push(new DictionaryEntry('word2'));
                callback(result);
            },
            addEntry(entry: DictionaryEntry, callback: () => void): void {
                callback();
            }
        };
    });

    beforeEach(inject(function($controller, $rootScope) {
        $scope = $rootScope.$new();
        controller = $controller('mainDialogController', { $scope: $scope, NgTableParams: function() {}, dao: dao });
    }));

    describe('load', function() {
        beforeEach(function() {
            $scope.load();
        });

        it ('loads the dictionary', function() {
            expect($scope.dictionary.map(function(de: DictionaryEntry) {
                return de.value;
            })).toEqual(['word1', 'word2']);
        });

        it ('makes a copy of the original data', function() {
            expect($scope.originalData).toEqual($scope.dictionary);
        });

        it ('assigns ids to the dictionary entries', function() {
            expect($scope.dictionary.map(function(de: any) {
                return de.id;
            })).toEqual([0, 1]);
        });
    });

    describe('onAddNewWordClicked', function() {
        beforeEach(function() {
            spyOn($scope, 'load').and.callThrough();
            spyOn(dao, 'addEntry').and.callThrough();
        });

        describe('new word is not empty', function() {
            beforeEach(function() {
                $scope.newWord = 'newword';
                $scope.onAddNewWordClicked();
            });

            it ('adds the new entry', function() {
                // TODO: better matcher
                expect(dao.addEntry).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Function));
            });

            it ('reloads the dictionary', function() {
                expect($scope.load).toHaveBeenCalled();
            });

            it ('resets the word', function() {
                expect($scope.newWord).toEqual('');
            });
        });

        describe('new word is empty', function() {
            beforeEach(function() {
                $scope.newWord = '';
                $scope.onAddNewWordClicked();
            });

            it ('does not add the new entry', function() {
                expect(dao.addEntry).not.toHaveBeenCalled();
            });

            it ('does not reload the dictionary', function() {
                expect($scope.load).not.toHaveBeenCalled();
            });
        });
    });
});
