///<reference path="../lib/common/dao.ts" />
///<reference path="../lib/common/logger.ts" />

const DEFAULT_TAB = 'words';

let app = angular.module('mainDialog', ['ngTable', 'color.picker']);

app.service('dao', function () {
  return new DAO();
});

app.run(function ($rootScope: any) {
  $rootScope.currentTab = DEFAULT_TAB;
});
