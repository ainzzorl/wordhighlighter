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
                $scope.tableParams = new NgTableParams({
                    count: $scope.dictionary.length // hide pager
                }, {
                    dataset: $scope.dictionary,
                    counts: [] // hide page sizes
                });
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

        load();
    });
}
