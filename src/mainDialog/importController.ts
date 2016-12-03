///<reference path="../lib/dictionaryEntry.ts" />

angular
.module('mainDialog')
.controller('importController', function($scope: any) {

    $scope.MODE_KEEP = 'keep';
    $scope.MODE_OVERWRITE = 'overwrite';
    $scope.MODE_REPLACE = 'replace';

    $scope.importInput = {
        data: '',
        mode: $scope.MODE_KEEP
    };

    $scope.onImportClicked = function() {
        console.log('Importing data, mode=' + $scope.importInput.mode);
        console.log($scope.importInput.data);
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
});