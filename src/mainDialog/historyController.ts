///<reference path="../lib/common/dao.ts" />

// TODO: unit test

angular
.module('mainDialog')
.controller('historyController', function($scope: any, dao: DAO) {

    $scope.load = function() {
        dao.getHighlightingLog(function(highlightingLog: HighlightingLog) {
            $scope.highlightingLog = highlightingLog;
            $scope.content = JSON.stringify($scope.highlightingLog.entries);
            $scope.$apply();
        });
    };

    $scope.load();
});
