///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../node_modules/@types/angular/index.d.ts" />
///<reference path="../../src/lib/common/dictionaryEntry.ts" />
///<reference path="../../src/lib/common/group.ts" />

declare let inject: any;

describe('wordsController', () => {
  let controller;
  let $scope: any;
  let dao;
  let NgTableParams;
  let dictionaryEntryForm;

  let mod: any = module;
  beforeEach(mod('mainDialog'));

  beforeEach(() => {
    dao = {
      getDictionary: function () {
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
      },
      getGroups: function () {
        let result = [
          new Group(1, 'group-1', 'color-1', MatchingType.SMART, 'language-1'),
          new Group(2, 'group-2', 'color-2', MatchingType.SMART, 'language-2'),
          new Group(3, 'group-3', 'color-3', MatchingType.SMART, 'language-3'),
        ];
        return Promise.resolve(result);
      },
      addEntry(value: string, description: string, strictMatch: boolean) {
        return Promise.resolve(
          new DictionaryEntry(
            1,
            value,
            description,
            new Date(),
            new Date(),
            strictMatch
          )
        );
      },
      saveDictionary(_dictionary: Array<DictionaryEntry>) {
        return Promise.resolve();
      },
    };
    NgTableParams = () => {
      return {
        reload: () => {},
      };
    };
    dictionaryEntryForm = {
      $setPristine: () => {},
    };
  });

  beforeEach(
    async () =>
      await inject(async function ($controller, $rootScope) {
        $scope = $rootScope.$new();
        controller = await $controller('wordsController', {
          $scope: $scope,
          NgTableParams: NgTableParams,
          dao: dao,
        });
      })
  );

  describe('load', () => {
    beforeEach(async () => {
      await $scope.load();
    });

    it('loads the dictionary', () => {
      expect(
        $scope.dictionary.map(function (de: DictionaryEntry) {
          return de.value;
        })
      ).toEqual(['word1', 'word2', 'word3']);
    });

    it('loads groups', () => {
      expect(
        $scope.groups.map(function (g: Group) {
          return g.name;
        })
      ).toEqual(['group-1', 'group-2', 'group-3']);
    });

    it('loads group id to name map', () => {
      expect($scope.groupIdToName[1]).toEqual('group-1');
      expect($scope.groupIdToName[2]).toEqual('group-2');
      expect($scope.groupIdToName[3]).toEqual('group-3');
    });

    it('makes a copy of the original data', () => {
      expect($scope.originalData).toEqual($scope.dictionary);
    });
  });

  describe('onAddNewWordClicked', () => {
    beforeEach(() => {
      $scope.newWordForm = {
        $setPristine: () => {},
      };
      spyOn($scope.tableParams, 'reload').and.callThrough();
      spyOn($scope.newWordForm, '$setPristine').and.callThrough();
      spyOn(dao, 'addEntry').and.callThrough();
      $scope.dictionary = [];
    });

    describe('new word is not empty', () => {
      describe('not dupe', () => {
        beforeEach(async () => {
          $scope.newWord = {
            value: 'new-word-value',
            description: 'new-word-description',
            strictMatch: true,
            group: '123',
          };
          $scope.showAddingDupeError = true;
          await $scope.onAddNewWordClicked();
        });

        it('persists the new entry', () => {
          expect(dao.addEntry).toHaveBeenCalledWith(
            'new-word-value',
            'new-word-description',
            true,
            123
          );
        });

        it('adds the new entry to the table', () => {
          expect($scope.dictionary.length).toEqual(1);
          expect($scope.dictionary[0].value).toEqual('new-word-value');
          expect($scope.dictionary[0].description).toEqual(
            'new-word-description'
          );
          expect($scope.dictionary[0].strictMatch).toBe(true);
        });

        it('reloads the table', () => {
          expect($scope.tableParams.reload).toHaveBeenCalled();
        });

        it('resets the word', () => {
          expect($scope.newWord.value).toEqual('');
          expect($scope.newWord.description).toEqual('');
          expect($scope.newWord.strictMatch).toBe(false);
          expect($scope.newWord.group).toBe(Group.DEFAULT_GROUP_ID.toString());
        });

        it('resets the form', () => {
          expect($scope.newWordForm.$setPristine).toHaveBeenCalled();
        });

        it('hides the error', () => {
          expect($scope.showAddingDupeError).toBe(false);
        });
      });

      describe('dupe', () => {
        beforeEach(() => {
          $scope.dictionary = [
            new DictionaryEntry(
              1,
              'new-word-value',
              '',
              new Date(),
              new Date()
            ),
          ];
          $scope.newWord = {
            value: 'new-word-value',
            description: 'new-word-description',
          };
          $scope.showAddingDupeError = false;
          $scope.onAddNewWordClicked();
        });

        it('does not persist the new entry', () => {
          expect(dao.addEntry).not.toHaveBeenCalled();
        });

        it('does not add the new entry to the table', () => {
          expect($scope.dictionary.length).toEqual(1);
        });

        it('does not reload the table', () => {
          expect($scope.tableParams.reload).not.toHaveBeenCalled();
        });

        it('does not reset the word', () => {
          expect($scope.newWord.value).toEqual('new-word-value');
          expect($scope.newWord.description).toEqual('new-word-description');
        });

        it('shows an error', () => {
          expect($scope.showAddingDupeError).toBe(true);
        });
      });
    });

    describe('new word is empty', () => {
      beforeEach(async () => {
        $scope.newWord = {
          value: '',
          description: 'new-word-desciption',
        };
        await $scope.onAddNewWordClicked();
      });

      it('does not add the new entry', () => {
        expect(dao.addEntry).not.toHaveBeenCalled();
      });

      it('does not reload the dictionary', () => {
        expect($scope.tableParams.reload).not.toHaveBeenCalled();
      });
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      spyOn($scope, 'load').and.callThrough();
      spyOn(dao, 'saveDictionary').and.callThrough();
      spyOn($scope.tableParams, 'reload').and.callThrough();

      $scope.dictionary = [];
      $scope.dictionary.push({ value: 'word1', id: 1 });
      $scope.dictionary.push({ value: 'word2', id: 2 });
      $scope.dictionary.push({ value: 'word3', id: 3 });

      $scope.delete($scope.dictionary[1]);
    });

    it('removes the word from the list', () => {
      expect(
        $scope.dictionary.map(function (de: any) {
          return de.value;
        })
      ).toEqual(['word1', 'word3']);
    });

    it('reloads the table', () => {
      expect($scope.tableParams.reload).toHaveBeenCalled();
    });

    it('persists the dictionary', () => {
      expect(dao.saveDictionary).toHaveBeenCalled();
    });
  });

  describe('cancel', () => {
    let originalValue: string;

    beforeEach(() => {
      spyOn(dictionaryEntryForm, '$setPristine').and.callThrough();

      originalValue = $scope.dictionary[1].value;
      $scope.dictionary[1].value += '-updated';
      $scope.dictionary[1].isEditing = true;
      $scope.dictionary[1].isDupe = true;

      $scope.cancel($scope.dictionary[1], dictionaryEntryForm);
    });

    it('resets the value', () => {
      expect($scope.dictionary[1].value).toEqual(originalValue);
    });

    it('sets the form pristine', () => {
      expect(dictionaryEntryForm.$setPristine).toHaveBeenCalled();
    });

    it('marks the row as not being edited', () => {
      expect($scope.dictionary[1].isEditing).toBe(false);
    });

    it('hides the dupe error', () => {
      expect($scope.dictionary[1].isDupe).toBe(false);
    });
  });

  describe('save', () => {
    beforeEach(() => {
      spyOn(dictionaryEntryForm, '$setPristine').and.callThrough();
      spyOn(dao, 'saveDictionary').and.callThrough();
    });

    describe('not dupe, changed', () => {
      beforeEach(async () => {
        $scope.dictionary[1].value += '-updated';
        $scope.dictionary[1].isEditing = true;
        $scope.dictionary[1].isDupe = true;
        $scope.dictionary[1].updatedAt = null;
        $scope.dictionary[1].groupIdStr = '456';

        await $scope.save($scope.dictionary[1], dictionaryEntryForm);
      });

      it('updates the original data', () => {
        expect($scope.originalData[1].value).toEqual(
          $scope.dictionary[1].value
        );
      });

      it('sets the form pristine', () => {
        expect(dictionaryEntryForm.$setPristine).toHaveBeenCalled();
      });

      it('marks the row as not being edited', () => {
        expect($scope.dictionary[1].isEditing).toBe(false);
      });

      it('persists the dictionary', () => {
        expect(dao.saveDictionary).toHaveBeenCalled();
      });

      it('hides the dupe error', () => {
        expect($scope.dictionary[1].isDupe).toBe(false);
      });

      it('updates the date', () => {
        expect($scope.dictionary[1].updatedAt).not.toBeNull();
      });

      it('updates the group id', () => {
        expect($scope.dictionary[1].groupId).toBe(456);
      });
    });

    describe('no dupe, did not change', () => {
      let originalData: string;
      let originalDate: Date;

      beforeEach(() => {
        originalData = $scope.originalData[1].value;
        originalDate = $scope.originalData[1].updatedAt;

        $scope.save($scope.dictionary[1], dictionaryEntryForm);
      });

      it('does not update the original data', () => {
        expect($scope.originalData[1].value).toEqual(originalData);
      });

      it('marks the row as not being edited', () => {
        expect($scope.dictionary[1].isEditing).toBe(false);
      });

      it('does not persist the dictionary', () => {
        expect(dao.saveDictionary).not.toHaveBeenCalled();
      });

      it('does not show the dupe error', () => {
        expect($scope.dictionary[1].isDupe).toBe(false);
      });

      it('does not update the date', () => {
        expect($scope.dictionary[1].updatedAt).toEqual(originalDate);
      });
    });

    describe('dupe', () => {
      let originalData: string;

      beforeEach(() => {
        $scope.dictionary[1].value = $scope.dictionary[2].value;
        $scope.dictionary[1].isEditing = true;
        $scope.dictionary[1].isDupe = false;
        originalData = $scope.originalData[1].value;

        $scope.save($scope.dictionary[1], dictionaryEntryForm);
      });

      it('does not update the original data', () => {
        expect($scope.originalData[1].value).toEqual(originalData);
      });

      it('does not set the form pristine', () => {
        expect(dictionaryEntryForm.$setPristine).not.toHaveBeenCalled();
      });

      it('does not mark the row as not being edited', () => {
        expect($scope.dictionary[1].isEditing).toBe(true);
      });

      it('does not persist the dictionary', () => {
        expect(dao.saveDictionary).not.toHaveBeenCalled();
      });

      it('shows the dupe error', () => {
        expect($scope.dictionary[1].isDupe).toBe(true);
      });
    });
  });

  describe('isDupe', () => {
    it('is true if the match is exacy', () => {
      expect($scope.isDupe('word1')).toBe(true);
    });

    it('is true if the match is exacy but in different case', () => {
      expect($scope.isDupe('WORD1')).toBe(true);
    });

    it('is false otherwise', () => {
      expect($scope.isDupe('word4')).toBe(false);
    });

    it('is false if the match is skipped', () => {
      expect($scope.isDupe('word1', 1)).toBe(false);
    });
  });
});
