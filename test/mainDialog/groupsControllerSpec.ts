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
            'group-1-language',
            ['blocked-1.example.com'],
            ['allowed-1.example.com']
          )
        );
        result.push(
          new Group(
            Group.DEFAULT_GROUP_ID + 1,
            'group-2-name',
            'group-2-color',
            MatchingType.SMART,
            'group-2-language',
            ['blocked-2.example.com'],
            ['allowed-2.example.com']
          )
        );
        result.push(
          new Group(
            Group.DEFAULT_GROUP_ID + 2,
            'group-3-name',
            'group-3-color',
            MatchingType.SMART,
            'group-3-language',
            ['blocked-3.example.com'],
            ['allowed-3.example.com']
          )
        );
        return Promise.resolve(result);
      },
      addGroup(
        name: string,
        backgroundColor: string,
        matchingType: MatchingType,
        matchingLanguage: string,
        blockedWebsites: Array<string>,
        allowedWebsites: Array<string>
      ) {
        return Promise.resolve(
          new Group(
            1,
            name,
            backgroundColor,
            matchingType,
            matchingLanguage,
            blockedWebsites,
            allowedWebsites
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
          matchingLanguage: 'new-group-smart-matching-language',
          blockedWebsitesStr:
            '\n  new-group-blocked-1 \n  new-group-blocked-2    \n',
          allowedWebsitesStr:
            '\n  new-group-allowed-1 \n  new-group-allowed-2    \n',
        };
        await $scope.onAddNewGroupClicked();
      });

      it('persists the new group', () => {
        expect(dao.addGroup).toHaveBeenCalledWith(
          'new-group-name',
          'new-group-background-color',
          MatchingType.STRICT,
          'new-group-smart-matching-language',
          ['new-group-blocked-1', 'new-group-blocked-2'],
          ['new-group-allowed-1', 'new-group-allowed-2']
        );
      });

      it('adds the new group to the list', () => {
        expect($scope.groups.length).toEqual(1);
        expect($scope.groups[0].name).toEqual('new-group-name');
        expect($scope.groups[0].backgroundColor).toEqual(
          'new-group-background-color'
        );
        expect($scope.groups[0].matchingType).toBe(MatchingType.STRICT);
        expect($scope.groups[0].matchingLanguage).toEqual(
          'new-group-smart-matching-language'
        );
        expect($scope.groups[0].blockedWebsites).toEqual([
          'new-group-blocked-1',
          'new-group-blocked-2',
        ]);
        expect($scope.groups[0].allowedWebsites).toEqual([
          'new-group-allowed-1',
          'new-group-allowed-2',
        ]);
      });

      it('resets the group', () => {
        expect($scope.newGroup.name).toEqual('');
        expect($scope.newGroup.backgroundColor).toEqual(
          Settings.DEFAULT_BACKGROUND_COLOR
        );
        expect($scope.newGroup.matchingType).toEqual(
          Group.DEFAULT_MATCHING_TYPE
        );
        expect($scope.newGroup.matchingLanguage).toEqual(
          Group.DEFAULT_MATCHING_LANGUAGE
        );
        expect($scope.newGroup.blockedWebsitesStr).toEqual('');
        expect($scope.newGroup.allowedWebsitesStr).toEqual('');
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
    let expected: any;

    beforeEach(async () => {
      spyOn(dao, 'saveGroups').and.callThrough();

      $scope.groups[0].name += '-updated';
      $scope.groups[0].backgroundColor += '-updated';
      $scope.groups[0].matchingType = !$scope.groups[0].matchingType;
      $scope.groups[0].matchingLanguage += '-updated';
      $scope.groups[0].blockedWebsitesStr =
        '\n  blocked-website-updated \n\n  ';
      $scope.groups[0].allowedWebsitesStr =
        '\n  allowed-website-updated \n\n  ';

      expected = angular.copy($scope.groups);
      expected[0].blockedWebsites = ['blocked-website-updated'];
      expected[0].allowedWebsites = ['allowed-website-updated'];
      await $scope.save(true);
    });

    it('persists the groups', () => {
      expect(dao.saveGroups).toHaveBeenCalledWith(expected);
    });
  });
});
