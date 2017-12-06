///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../node_modules/@types/angular/index.d.ts" />
///<reference path="../../src/lib/common/dictionaryEntry.ts" />

describe('importController', () => {

    let controller;
    let $scope: any;
    let dao;

    let mod: any = module;
    beforeEach(mod('mainDialog'));

    beforeEach(() => {
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

    describe('onImportClicked', () => {
        let input;

        beforeEach(() => {
            input = [
                new DictionaryEntry(null, 'word 1', '', null, null)
            ];
            $scope.parseInput = () => {
                return input;
            };
        });

        describe('keep', () => {
            beforeEach(() => {
                $scope.importInput.mode = $scope.MODE_KEEP;
                spyOn($scope, 'importAndKeep');
            });

            describe('no dupes', () => {
                beforeEach(() => {
                    $scope.getDuplicateEntries = () => {
                        return [];
                    };
                    $scope.onImportClicked();
                });

                it('detects no dupes', () => {
                    expect($scope.dupes).toEqual([]);
                });

                it('imports data', () => {
                    expect($scope.importAndKeep).toHaveBeenCalled();
                });
            });

            describe('dupes', () => {
                beforeEach(() => {
                    $scope.getDuplicateEntries = () => {
                        return ['dup'];
                    };
                    $scope.onImportClicked();
                });

                it('detects dupes', () => {
                    expect($scope.dupes).toEqual(['dup']);
                });

                it('does not import', () => {
                    expect($scope.importAndKeep).not.toHaveBeenCalled();
                });

                it('shows no confirmation', () => {
                    expect($scope.showInputSuccessConfirmation).toBe(false);
                });
            });
        });

        describe('replace', () => {
            beforeEach(() => {
                $scope.importInput.mode = $scope.MODE_REPLACE;
                spyOn($scope, 'importAsReplacement');
                $scope.getDuplicateEntries = () => {
                    return [];
                };
                $scope.onImportClicked();
            });

            it('imports data', () => {
                expect($scope.importAsReplacement).toHaveBeenCalled();
            });
        });

        describe('overwrite', () => {
            beforeEach(() => {
                $scope.importInput.mode = $scope.MODE_OVERWRITE;
                spyOn($scope, 'importAndOverwrite');
                $scope.getDuplicateEntries = () => {
                    return [];
                };
                $scope.onImportClicked();
            });

            it('imports data', () => {
                expect($scope.importAndOverwrite).toHaveBeenCalled();
            });
        });
    });

    describe('parseInput', () => {
        let result: Array<DictionaryEntry>;

        beforeEach(() => {
            $scope.importInput.data = ''
                + 'word1;description1' + '\n' // word + description
                + 'word2' + '\n' // no description
                + 'word3;description;3' + '\n' // description with semicolumns
                + '    '  + '\n' // empty
                + '    word   4  ;  description  4    ';  // leading and trailing spaces
            result = $scope.parseInput();
        });

        it ('detects the number of entries', () => {
            expect(result.length).toEqual(4);
        });

        it ('reads word + description', () => {
            expect(result[0].value).toEqual('word1');
            expect(result[0].description).toEqual('description1');
        });

        it ('reads word with no description', () => {
            expect(result[1].value).toEqual('word2');
            expect(result[1].description).toEqual('');
        });

        it ('reads description with semicolumns', () => {
            expect(result[2].value).toEqual('word3');
            expect(result[2].description).toEqual('description;3');
        });

        it ('trims leading and trailing spaces', () => {
            expect(result[3].value).toEqual('word   4');
            expect(result[3].description).toEqual('description  4');
        });
    });

    describe('getDuplicateEntries', () => {
        let result: Array<string>;

        describe('contains duplicates', () => {
            beforeEach(() => {
                let input =  [
                    new DictionaryEntry(null, 'word 1', '', null, null),
                    new DictionaryEntry(null, 'word 1', '', null, null),
                    new DictionaryEntry(null, 'word 2', '', null, null),
                    new DictionaryEntry(null, 'word 1', '', null, null),
                    new DictionaryEntry(null, 'WoRd 2', '', null, null),
                    new DictionaryEntry(null, 'word 3', '', null, null)
                ];
                result = $scope.getDuplicateEntries(input);
            });

            it ('detects duplicates', () => {
                let lowercaseSortedResult = result.map((r: string) => { return r.toLowerCase(); } ).sort();
                expect(lowercaseSortedResult).toEqual(['word 1', 'word 2']);
            });
        });

        describe('no duplicates', () => {
            beforeEach(() => {
                let input = [
                    new DictionaryEntry(null, 'word 1', '', null, null),
                    new DictionaryEntry(null, 'word 2', '', null, null),
                    new DictionaryEntry(null, 'word 3', '', null, null)
                ];
                result = $scope.getDuplicateEntries(input);
            });

            it ('detects no duplicates', () => {
                expect(result.length).toEqual(0);
            });
        });
    });

    describe('importAsReplacement', () => {
        let input;

        beforeEach(() => {
            input = [new DictionaryEntry(null, 'word 1', 'desc 1', null, null)];
            spyOn(dao, 'saveDictionary').and.callThrough();
            $scope.showInputSuccessConfirmation = false;
            $scope.importInput.data = 'input-data';
            $scope.importAsReplacement(input);
        });

        it('saves the dictionary', () => {
            expect(dao.saveDictionary).toHaveBeenCalledWith(input, jasmine.any(Function));
        });

        it('shows confirmation', () => {
            expect($scope.showInputSuccessConfirmation).toBe(true);
        });

        it('resets input data', () => {
            expect($scope.importInput.data).toEqual('');
        });
    });

    describe('importAndKeep', () => {
        let input;

        beforeEach(() => {
            input = [
                new DictionaryEntry(null, 'new', 'new - desc', null, null),
                new DictionaryEntry(null, 'both', 'both new - desc', null, null)
            ];
            dao.getDictionary = function(callback: (dictionary: Array<DictionaryEntry>) => void) {
                callback([
                    new DictionaryEntry(null, 'old', 'old - desc', null, null),
                    new DictionaryEntry(null, 'both', 'both old - desc', null, null)
                ]);
            };
            $scope.showInputSuccessConfirmation = false;
            $scope.importInput.data = 'input-data';
            spyOn(dao, 'saveDictionary').and.callThrough();
            $scope.importAndKeep(input);
        });

        it('saves the dictionary', () => {
            expect(dao.saveDictionary).toHaveBeenCalledWith(
                [
                    new DictionaryEntry(null, 'old', 'old - desc', null, null),
                    new DictionaryEntry(null, 'both', 'both old - desc', null, null),
                    new DictionaryEntry(null, 'new', 'new - desc', null, null)
                ],
                jasmine.any(Function)
            );
        });

        it('shows confirmation', () => {
            expect($scope.showInputSuccessConfirmation).toBe(true);
        });

        it('resets input data', () => {
            expect($scope.importInput.data).toEqual('');
        });
    });

    describe('importAndOverwrite', () => {
        let input;

        beforeEach(() => {
            input = [
                new DictionaryEntry(null, 'new', 'new - desc', null, null),
                new DictionaryEntry(null, 'both', 'both new - desc', null, null)
            ];
            dao.getDictionary = function(callback: (dictionary: Array<DictionaryEntry>) => void) {
                callback([
                    new DictionaryEntry(null, 'old', 'old - desc', null, null),
                    new DictionaryEntry(null, 'both', 'both old - desc', null, null)
                ]);
            };
            $scope.showInputSuccessConfirmation = false;
            $scope.importInput.data = 'input-data';
            spyOn(dao, 'saveDictionary').and.callThrough();
            $scope.importAndOverwrite(input);
        });

        it('saves the dictionary', () => {
            expect(dao.saveDictionary).toHaveBeenCalledWith(
                [
                    new DictionaryEntry(null, 'old', 'old - desc', null, null),
                    new DictionaryEntry(null, 'both', 'both new - desc', null, null),
                    new DictionaryEntry(null, 'new', 'new - desc', null, null)
                ],
                jasmine.any(Function)
            );
        });

        it('shows confirmation', () => {
            expect($scope.showInputSuccessConfirmation).toBe(true);
        });

        it('resets input data', () => {
            expect($scope.importInput.data).toEqual('');
        });
    });
});
