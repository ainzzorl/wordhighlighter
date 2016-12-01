let app = angular.module('mainDialog', ['ngTable']);

app.service('dao', function() {
    return new DAO();
});

app
.run(function($rootScope: any) {
    $rootScope.currentTab = 'words';
});
