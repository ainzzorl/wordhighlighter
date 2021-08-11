///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../node_modules/@types/angular/index.d.ts" />
///<reference path="../../src/lib/common/group.ts" />
///<reference path="../../src/lib/common/settings.ts" />

describe('groupsController', () => {
  let controller: any;
  let $scope: any;
  let dao: any;

  let mod: any = module;
  beforeEach(mod('mainDialog'));

  beforeEach(() => {
    dao = {
      getGroups: function () {
        let result = [];
        result.push(
          new Group(
            Group.DEFAULT_GROUP_ID,
            'group-1-name',
            'group-1-color',
            MatchingType.SMART,
            'group-1-language'
          )
        );
        result.push(
          new Group(
            Group.DEFAULT_GROUP_ID + 1,
            'group-2-name',
            'group-2-color',
            MatchingType.SMART,
            'group-2-language'
          )
        );
        result.push(
          new Group(
            Group.DEFAULT_GROUP_ID + 2,
            'group-3-name',
            'group-3-color',
            MatchingType.SMART,
            'group-3-language'
          )
        );
        return Promise.resolve(result);
      },
      addGroup(
        name: string,
        backgroundColor: string,
        matchingType: MatchingType,
        smartMatchingLanguage: string
      ) {
        return Promise.resolve(
          new Group(
            1,
            name,
            backgroundColor,
            matchingType,
            smartMatchingLanguage
          )
        );
      },
      saveGroups(_groups: Array<Group>) {
        return Promise.resolve();
      },
    };
  });

  beforeEach(
    async () =>
      await inject(async function ($controller: any, $rootScope: any) {
        $scope = $rootScope.$new();
        controller = await $controller('groupsController', {
          $scope: $scope,
          dao: dao,
        });
      })
  );

  beforeEach(async () => {
    $scope.newGroupForm = {
      $setPristine: () => {},
    };
  });

  describe('load', () => {
    beforeEach(async () => {
      await $scope.load();
    });

    it('loads groups', () => {
      expect(
        $scope.groups.map(function (g: Group) {
          return g.name;
        })
      ).toEqual(['group-1-name', 'group-2-name', 'group-3-name']);
    });
  });

  describe('onAddNewGroupClicked', () => {
    beforeEach(() => {
      spyOn($scope.newGroupForm, '$setPristine').and.callThrough();
      spyOn(dao, 'addGroup').and.callThrough();
      $scope.groups = [];
      $scope.showNewGroupForm = true;
    });

    describe('new group name is not empty', () => {
      beforeEach(async () => {
        $scope.newGroup = {
          name: 'new-group-name',
          backgroundColor: 'new-group-background-color',
          matchingType: MatchingType.STRICT,
          smartMatchingLanguage: 'new-group-smart-matching-language',
        };
        await $scope.onAddNewGroupClicked();
      });

      it('persists the new group', () => {
        expect(dao.addGroup).toHaveBeenCalledWith(
          'new-group-name',
          'new-group-background-color',
          MatchingType.STRICT,
          'new-group-smart-matching-language'
        );
      });

      it('adds the new group to the list', () => {
        expect($scope.groups.length).toEqual(1);
        expect($scope.groups[0].name).toEqual('new-group-name');
        expect($scope.groups[0].backgroundColor).toEqual(
          'new-group-background-color'
        );
        expect($scope.groups[0].matchingType).toBe(MatchingType.STRICT);
        expect($scope.groups[0].smartMatchingLanguage).toEqual(
          'new-group-smart-matching-language'
        );
      });

      it('resets the group', () => {
        expect($scope.newGroup.name).toEqual('');
        expect($scope.newGroup.backgroundColor).toEqual(
          Settings.DEFAULT_BACKGROUND_COLOR
        );
        expect($scope.newGroup.matchingType).toEqual(
          Group.DEFAULT_MATCHING_TYPE
        );
        expect($scope.newGroup.smartMatchingLanguage).toEqual(
          Group.DEFAULT_SMART_MATCHING_LANGUAGE
        );
      });

      it('resets the form', () => {
        expect($scope.newGroupForm.$setPristine).toHaveBeenCalled();
      });

      it('hides the form', () => {
        expect($scope.showNewGroupForm).toBe(false);
      });
    });

    describe('new word is empty', () => {
      beforeEach(async () => {
        $scope.newGroup = {
          name: '',
          backgroundColor: 'new-group-background-color',
        };
        await $scope.onAddNewGroupClicked();
      });

      it('does not add the new group', () => {
        expect(dao.addGroup).not.toHaveBeenCalled();
      });
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      spyOn($scope, 'load').and.callThrough();
      spyOn(dao, 'saveGroups').and.callThrough();

      $scope.groups = [];
      $scope.groups.push({ name: 'group-1', id: 1 });
      $scope.groups.push({ name: 'group-2', id: 2 });
      $scope.groups.push({ name: 'group-3', id: 3 });

      $scope.deleteGroup(2);
    });

    it('removes the group from the list', () => {
      expect(
        $scope.groups.map(function (g: any) {
          return g.name;
        })
      ).toEqual(['group-1', 'group-3']);
    });

    it('persists the groups', () => {
      expect(dao.saveGroups).toHaveBeenCalledWith($scope.groups);
    });
  });

  describe('save', () => {
    beforeEach(async () => {
      spyOn(dao, 'saveGroups').and.callThrough();

      $scope.groups[0].name += '-updated';
      $scope.groups[0].backgroundColor += '-updated';
      $scope.groups[0].matchingType = !$scope.groups[0].matchingType;
      $scope.groups[0].smartMatchingLanguage += '-updated';

      await $scope.save(true);
    });

    it('persists the groups', () => {
      expect(dao.saveGroups).toHaveBeenCalledWith($scope.groups);
    });
  });
});
