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
});