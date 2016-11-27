///<reference path="../../node_modules/@types/angular/index.d.ts" />
///<reference path="dao.ts" />

if (typeof angular !== 'undefined') {
    let app = angular.module('wordhighlighter', ['ngTable']);

    app.controller('mainDialogController', function($scope: any, NgTableParams: any) {
        let dao = new DAO();

        $scope.dictionary = [];
        $scope.newWord = '';
        $scope.importAsReplacementContent = '';

        function load() {
            dao.getDictionary(function(dictionary: Array<DictionaryEntry>) {
                $scope.dictionary = dictionary;
                let count = 0;
                $scope.dictionary.forEach(function(e: any) {
                    e.id = count++;
                });
                $scope.tableParams = new NgTableParams({
                    count: $scope.dictionary.length // hide pager
                }, {
                    dataset: $scope.dictionary,
                    counts: [] // hide page sizes
                });
                $scope.originalData = angular.copy($scope.dictionary);
                $scope.$apply();
            });
        };

        $scope.onAddNewWordClicked = function() {
            if ($scope.newWord) {
                dao.addEntry(new DictionaryEntry($scope.newWord), function() {
                    load();
                });
                $scope.newWord = '';
            }
        };

        $scope.onImportAsReplacementClicked = function() {
            if (!$scope.importAsReplacementContent) {
                return;
            }
            let newDictionary = $scope.importAsReplacementContent
                .split('\n')
                .map(function(w: string) { return w.trim(); })
                .filter(function(w: string) { return w; })
                .map(function(w: string) { return new DictionaryEntry(w); });

            dao.saveDictionary(newDictionary, function() {
                load();
            });

            $scope.importAsReplacementContent = '';
        };

        $scope.cancel = function(row: any, rowForm: any) {
            let originalRow = $scope.resetRow(row, rowForm);
            angular.extend(row, originalRow);
        };

        $scope.del = function(row: any) {
            $scope.tableParams.settings().dataset = $scope.tableParams.settings().dataset.filter(function(e: any) {
                return e.id !== row.id;
            });
            $scope.tableParams.reload();
            dao.saveDictionary($scope.tableParams.settings().dataset, function() {});
        };

        $scope.resetRow = function(row: any, rowForm: any) {
            row.isEditing = false;
            rowForm.$setPristine();
            return $scope.originalData.find(function(or: any) {
                return or.id === row.id;
            });
        };

        $scope.save = function(row: any, rowForm: any) {
            let originalRow = $scope.resetRow(row, rowForm);
            angular.extend(originalRow, row);
            dao.saveDictionary($scope.tableParams.settings().dataset, function() {});
        };

        load();
    });
}
