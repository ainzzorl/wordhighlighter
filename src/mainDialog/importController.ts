///<reference path="../lib/dao.ts" />
///<reference path="../lib/dictionaryEntry.ts" />

angular
.module('mainDialog')
.controller('importController', function($scope: any, dao: DAO) {

    $scope.MODE_KEEP = 'keep';
    $scope.MODE_OVERWRITE = 'overwrite';
    $scope.MODE_REPLACE = 'replace';

    $scope.importInput = {
        data: '',
        mode: $scope.MODE_KEEP
    };

    $scope.showInputSuccessConfirmation = false;

    $scope.onImportClicked = function() {
        let input: Array<DictionaryEntry> = $scope.parseInput();
        $scope.showInputSuccessConfirmation = false;
        $scope.dupes = $scope.getDuplicateEntries(input);
        if ($scope.dupes.length > 0) {
            return;
        }
        switch ($scope.importInput.mode) {
            case $scope.MODE_KEEP:
                $scope.importAndKeep(input);
                break;
            case $scope.MODE_REPLACE:
                $scope.importAsReplacement(input);
                break;
            case $scope.MODE_OVERWRITE:
                $scope.importAndOverwrite(input);
                break;
        }
    };

    $scope.parseInput = function(): Array<DictionaryEntry> {
        let result: Array<DictionaryEntry> = [];
        let lines = $scope.importInput.data.split('\n');
        lines.forEach(function(line: string) {
            line = line.trim();
            if (!line) {
                return;
            }
            let semicolumnIndex = line.indexOf(';');
            if (semicolumnIndex < 0) {
                result.push(new DictionaryEntry(null, line, '', new Date(), new Date()));
                return;
            }
            let word = line.substring(0, semicolumnIndex).trim();
            let description = line.substring(semicolumnIndex + 1).trim();
            result.push(new DictionaryEntry(null, word, description, new Date(), new Date()));
        });
        return result;
    };

    // Assumes that all words are trimmed already (should be done by parseInput)
    // TODO: use sets to make it faster.
    $scope.getDuplicateEntries = function(entries: Array<DictionaryEntry>): Array<string> {
        let result: Array<string> = [];
        let found: Array<string> = [];
        entries.forEach(function(entry: DictionaryEntry) {
            let word = entry.value;
            if (found.indexOf(word) >= 0) {
                if (result.indexOf(word) < 0) {
                    result.push(word);
                }
            } else {
                found.push(word);
            }
        });
        return result;
    };

    $scope.importAsReplacement = function(entries: Array<DictionaryEntry>) {
        dao.saveDictionary(entries, onSuccess);
    };

    // TODO: optimize with sets
    $scope.importAndKeep = function(newEntries: Array<DictionaryEntry>) {
        dao.getDictionary(function(dictionary: Array<DictionaryEntry>) {
            newEntries.forEach(function(newEntry: DictionaryEntry) {
                let exists = dictionary.some(function(existingEntry: DictionaryEntry): boolean {
                    return existingEntry.value === newEntry.value;
                });
                if (!exists) {
                    dictionary.push(newEntry);
                };
            });
            dao.saveDictionary(dictionary, onSuccess);
        });
    };

    $scope.importAndOverwrite = function(newEntries: Array<DictionaryEntry>) {
        dao.getDictionary(function(dictionary: Array<DictionaryEntry>) {
            newEntries.forEach(function(newEntry: DictionaryEntry) {
                let exists = false;
                dictionary.forEach(function(existingEntry: DictionaryEntry) {
                    if (existingEntry.value === newEntry.value) {
                        exists = true;
                        existingEntry.description = newEntry.description;
                        existingEntry.updatedAt = newEntry.updatedAt;
                    };
                });
                if (!exists) {
                    dictionary.push(newEntry);
                };
            });
            dao.saveDictionary(dictionary, onSuccess);
        });
    };

    function onSuccess() {
        $scope.showInputSuccessConfirmation = true;
        $scope.importInput.data = '';
        $scope.$apply();
    }
});