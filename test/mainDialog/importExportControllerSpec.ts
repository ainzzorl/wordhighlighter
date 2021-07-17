///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../node_modules/@types/angular/index.d.ts" />
///<reference path="../../node_modules/@types/papaparse/index.d.ts" />
///<reference path="../../src/lib/common/dictionaryEntry.ts" />
///<reference path="../../src/lib/common/group.ts" />

describe('importExportController', () => {
  let controller;
  let $scope: any;
  let dao;
  let now = new Date();

  let mod: any = module;
  beforeEach(mod('mainDialog'));

  beforeEach(() => {
    dao = {
      async saveDictionary(_dictionary: Array<DictionaryEntry>) {
        return Promise.resolve();
      },
      async getGroups() {
        let result = [
          new Group(1, 'group-1', 'color-1'),
          new Group(2, 'group-2', 'color-2'),
          new Group(3, 'group-3', 'color-3'),
        ];
        return Promise.resolve(result);
      },
    };
  });

  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
    controller = $controller('importExportController', {
      $scope: $scope,
      dao: dao,
    });
  }));

  describe('load', () => {
    beforeEach(async () => {
      await $scope.load();
    });

    it('loads groups', () => {
      expect(
        $scope.groups.map(function (g: Group) {
          return g.name;
        })
      ).toEqual(['group-1', 'group-2', 'group-3']);
    });
  });

  describe('onImportClicked', () => {
    let input;

    beforeEach(() => {
      input = [new DictionaryEntry(null, 'word 1', '')];
      $scope.parseInput = () => {
        return Promise.resolve(input);
      };
    });

    describe('keep', () => {
      beforeEach(() => {
        $scope.importInput.mode = $scope.MODE_KEEP;
        spyOn($scope, 'importAndKeep');
      });

      describe('no dupes', () => {
        beforeEach(async () => {
          $scope.getDuplicateEntries = () => {
            return [];
          };
          await $scope.onImportClicked();
        });

        it('detects no dupes', () => {
          expect($scope.dupes).toEqual([]);
        });

        it('imports data', () => {
          expect($scope.importAndKeep).toHaveBeenCalled();
        });
      });

      describe('dupes', () => {
        beforeEach(async () => {
          $scope.getDuplicateEntries = () => {
            return ['dup'];
          };
          await $scope.onImportClicked();
        });

        it('detects dupes', () => {
          expect($scope.dupes).toEqual(['dup']);
        });

        it('does not import', () => {
          expect($scope.importAndKeep).not.toHaveBeenCalled();
        });

        it('shows no confirmation', () => {
          expect($scope.showInputSuccessConfirmation).toBe(false);
        });
      });
    });

    describe('replace', () => {
      beforeEach(async () => {
        $scope.importInput.mode = $scope.MODE_REPLACE;
        spyOn($scope, 'importAsReplacement');
        $scope.getDuplicateEntries = () => {
          return [];
        };
        await $scope.onImportClicked();
      });

      it('imports data', () => {
        expect($scope.importAsReplacement).toHaveBeenCalled();
      });
    });

    describe('overwrite', () => {
      beforeEach(async () => {
        $scope.importInput.mode = $scope.MODE_OVERWRITE;
        spyOn($scope, 'importAndOverwrite');
        $scope.getDuplicateEntries = () => {
          return [];
        };
        await $scope.onImportClicked();
      });

      it('imports data', () => {
        expect($scope.importAndOverwrite).toHaveBeenCalled();
      });
    });
  });

  describe('parseInput', () => {
    let result: Array<DictionaryEntry>;

    describe('ssv', () => {
      beforeEach(async () => {
        $scope.importInput.data =
          '' +
          'word1;description1' +
          '\n' + // word + description
          'word2' +
          '\n' + // no description
          'word3;description;3' +
          '\n' + // description with semicolumns
          '    ' +
          '\n' + // empty
          '    word   4  ;  description  4    '; // leading and trailing spaces
        result = await $scope.parseInput('ssv');
      });

      it('detects the number of entries', () => {
        expect(result.length).toEqual(4);
      });

      it('reads word + description', () => {
        expect(result[0].value).toEqual('word1');
        expect(result[0].description).toEqual('description1');
      });

      it('reads word with no description', () => {
        expect(result[1].value).toEqual('word2');
        expect(result[1].description).toEqual('');
      });

      it('reads description with semicolumns', () => {
        expect(result[2].value).toEqual('word3');
        expect(result[2].description).toEqual('description;3');
      });

      it('trims leading and trailing spaces', () => {
        expect(result[3].value).toEqual('word   4');
        expect(result[3].description).toEqual('description  4');
      });
    });

    describe('csv', () => {
      it('parses valid input', async () => {
        $scope.importInput.data =
          'word,description,strict\n' + 'word1,description1,true';
        result = await $scope.parseInput('csv');

        expect(result.length).toEqual(1);
        expect(result[0].value).toEqual('word1');
        expect(result[0].description).toEqual('description1');
        expect(result[0].strictMatch).toBe(true);
      });

      it('recognizes bad header', async () => {
        $scope.importInput.data =
          'word,blah,strict\n' + 'word1,description1,true';

        await $scope
          .parseInput('csv')
          .then(() => {
            fail('Expected parsing to fail');
          })
          .catch((error: string) => {
            expect(error).toEqual(
              'Unexpected columns. Expected columns: word[,description[,strict]]'
            );
          });
      });
    });

    describe('json', () => {
      it('parses valid input', async () => {
        $scope.importInput.data =
          '{"words": [\n  {"word": "word1",  "description": "description1", "strict": true}]\n}';
        result = await $scope.parseInput('json');

        expect(result.length).toEqual(1);
        expect(result[0].value).toEqual('word1');
        expect(result[0].description).toEqual('description1');
        expect(result[0].strictMatch).toBe(true);
      });

      it('handles parsing errors', async () => {
        $scope.importInput.data = 'not-valid-json';

        await $scope
          .parseInput('json')
          .then(() => {
            fail('Expected parsing to fail');
          })
          .catch((error: any) => {
            expect(error.toString()).toEqual(
              'SyntaxError: JSON Parse error: Unexpected identifier "not"'
            );
          });
      });

      it('handles wrong format', async () => {
        $scope.importInput.data =
          '{"blah": [\n  {"word": "word1",  "description": "description1", "strict": true}]\n}';

        await $scope
          .parseInput('json')
          .then(() => {
            fail('Expected parsing to fail');
          })
          .catch((exception) => {
            expect(exception).toEqual('Key not found: "words"');
          });
      });
    });
  });

  describe('getBase64ExportString', () => {
    let encoded: any;
    let decoded: any;
    let parsedDecoded: any;

    describe('json', () => {
      describe('basic', async () => {
        beforeEach(() => {
          dao.getDictionary = function () {
            return Promise.resolve([
              new DictionaryEntry(null, 'w', 'd', now, now, true, 123),
            ]);
          };
        });

        it('can be decoded', async () => {
          await process('json');
          expect(parsedDecoded['words'].length).toBe(1);
          expect(parsedDecoded['words'][0]['word']).toEqual('w');
          expect(parsedDecoded['words'][0]['description']).toEqual('d');
          expect(parsedDecoded['words'][0]['strict']).toBe(true);
          expect(parsedDecoded['words'][0]['groupId']).toBe(123);
          expect(parsedDecoded['words'][0]['createdAt']).not.toBeFalsy();
          expect(parsedDecoded['words'][0]['updatedAt']).not.toBeFalsy();
        });
      });

      describe('unicode', async () => {
        beforeEach(() => {
          dao.getDictionary = function () {
            return Promise.resolve([
              new DictionaryEntry(
                null,
                '你好 - привет - 😋',
                '',
                now,
                now,
                true,
                123
              ),
            ]);
          };
        });

        it('can be decoded', async () => {
          await process('json');
          expect(parsedDecoded['words'].length).toBe(1);
          expect(parsedDecoded['words'][0]['word']).toEqual(
            '你好 - привет - 😋'
          );
        });
      });

      describe('very long input', async () => {
        beforeEach(() => {
          dao.getDictionary = function () {
            let result = [];
            for (let i = 0; i < 10000; i++) {
              result.push(
                new DictionaryEntry(null, `word #${i}`, '', now, now, true, 123)
              );
            }
            return Promise.resolve(result);
          };
        });

        it('can be decoded', async () => {
          await process('json');
          expect(parsedDecoded['words'].length).toBe(10000);
          for (let i = 0; i < 10000; i++) {
            expect(parsedDecoded['words'][i]['word']).toEqual(`word #${i}`);
          }
        });
      });
    });

    describe('csv', () => {
      describe('basic', async () => {
        beforeEach(() => {
          dao.getDictionary = function () {
            return Promise.resolve([
              new DictionaryEntry(null, 'w', 'd', now, now, true, 123),
            ]);
          };
        });

        it('can be decoded', async () => {
          await process('csv');
          expect(parsedDecoded.length).toEqual(2);
          expect(parsedDecoded[0][0]).toEqual('word');
          expect(parsedDecoded[0][1]).toEqual('description');
          expect(parsedDecoded[0][2]).toEqual('strict');
          expect(parsedDecoded[0][3]).toEqual('created at');
          expect(parsedDecoded[0][4]).toEqual('updated at');
          expect(parsedDecoded[0][5]).toEqual('group id');
          expect(parsedDecoded[1][0]).toEqual('w');
          expect(parsedDecoded[1][1]).toEqual('d');
          expect(parsedDecoded[1][2]).toEqual('true');
          expect(parsedDecoded[1][3]).not.toBeFalsy();
          expect(parsedDecoded[1][4]).not.toBeFalsy();
          expect(parsedDecoded[1][5]).toEqual('123');
        });
      });
    });

    async function process(format: string) {
      await $scope
        .getBase64ExportString(format)
        .then((s: string) => {
          encoded = s;
          decoded = fromBinary(atob(encoded));
          if (format === 'json') {
            parsedDecoded = JSON.parse(decoded);
          } else if (format === 'csv') {
            parsedDecoded = Papa.parse(decoded).data;
          } else {
            fail(`Unknown format: ${format}`);
          }
        })
        .catch((e: any) => {
          fail(e);
        });
    }

    function fromBinary(binary: string) {
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      let arr = new Uint16Array(bytes.buffer);
      let res = '';
      for (let i = 0; i < arr.length; i++) {
        res += String.fromCharCode(arr[i]);
      }
      return res;
    }
  });

  describe('getDuplicateEntries', () => {
    let result: Array<string>;

    describe('contains duplicates', () => {
      beforeEach(() => {
        let input = [
          new DictionaryEntry(null, 'word 1', ''),
          new DictionaryEntry(null, 'word 1', ''),
          new DictionaryEntry(null, 'word 2', ''),
          new DictionaryEntry(null, 'word 1', ''),
          new DictionaryEntry(null, 'WoRd 2', ''),
          new DictionaryEntry(null, 'word 3', ''),
        ];
        result = $scope.getDuplicateEntries(input);
      });

      it('detects duplicates', () => {
        let lowercaseSortedResult = result
          .map((r: string) => {
            return r.toLowerCase();
          })
          .sort();
        expect(lowercaseSortedResult).toEqual(['word 1', 'word 2']);
      });
    });

    describe('no duplicates', () => {
      beforeEach(() => {
        let input = [
          new DictionaryEntry(null, 'word 1', ''),
          new DictionaryEntry(null, 'word 2', ''),
          new DictionaryEntry(null, 'word 3', ''),
        ];
        result = $scope.getDuplicateEntries(input);
      });

      it('detects no duplicates', () => {
        expect(result.length).toEqual(0);
      });
    });
  });

  describe('importAsReplacement', () => {
    let input;

    beforeEach(async () => {
      input = [
        new DictionaryEntry(null, 'word 1', 'desc 1', now, now, false, 123),
      ];
      spyOn(dao, 'saveDictionary').and.callThrough();
      $scope.showInputSuccessConfirmation = false;
      $scope.importInput.data = 'input-data';
      $scope.importInput.groupIdStr = '123';
      await $scope.importAsReplacement(input);
    });

    it('saves the dictionary', () => {
      expect(dao.saveDictionary).toHaveBeenCalledWith(input);
    });

    it('shows confirmation', () => {
      expect($scope.showInputSuccessConfirmation).toBe(true);
    });

    it('resets input data', () => {
      expect($scope.importInput.data).toEqual('');
    });
  });

  describe('importAndKeep', () => {
    let input;

    beforeEach(async () => {
      input = [
        new DictionaryEntry(null, 'new', 'new - desc', now, now, false, 123),
        new DictionaryEntry(
          null,
          'both',
          'both new - desc',
          now,
          now,
          false,
          123
        ),
      ];
      dao.getDictionary = function () {
        return Promise.resolve([
          new DictionaryEntry(null, 'old', 'old - desc', now, now),
          new DictionaryEntry(null, 'both', 'both old - desc', now, now),
        ]);
      };
      $scope.showInputSuccessConfirmation = false;
      $scope.importInput.data = 'input-data';
      $scope.importInput.groupIdStr = '123';
      spyOn(dao, 'saveDictionary').and.callThrough();
      await $scope.importAndKeep(input);
    });

    it('saves the dictionary', () => {
      expect(dao.saveDictionary).toHaveBeenCalledWith([
        new DictionaryEntry(null, 'old', 'old - desc', now, now),
        new DictionaryEntry(null, 'both', 'both old - desc', now, now),
        new DictionaryEntry(null, 'new', 'new - desc', now, now, false, 123),
      ]);
    });

    it('shows confirmation', () => {
      expect($scope.showInputSuccessConfirmation).toBe(true);
    });

    it('resets input data', () => {
      expect($scope.importInput.data).toEqual('');
    });
  });

  describe('importAndOverwrite', () => {
    let input;

    beforeEach(async () => {
      input = [
        new DictionaryEntry(null, 'new', 'new - desc', now, now, false, 123),
        new DictionaryEntry(
          null,
          'both',
          'both new - desc',
          now,
          now,
          false,
          123
        ),
      ];
      dao.getDictionary = function () {
        return Promise.resolve([
          new DictionaryEntry(null, 'old', 'old - desc', now, now),
          new DictionaryEntry(null, 'both', 'both old - desc', now, now),
        ]);
      };
      $scope.showInputSuccessConfirmation = false;
      $scope.importInput.data = 'input-data';
      $scope.importInput.groupIdStr = '123';
      spyOn(dao, 'saveDictionary').and.callThrough();
      await $scope.importAndOverwrite(input);
    });

    it('saves the dictionary', () => {
      expect(dao.saveDictionary).toHaveBeenCalledWith([
        new DictionaryEntry(null, 'old', 'old - desc', now, now),
        new DictionaryEntry(
          null,
          'both',
          'both new - desc',
          now,
          now,
          false,
          123
        ),
        new DictionaryEntry(null, 'new', 'new - desc', now, now, false, 123),
      ]);
    });

    it('shows confirmation', () => {
      expect($scope.showInputSuccessConfirmation).toBe(true);
    });

    it('resets input data', () => {
      expect($scope.importInput.data).toEqual('');
    });
  });
});
