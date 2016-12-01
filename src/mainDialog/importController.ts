angular
.module('mainDialog')
.controller('importController', function($scope: any) {
    $scope.importInput = {
        data: '',
        mode: 'keep'
    };

    $scope.onImportClicked = function() {
        console.log('Importing data, mode=' + $scope.importInput.mode);
        console.log($scope.importInput.data);
    };
});