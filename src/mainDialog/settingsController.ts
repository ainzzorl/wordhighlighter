///<reference path="../lib/dao.ts" />

angular
.module('mainDialog')
.controller('settingsController', function($scope: any, dao: DAO) {

    $scope.load = function() {
        dao.getSettings(function(settings: Settings) {
            $scope.settings = settings;
            $scope.$apply();
        });
    };

    $scope.save = function() {
        dao.saveSettings($scope.settings, function() {});
    };

    $scope.load();
});