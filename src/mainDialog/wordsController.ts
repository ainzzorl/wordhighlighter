///<reference path="../lib/common/dao.ts" />
///<reference path="../lib/common/dictionaryEntry.ts" />

angular
  .module('mainDialog')
  .controller(
    'wordsController',
    function ($scope: any, NgTableParams: any, dao: DAO) {
      $scope.dictionary = [];
      $scope.newWord = {
        value: '',
        description: '',
        scrictMatch: false,
      };

      $scope.showAddingDupeError = false;

      $scope.load = function () {
        dao.getDictionary(function (dictionary: Array<DictionaryEntry>) {
          $scope.dictionary = dictionary;
          $scope.tableParams = new NgTableParams(
            {
              count: 1000000000, // hide pager
            },
            {
              dataset: $scope.dictionary,
              counts: [], // hide page sizes
            }
          );
          $scope.originalData = angular.copy($scope.dictionary);
          $scope.$apply();
        });
      };

      $scope.onAddNewWordClicked = function () {
        let newValue: string = $scope.newWord.value.trim();
        if (newValue) {
          if ($scope.isDupe(newValue)) {
            $scope.showAddingDupeError = true;
            return;
          }
          dao.addEntry(
            newValue,
            $scope.newWord.description,
            $scope.newWord.strictMatch,
            function (newEntry: DictionaryEntry) {
              $scope.dictionary.push(newEntry);
              $scope.tableParams.reload();
            }
          );
          $scope.newWord.value = '';
          $scope.newWord.description = '';
          $scope.newWord.strictMatch = false;
          $scope.showAddingDupeError = false;
          $scope.newWordForm.$setPristine();
        }
      };

      $scope.cancel = function (
        dictionaryEntry: any,
        dictionaryEntryForm: any
      ) {
        let originalRow = resetRow(dictionaryEntry, dictionaryEntryForm);
        angular.extend(dictionaryEntry, originalRow);
        dictionaryEntry.isDupe = false;
      };

      $scope.delete = function (dictionaryEntry: any) {
        $scope.dictionary.splice(findEntryIndexById(dictionaryEntry.id), 1);
        $scope.tableParams.reload();
        dao.saveDictionary($scope.dictionary, function () {});
      };

      $scope.save = function (dictionaryEntry: any, dictionaryEntryForm: any) {
        if ($scope.isDupe(dictionaryEntry.value, dictionaryEntry.id)) {
          dictionaryEntry.isDupe = true;
          return;
        }
        let originalRow = resetRow(dictionaryEntry, dictionaryEntryForm);
        if (changed(dictionaryEntry, originalRow)) {
          dictionaryEntry.touch();
          dao.saveDictionary($scope.dictionary, function () {});
        }
        angular.extend(originalRow, dictionaryEntry);
        dictionaryEntry.isDupe = false;
      };

      $scope.isDupe = function (
        word: string,
        skippedId: number = undefined
      ): boolean {
        for (let i = 0; i < $scope.dictionary.length; ++i) {
          if (
            $scope.dictionary[i].value &&
            $scope.dictionary[i].value.toUpperCase() === word.toUpperCase() &&
            (!skippedId || skippedId !== $scope.dictionary[i].id)
          ) {
            return true;
          }
        }
        return false;
      };

      let resetRow = function (dictionaryEntry: any, dictionaryEntryForm: any) {
        dictionaryEntry.isEditing = false;
        dictionaryEntry.isDeleting = false;
        dictionaryEntryForm.$setPristine();
        for (let i = 0; i < $scope.originalData.length; ++i) {
          if ($scope.originalData[i].id === dictionaryEntry.id) {
            return $scope.originalData[i];
          }
        }
        return null;
      };

      function findEntryIndexById(id: number): number {
        for (let i = 0; i < $scope.dictionary.length; ++i) {
          if ($scope.dictionary[i].id === id) {
            return i;
          }
        }
        return -1;
      }

      function changed(dictionaryEntry: any, originalRow: any) {
        return (
          dictionaryEntry.value !== originalRow.value ||
          dictionaryEntry.description !== originalRow.description ||
          dictionaryEntry.strictMatch !== originalRow.strictMatch
        );
      }

      $scope.load();
    }
  );
