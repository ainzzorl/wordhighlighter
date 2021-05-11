// TODO: unit test

angular.module('mainDialog').filter('toSafeHtml', [
  '$sce',
  function ($sce: any) {
    return function (text: string): string {
      let result = text ? text.replace(/\n/g, '<br>') : '';
      return $sce.trustAsHtml(result);
    };
  },
]);
