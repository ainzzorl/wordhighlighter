///<reference path="../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../node_modules/@types/angular/index.d.ts" />
///<reference path="../src/lib/dictionaryEntry.ts" />

declare let inject: any;

describe('mainDialogController', function() {

    let controller;
    let $scope: any;
    let dao;
    let NgTableParams;
    let dictionaryEntryForm;

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
            },
            saveDictionary(dictionary: Array<DictionaryEntry>, callback: () => void): void {
                callback();
            }
        };
        NgTableParams = function() {
            return {
                reload: function() {
                }
            };
        };
        dictionaryEntryForm = {
            $setPristine: function() {
            }
        };
    });

    beforeEach(inject(function($controller, $rootScope) {
        $scope = $rootScope.$new();
        controller = $controller('mainDialogController', { $scope: $scope, NgTableParams: NgTableParams, dao: dao });
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

    describe('delete', function() {
        beforeEach(function() {
            spyOn($scope, 'load').and.callThrough();
            spyOn(dao, 'saveDictionary').and.callThrough();
            spyOn($scope.tableParams, 'reload').and.callThrough();

            $scope.dictionary = [];
            $scope.dictionary.push({value: 'word1', id: 1});
            $scope.dictionary.push({value: 'word2', id: 2});
            $scope.dictionary.push({value: 'word3', id: 3});

            $scope.delete($scope.dictionary[1]);
        });

        it ('removes the word from the list', function() {
            expect($scope.dictionary.map(function(de: any) {
                return de.value;
            })).toEqual(['word1', 'word3']);
        });

        it ('reloads the table', function() {
            expect($scope.tableParams.reload).toHaveBeenCalled();
        });

        it ('persists the dictionary', function() {
            expect(dao.saveDictionary).toHaveBeenCalled();
        });
    });

    describe('cancel', function() {
        let originalValue: string;

        beforeEach(function() {
            spyOn(dictionaryEntryForm, '$setPristine').and.callThrough();

            originalValue = $scope.dictionary[1].value;
            $scope.dictionary[1].value += '-updated';
            $scope.dictionary[1].isEditing = true;

            $scope.cancel($scope.dictionary[1], dictionaryEntryForm);
        });

        it ('resets the value', function() {
            expect($scope.dictionary[1].value).toEqual(originalValue);
        });

        it ('sets the form pristine', function() {
            expect(dictionaryEntryForm.$setPristine).toHaveBeenCalled();
        });

        it ('marks the row as not being edited', function() {
            expect($scope.dictionary[1].isEditing).toBe(false);
        });
    });

    describe('save', function() {
        beforeEach(function() {
            spyOn(dictionaryEntryForm, '$setPristine').and.callThrough();
            spyOn(dao, 'saveDictionary').and.callThrough();

            $scope.dictionary[1].value += '-updated';
            $scope.dictionary[1].isEditing = true;

            $scope.save($scope.dictionary[1], dictionaryEntryForm);
        });

        it ('updates the original data', function() {
            expect($scope.originalData[1].value).toEqual($scope.dictionary[1].value);
        });

        it ('sets the form pristine', function() {
            expect(dictionaryEntryForm.$setPristine).toHaveBeenCalled();
        });

        it ('marks the row as not being edited', function() {
            expect($scope.dictionary[1].isEditing).toBe(false);
        });

        it ('persists the dictionary', function() {
            expect(dao.saveDictionary).toHaveBeenCalled();
        });
    });
});
