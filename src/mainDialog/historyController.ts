///<reference path="../lib/common/dao.ts" />

angular
  .module('mainDialog')
  .controller(
    'historyController',
    function ($scope: any, NgTableParams: any, dao: DAO) {
      $scope.DEFAULT_INTERVAL_DAYS = 30;
      $scope.interval = {
        value: $scope.DEFAULT_INTERVAL_DAYS,
      };
      $scope.MILLISECONDS_IN_DAY = 1000 * 3600 * 24;

      $scope.refresh = function () {
        $scope.isIntervalValid = !isNaN($scope.interval.value);
        if (!$scope.isIntervalValid) {
          return;
        }
        $scope.interval.value = Number($scope.interval.value);

        dao.getHighlightingLog(function (highlightingLog: HighlightingLog) {
          dao.getDictionary().then((dictionary: Array<DictionaryEntry>) => {
            $scope.tableData = populateTableData(dictionary, highlightingLog);
            $scope.tableParams = new NgTableParams(
              {
                sorting: { total: 'desc' },
                count: 1000000000, // hide pager
              },
              {
                dataset: $scope.tableData,
                counts: [], // hide page sizes
              }
            );
            $scope.$apply();
          });
        });
      };

      function populateTableData(
        dictionary: Array<DictionaryEntry>,
        highlightingLog: HighlightingLog
      ) {
        let totals: { [key: number]: number } = {}; // dictionary entry id -> total highlight count.
        let pages: { [key: number]: any } = {}; // dictionary entry id -> url -> 1.
        let now = new Date();
        for (let i = highlightingLog.entries.length - 1; i >= 0; i--) {
          let highlightingLogEntry = highlightingLog.entries[i];
          let daysAgo =
            (now.getTime() - highlightingLogEntry.date.getTime()) /
            $scope.MILLISECONDS_IN_DAY;
          if (daysAgo > $scope.interval.value) {
            break;
          }
          Object.keys(highlightingLogEntry.highlights).forEach(
            (dictionaryEntryIdStr) => {
              let dictionaryEntryId = Number(dictionaryEntryIdStr);
              let total: number = totals[dictionaryEntryId] || 0;
              totals[dictionaryEntryId] =
                total + highlightingLogEntry.highlights[dictionaryEntryId];
              let wordPages: any = pages[dictionaryEntryId] || {};
              wordPages[highlightingLogEntry.url] = 1;
              pages[dictionaryEntryId] = wordPages;
            }
          );
        }
        return dictionary.map((dictionaryEntry: DictionaryEntry) => {
          return {
            word: dictionaryEntry.value,
            total: totals[dictionaryEntry.id] || 0,
            uniquePages: pages[dictionaryEntry.id]
              ? Object.keys(pages[dictionaryEntry.id]).length
              : 0,
          };
        });
      }

      $scope.refresh();
    }
  );
