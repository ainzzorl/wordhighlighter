///<reference path="../lib/common/dao.ts" />
///<reference path="../lib/common/dictionaryEntry.ts" />
///<reference path="../../node_modules/@types/papaparse/index.d.ts" />

angular
  .module('mainDialog')
  .controller('importExportController', async function ($scope: any, dao: DAO) {
    $scope.MODE_KEEP = 'keep';
    $scope.MODE_OVERWRITE = 'overwrite';
    $scope.MODE_REPLACE = 'replace';

    $scope.importInput = {
      data: '',
      mode: $scope.MODE_KEEP,
      format: 'ssv',
      groupIdStr: Group.DEFAULT_GROUP_ID.toString(),
    };

    $scope.exportInput = {
      groupIdStr: '0',
    };

    $scope.showInputSuccessConfirmation = false;
    $scope.showImportError = false;
    $scope.importError = '';

    $scope.placeholders = {
      csv: 'word,description\ncat,A small domesticated carnivorous mammal.',
      json: '{"words": [\n  {"word": "cat",  "description": "A small domesticated carnivorous mammal."}]\n}',
      ssv: 'cat;A small domesticated carnivorous mammal.',
    };

    $scope.load = async function () {
      return dao.getGroups().then((groups: Array<Group>) => {
        $scope.groups = groups;
        $scope.$apply();
      });
    };

    $scope.onImportClicked = async function () {
      $scope.showImportError = false;
      $scope.importError = '';
      $scope.importInput.groupId = parseInt($scope.importInput.groupIdStr);
      $scope
        .parseInput($scope.importInput.format)
        .then((input: Array<DictionaryEntry>) => {
          $scope.showInputSuccessConfirmation = false;
          $scope.dupes = $scope.getDuplicateEntries(input);
          if ($scope.dupes.length > 0) {
            return;
          }
          input.forEach((entry: DictionaryEntry) => {
            entry.groupId = parseInt($scope.importInput.groupIdStr);
          });
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

    $scope.onExportClicked = function (format: string) {
      $scope.getBase64ExportString(format).then((exportString: string) => {
        let a = document.createElement('a');
        let dataURI = 'data:' + format + ';base64,' + exportString;
        a.href = dataURI;
        a['download'] = 'word-highlighter-export.' + format;
        a.click();
      });
    };

    $scope.getBase64ExportString = function (format: string): Promise<string> {
      return new Promise(function (resolve, _reject) {
        getExportString(format).then((exportString: string) => {
          resolve(btoa(toBinary(exportString)));
        });
      });
    };

    function getExportString(format: string): Promise<string> {
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
    }

    // convert a Unicode string to a string in which
    // each 16-bit unit occupies only one byte
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa#unicode_strings
    function toBinary(s: string) {
      const codeUnits = new Uint16Array(s.length);
      for (let i = 0; i < codeUnits.length; i++) {
        codeUnits[i] = s.charCodeAt(i);
      }
      let bytes = new Uint8Array(codeUnits.buffer);

      // The MDN page suggests simple
      // String.fromCharCode(...new Uint8Array(codeUnits.buffer));
      // But it fails if the string is too long.
      let binary = '';
      let len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return binary;
    }

    function getJsonExportString(): Promise<string> {
      return new Promise(function (resolve, _reject) {
        getWordsToExport().then((dictionary: Array<DictionaryEntry>) => {
          let jsonData: any = {};
          jsonData.words = dictionary.map((entry) => {
            return {
              word: entry.value,
              description: entry.description,
              strict: entry.strictMatch,
              createdAt: entry.createdAt,
              updatedAt: entry.updatedAt,
              groupId: entry.groupId,
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
          'group id',
        ]);
        getWordsToExport().then((dictionary: Array<DictionaryEntry>) => {
          csvData = csvData.concat(
            dictionary.map((entry) => {
              return [
                entry.value,
                entry.description,
                entry.strictMatch.toString(),
                entry.createdAt.toString(),
                entry.updatedAt.toString(),
                entry.groupId.toString(),
              ];
            })
          );
          resolve(Papa.unparse(csvData));
        });
      });
    }

    async function getWordsToExport(): Promise<Array<DictionaryEntry>> {
      let groupId = parseInt($scope.exportInput.groupIdStr);
      const dictionary = await dao.getDictionary();
      return dictionary.filter((entry) => {
        return groupId === 0 || entry.groupId === groupId;
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
      let found = new Map<string, number>();
      entries.forEach(function (entry: DictionaryEntry) {
        let word = entry.value.toLowerCase();
        let pastCount: number = found.get(word);
        if (pastCount === 1) {
          result.push(entry.value);
          found.set(word, pastCount + 1);
        } else {
          if (pastCount !== undefined) {
            found.set(word, pastCount + 1);
          } else {
            found.set(word, 1);
          }
        }
      });
      return result;
    };

    $scope.importAsReplacement = async function (
      entries: Array<DictionaryEntry>
    ) {
      return dao.saveDictionary(entries).then(onSuccess);
    };

    $scope.importAndKeep = async function (newEntries: Array<DictionaryEntry>) {
      return dao
        .getDictionary()
        .then((dictionary: Array<DictionaryEntry>) => {
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
          return dao.saveDictionary(dictionary);
        })
        .then(onSuccess);
    };

    $scope.importAndOverwrite = async function (
      newEntries: Array<DictionaryEntry>
    ) {
      return dao.getDictionary().then((dictionary: Array<DictionaryEntry>) => {
        newEntries.forEach(function (newEntry: DictionaryEntry) {
          let exists = false;
          dictionary.forEach(function (existingEntry: DictionaryEntry) {
            if (existingEntry.value === newEntry.value) {
              exists = true;
              existingEntry.description = newEntry.description;
              existingEntry.groupId = newEntry.groupId;
              existingEntry.updatedAt = newEntry.updatedAt;
            }
          });
          if (!exists) {
            dictionary.push(newEntry);
          }
        });
        return dao.saveDictionary(dictionary).then(onSuccess);
      });
    };

    function onSuccess() {
      $scope.showInputSuccessConfirmation = true;
      $scope.importInput.data = '';
      $scope.$apply();
    }

    await $scope.load();
  });
