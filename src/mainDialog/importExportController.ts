///<reference path="../lib/common/dao.ts" />
///<reference path="../lib/common/dictionaryEntry.ts" />
///<reference path="../../node_modules/@types/papaparse/index.d.ts" />

angular
  .module('mainDialog')
  .controller('importExportController', function ($scope: any, dao: DAO) {
    $scope.MODE_KEEP = 'keep';
    $scope.MODE_OVERWRITE = 'overwrite';
    $scope.MODE_REPLACE = 'replace';

    $scope.importInput = {
      data: '',
      mode: $scope.MODE_KEEP,
      format: 'ssv',
    };

    $scope.showInputSuccessConfirmation = false;
    $scope.showImportError = false;
    $scope.importError = '';

    $scope.placeholders = {
      csv: 'word,description\ncat,A small domesticated carnivorous mammal.',
      json: '{"words": [\n  {"word": "cat",  "description": "A small domesticated carnivorous mammal."}]\n}',
      ssv: 'cat;A small domesticated carnivorous mammal.',
    };

    $scope.onImportClicked = async function () {
      $scope.showImportError = false;
      $scope.importError = '';
      $scope
        .parseInput($scope.importInput.format)
        .then((input: Array<DictionaryEntry>) => {
          $scope.showInputSuccessConfirmation = false;
          $scope.dupes = $scope.getDuplicateEntries(input);
          if ($scope.dupes.length > 0) {
            return;
          }
          switch ($scope.importInput.mode) {
            case $scope.MODE_KEEP:
              $scope.importAndKeep(input);
              break;
            case $scope.MODE_REPLACE:
              $scope.importAsReplacement(input);
              break;
            case $scope.MODE_OVERWRITE:
              $scope.importAndOverwrite(input);
              break;
          }
        })
        .catch((e: any) => {
          $scope.importError = e.toString();
          $scope.showImportError = true;
        });
    };

    $scope.getExportString = function (format: string): Promise<string> {
      switch (format) {
        case 'json': {
          return getJsonExportString();
        }
        case 'csv': {
          return getCsvExportString();
        }
        default: {
          return new Promise(function (_resolve, reject) {
            reject(`Unknown format: ${format}`);
          });
        }
      }
    };

    $scope.onExportClicked = function (format: string) {
      $scope.getExportString(format).then((exportString: string) => {
        let a = document.createElement('a');
        let dataURI = 'data:' + format + ';base64,' + btoa(exportString);
        a.href = dataURI;
        a['download'] = 'word-highlighter-export-TODO.' + format;
        a.click();
      });
    };

    function getJsonExportString(): Promise<string> {
      return new Promise(function (resolve, _reject) {
        dao.getDictionary(function (dictionary: Array<DictionaryEntry>) {
          let jsonData: any = {};
          jsonData.words = dictionary.map((entry) => {
            return {
              word: entry.value,
              description: entry.description,
              strict: entry.strictMatch,
              createdAt: entry.createdAt,
              updatedAt: entry.updatedAt,
            };
          });
          resolve(JSON.stringify(jsonData));
        });
      });
    }

    function getCsvExportString(): Promise<string> {
      return new Promise(function (resolve, _reject) {
        let csvData: Array<Array<string>> = [];
        // Header
        csvData.push([
          'word',
          'description',
          'strict',
          'created at',
          'updated at',
        ]);
        dao.getDictionary(function (dictionary: Array<DictionaryEntry>) {
          csvData = csvData.concat(
            dictionary.map((entry) => {
              return [
                entry.value,
                entry.description,
                entry.strictMatch.toString(),
                entry.createdAt.toString(),
                entry.updatedAt.toString(),
              ];
            })
          );
          resolve(Papa.unparse(csvData));
        });
      });
    }

    $scope.parseInput = function (
      format: string
    ): Promise<Array<DictionaryEntry>> {
      switch (format) {
        case 'ssv': {
          return parseSsv($scope.importInput.data);
        }
        case 'csv': {
          return parseCsv($scope.importInput.data);
        }
        case 'json': {
          return parseJson($scope.importInput.data);
        }
        default: {
          return Promise.reject(`Unexpected format: ${format}`);
        }
      }
    };

    function parseSsv(input: string): Promise<Array<DictionaryEntry>> {
      return new Promise(function (resolve, _reject) {
        let result: Array<DictionaryEntry> = [];
        let lines = input.split('\n');
        lines.forEach(function (line: string) {
          line = line.trim();
          if (!line) {
            return;
          }
          let semicolumnIndex = line.indexOf(';');
          if (semicolumnIndex < 0) {
            result.push(
              new DictionaryEntry(null, line, '', new Date(), new Date())
            );
            return;
          }
          let word = line.substring(0, semicolumnIndex).trim();
          let description = line.substring(semicolumnIndex + 1).trim();
          result.push(
            new DictionaryEntry(null, word, description, new Date(), new Date())
          );
        });
        resolve(result);
      });
    }

    function parseCsv(input: string): Promise<Array<DictionaryEntry>> {
      return new Promise(function (resolve, reject) {
        let parsed = Papa.parse<Array<string>>($scope.importInput.data);
        if (parsed.errors.length > 0) {
          parsed.errors[0].message;
          reject(parsed.errors.map((e) => e.message).join('\n'));
          return;
        }
        let data = parsed.data;
        let validHeader = true;
        if (data.length === 0) {
          validHeader = false;
        } else {
          let header = data[0];
          if (header.length >= 1 && header[0] != 'word') {
            validHeader = false;
          } else {
            if (header.length >= 2 && header[1] != 'description') {
              validHeader = false;
            } else {
              if (header.length >= 3 && header[2] != 'strict') {
                validHeader = false;
              }
            }
          }
        }
        if (!validHeader) {
          reject(
            'Unexpected columns. Expected columns: word[,description[,strict]]'
          );
          return;
        }
        resolve(
          data
            .slice(1)
            .filter((row) => {
              return row.length > 0;
            })
            .map((row: Array<string>) => {
              let word = row[0];
              let description = row.length >= 2 ? row[1] : '';
              let strict = row.length >= 3 ? row[2] === 'true' : false;
              return new DictionaryEntry(
                null,
                word,
                description,
                new Date(),
                new Date(),
                strict
              );
            })
        );
      });
    }

    function parseJson(input: string): Promise<Array<DictionaryEntry>> {
      return new Promise(function (resolve, reject) {
        let parsed: any = JSON.parse($scope.importInput.data);
        if (!('words' in parsed)) {
          reject('Key not found: "words"');
          return;
        }
        let failed = false;
        let result = parsed['words'].map((wordData: any) => {
          if (failed) {
            return;
          }
          if (!('word' in wordData)) {
            reject('Key not found: "word"');
            failed = true;
            return;
          }
          let word = wordData['word'];
          let description =
            'description' in wordData ? wordData['description'] : '';
          let strict =
            'strict' in wordData
              ? wordData['strict'] === true || wordData['strict'] === 'true'
              : false;
          return new DictionaryEntry(
            null,
            word,
            description,
            new Date(),
            new Date(),
            strict
          );
        });
        if (!failed) {
          resolve(result);
        }
      });
    }

    // Assumes that all words are trimmed already (should be done by parseInput)
    $scope.getDuplicateEntries = function (
      entries: Array<DictionaryEntry>
    ): Array<string> {
      let result: Array<string> = [];
      let found: { [key: string]: number } = {};
      entries.forEach(function (entry: DictionaryEntry) {
        let word = entry.value.toLowerCase();
        let pastCount: number = found[word];
        if (pastCount === 1) {
          result.push(entry.value);
          found[word] = pastCount + 1;
        } else {
          if (pastCount !== undefined) {
            found[word] = pastCount + 1;
          } else {
            found[word] = 1;
          }
        }
      });
      return result;
    };

    $scope.importAsReplacement = function (entries: Array<DictionaryEntry>) {
      dao.saveDictionary(entries, onSuccess);
    };

    $scope.importAndKeep = function (newEntries: Array<DictionaryEntry>) {
      dao.getDictionary(function (dictionary: Array<DictionaryEntry>) {
        newEntries.forEach(function (newEntry: DictionaryEntry) {
          let exists = dictionary.some(function (
            existingEntry: DictionaryEntry
          ): boolean {
            return existingEntry.value === newEntry.value;
          });
          if (!exists) {
            dictionary.push(newEntry);
          }
        });
        dao.saveDictionary(dictionary, onSuccess);
      });
    };

    $scope.importAndOverwrite = function (newEntries: Array<DictionaryEntry>) {
      dao.getDictionary(function (dictionary: Array<DictionaryEntry>) {
        newEntries.forEach(function (newEntry: DictionaryEntry) {
          let exists = false;
          dictionary.forEach(function (existingEntry: DictionaryEntry) {
            if (existingEntry.value === newEntry.value) {
              exists = true;
              existingEntry.description = newEntry.description;
              existingEntry.updatedAt = newEntry.updatedAt;
            }
          });
          if (!exists) {
            dictionary.push(newEntry);
          }
        });
        dao.saveDictionary(dictionary, onSuccess);
      });
    };

    function onSuccess() {
      $scope.showInputSuccessConfirmation = true;
      $scope.importInput.data = '';
      $scope.$apply();
    }
  });
