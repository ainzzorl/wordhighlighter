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

      $scope.refresh = async function () {
        $scope.isIntervalValid = !isNaN($scope.interval.value);
        if (!$scope.isIntervalValid) {
          return;
        }
        $scope.interval.value = Number($scope.interval.value);

        let highlightingLog: HighlightingLog;
        return dao
          .getHighlightingLog()
          .then((hl: HighlightingLog) => {
            highlightingLog = hl;
            return dao.getDictionary();
          })
          .then((dictionary: Array<DictionaryEntry>) => {
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
      };

      function populateTableData(
        dictionary: Array<DictionaryEntry>,
        highlightingLog: HighlightingLog
      ) {
        let totals = new Map<number, number>(); // dictionary entry id -> total highlight count.
        let pages = new Map<number, Map<string, number>>(); // dictionary entry id -> url -> 1.
        let now = new Date();
        for (let i = highlightingLog.entries.length - 1; i >= 0; i--) {
          let highlightingLogEntry = highlightingLog.entries[i];
          let daysAgo =
            (now.getTime() - highlightingLogEntry.date.getTime()) /
            $scope.MILLISECONDS_IN_DAY;
          if (daysAgo > $scope.interval.value) {
            break;
          }
          Array.from(highlightingLogEntry.highlights.keys()).forEach(
            (dictionaryEntryId: number) => {
              let total = totals.get(dictionaryEntryId) || 0;
              totals.set(
                dictionaryEntryId,
                total + highlightingLogEntry.highlights.get(dictionaryEntryId)
              );
              let wordPages =
                pages.get(dictionaryEntryId) || new Map<string, number>();
              wordPages.set(highlightingLogEntry.url, 1);
              pages.set(dictionaryEntryId, wordPages);
            }
          );
        }
        return dictionary.map((dictionaryEntry: DictionaryEntry) => {
          return {
            word: dictionaryEntry.value,
            total: totals.get(dictionaryEntry.id) || 0,
            uniquePages: pages.has(dictionaryEntry.id)
              ? pages.get(dictionaryEntry.id).size
              : 0,
          };
        });
      }

      $scope.refresh();
    }
  );
