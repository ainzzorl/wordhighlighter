///<reference path="../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../node_modules/@types/angular/index.d.ts" />
///<reference path="../src/lib/dictionaryEntry.ts" />

declare let inject: any;

describe('wordsController', function() {

    let controller;
    let $scope: any;
    let dao;
    let NgTableParams;
    let dictionaryEntryForm;

    let mod: any = module;
    beforeEach(mod('mainDialog'));

    beforeEach(function() {
        dao = {
            getDictionary: function(callback: (dictionary: Array<DictionaryEntry>) => void) {
                let result = [];
                result.push(new DictionaryEntry(1, 'word1', 'desc1', new Date(), new Date()));
                result.push(new DictionaryEntry(2, 'word2', 'desc2', new Date(), new Date()));
                result.push(new DictionaryEntry(3, 'word3', 'desc3', new Date(), new Date()));
                callback(result);
            },
            addEntry(value: string, description: string, strictMatch: boolean, callback: (dictionaryEntry: DictionaryEntry) => void): void {
                callback(new DictionaryEntry(1, value, description, new Date(), new Date(), strictMatch));
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
        controller = $controller('wordsController', { $scope: $scope, NgTableParams: NgTableParams, dao: dao });
    }));

    describe('load', function() {
        beforeEach(function() {
            $scope.load();
        });

        it ('loads the dictionary', function() {
            expect($scope.dictionary.map(function(de: DictionaryEntry) {
                return de.value;
            })).toEqual(['word1', 'word2', 'word3']);
        });

        it ('makes a copy of the original data', function() {
            expect($scope.originalData).toEqual($scope.dictionary);
        });
    });

    describe('onAddNewWordClicked', function() {
        beforeEach(function() {
            spyOn($scope.tableParams, 'reload').and.callThrough();
            spyOn(dao, 'addEntry').and.callThrough();
            $scope.dictionary = [];
        });

        describe('new word is not empty', function() {
            describe ('not dupe', function() {
                beforeEach(function() {
                    $scope.newWord = {
                        value: 'new-word-value',
                        description: 'new-word-description',
                        strictMatch: true
                    };
                    $scope.showAddingDupeError = true;
                    $scope.onAddNewWordClicked();
                });

                it ('persists the new entry', function() {
                    expect(dao.addEntry).toHaveBeenCalledWith(
                        'new-word-value', 'new-word-description', true, jasmine.any(Function));
                });

                it ('adds the new entry to the table', function() {
                    expect($scope.dictionary.length).toEqual(1);
                    expect($scope.dictionary[0].value).toEqual('new-word-value');
                    expect($scope.dictionary[0].description).toEqual('new-word-description');
                    expect($scope.dictionary[0].strictMatch).toBe(true);
                });

                it ('reloads the table', function() {
                    expect($scope.tableParams.reload).toHaveBeenCalled();
                });

                it ('resets the word', function() {
                    expect($scope.newWord.value).toEqual('');
                    expect($scope.newWord.description).toEqual('');
                    expect($scope.newWord.strictMatch).toBe(false);
                });

                it ('hides the error', function() {
                    expect($scope.showAddingDupeError).toBe(false);
                });
            });

            describe ('dupe', function() {
                beforeEach(function() {
                    $scope.dictionary = [
                        new DictionaryEntry(1, 'new-word-value', '', new Date(), new Date())
                    ];
                    $scope.newWord = {
                        value: 'new-word-value',
                        description: 'new-word-description'
                    };
                    $scope.showAddingDupeError = false;
                    $scope.onAddNewWordClicked();
                });

                it ('does not persist the new entry', function() {
                    expect(dao.addEntry).not.toHaveBeenCalled();
                });

                it ('does not add the new entry to the table', function() {
                    expect($scope.dictionary.length).toEqual(1);
                });

                it ('does not reload the table', function() {
                    expect($scope.tableParams.reload).not.toHaveBeenCalled();
                });

                it ('does not reset the word', function() {
                    expect($scope.newWord.value).toEqual('new-word-value');
                    expect($scope.newWord.description).toEqual('new-word-description');
                });

                it ('shows an error', function() {
                    expect($scope.showAddingDupeError).toBe(true);
                });
            });
        });

        describe('new word is empty', function() {
            beforeEach(function() {
                $scope.newWord = {
                    value: '',
                    description: 'new-word-desciption'
                };
                $scope.onAddNewWordClicked();
            });

            it ('does not add the new entry', function() {
                expect(dao.addEntry).not.toHaveBeenCalled();
            });

            it ('does not reload the dictionary', function() {
                expect($scope.tableParams.reload).not.toHaveBeenCalled();
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
            $scope.dictionary[1].isDupe = true;

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

        it ('hides the dupe error', function() {
            expect($scope.dictionary[1].isDupe).toBe(false);
        });
    });

    describe('save', function() {
        beforeEach(function() {
            spyOn(dictionaryEntryForm, '$setPristine').and.callThrough();
            spyOn(dao, 'saveDictionary').and.callThrough();
        });

        describe('not dupe', function() {
            beforeEach(function() {
                $scope.dictionary[1].value += '-updated';
                $scope.dictionary[1].isEditing = true;
                $scope.dictionary[1].isDupe = true;

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

            it ('hides the dupe error', function() {
                expect($scope.dictionary[1].isDupe).toBe(false);
            });
        });

        describe('dupe', function() {
            let originalData: string;

            beforeEach(function() {
                $scope.dictionary[1].value = $scope.dictionary[2].value;
                $scope.dictionary[1].isEditing = true;
                $scope.dictionary[1].isDupe = false;
                originalData = $scope.originalData[1].value;

                $scope.save($scope.dictionary[1], dictionaryEntryForm);
            });

            it ('does not update the original data', function() {
                expect($scope.originalData[1].value).toEqual(originalData);
            });

            it ('does not set the form pristine', function() {
                expect(dictionaryEntryForm.$setPristine).not.toHaveBeenCalled();
            });

            it ('does not mark the row as not being edited', function() {
                expect($scope.dictionary[1].isEditing).toBe(true);
            });

            it ('does not persist the dictionary', function() {
                expect(dao.saveDictionary).not.toHaveBeenCalled();
            });

            it ('shows the dupe error', function() {
                expect($scope.dictionary[1].isDupe).toBe(true);
            });
        });
    });

    describe('isDupe', function() {
        it ('is true if the match is exacy', function() {
            expect($scope.isDupe('word1')).toBe(true);
        });

        it ('is true if the match is exacy but in different case', function() {
            expect($scope.isDupe('WORD1')).toBe(true);
        });

        it ('is false otherwise', function() {
            expect($scope.isDupe('word4')).toBe(false);
        });

        it ('is false if the match is skipped', function() {
            expect($scope.isDupe('word1', 1)).toBe(false);
        });
    });
});
