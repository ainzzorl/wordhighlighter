///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../node_modules/@types/angular/index.d.ts" />
///<reference path="../../src/lib/highlightingLog/highlightingLog.ts" />
///<reference path="../../src/lib/highlightingLog/highlightingLogEntry.ts" />

describe('historyController', () => {
  let controller;
  let $scope: any;
  let dao;
  let NgTableParams;

  let mod: any = module;
  beforeEach(mod('mainDialog'));

  beforeEach(() => {
    dao = {
      getDictionary: () => {
        return Promise.resolve([]);
      },
      getHighlightingLog: (callback: (log: HighlightingLog) => void) => {
        callback(new HighlightingLog());
      },
    };
    NgTableParams = () => {};
  });

  beforeEach(inject(($controller, $rootScope) => {
    $scope = $rootScope.$new();
    controller = $controller('historyController', {
      $scope: $scope,
      NgTableParams: NgTableParams,
      dao: dao,
    });
  }));

  describe('refresh', () => {
    describe('valid interval', () => {
      beforeEach(async () => {
        $scope.interval.value = '10';
        dao.getDictionary = () => {
          let result = [];
          result.push(
            new DictionaryEntry(1, 'word1', 'desc1', new Date(), new Date())
          );
          result.push(
            new DictionaryEntry(2, 'word2', 'desc2', new Date(), new Date())
          );
          result.push(
            new DictionaryEntry(3, 'word3', 'desc3', new Date(), new Date())
          );
          return Promise.resolve(result);
        };
        dao.getHighlightingLog = (callback: (log: HighlightingLog) => void) => {
          let entries: Array<HighlightingLogEntry> = [];
          // Outside of the interval.
          entries.push(
            new HighlightingLogEntry('example3.com', dateDaysAgo(20), {
              1: 10,
              2: 10,
              3: 10,
            })
          );
          // Inside the interval.
          entries.push(
            new HighlightingLogEntry('example2.com', dateDaysAgo(9), {
              2: 60,
            })
          );
          // Inside the interval.
          entries.push(
            new HighlightingLogEntry('example1.com', dateDaysAgo(5), {
              1: 1,
              2: 2,
            })
          );
          // Inside the interval.
          entries.push(
            new HighlightingLogEntry('example1.com', dateDaysAgo(1), {
              1: 10,
            })
          );
          callback(new HighlightingLog(entries));
        };
        await $scope.refresh();
      });

      it('populates data for the table', () => {
        expect($scope.tableData).toEqual([
          { word: 'word1', total: 11, uniquePages: 1 },
          { word: 'word2', total: 62, uniquePages: 2 },
          { word: 'word3', total: 0, uniquePages: 0 },
        ]);
      });

      it('marks interval as valid', () => {
        expect($scope.isIntervalValid).toBe(true);
      });
    });

    describe('invalid interval', () => {
      beforeEach(() => {
        $scope.interval.value = 'not-a-number';
        $scope.refresh();
      });

      it('marks interval as invalid valid', () => {
        expect($scope.isIntervalValid).toBe(false);
      });
    });
  });
});

function dateDaysAgo(days: number): Date {
  return new Date(new Date().getTime() - days * 1000 * 3600 * 24);
}
