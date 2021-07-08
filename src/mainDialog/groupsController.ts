///<reference path="../lib/common/dao.ts" />
///<reference path="../lib/common/dictionaryEntry.ts" />
///<reference path="../lib/common/settings.ts" />

angular
  .module('mainDialog')
  .controller(
    'groupsController',
    async function ($scope: any, NgTableParams: any, dao: DAO) {
      $scope.groups = [];
      $scope.newGroup = {
        value: '',
        description: '',
        scrictMatch: false,
        backgroundColor: 'ffff00',
      };
      $scope.showNewGroupForm = false;

      $scope.colorPickerOptions = {
        required: true,
        format: 'hex8',
        case: 'lower',
        hue: true,
        saturation: true,
        lightness: true,
        alpha: true,
        swatch: true,
        swatchBootstrap: true,
        swatchOnly: true,
        round: true,
        pos: 'bottom right',
        inputClass: 'form-control',
        close: {
          show: true,
          label: 'Close',
          class: '',
        },
        reset: {
          show: true,
          label: 'Reset',
          class: '',
        },
      };

      $scope.colorEventApi = {
        onChange: function () {
          $scope.save(true);
        },
        onClose: function () {
          $scope.save(true);
        },
        onClear: function () {
          $scope.save(true);
        },
        onReset: function () {
          $scope.save(true);
        },
      };

      $scope.DELETE_DISABLED_GROUP_ID = Group.DEFAULT_GROUP_ID;

      $scope.load = async function () {
        return dao.getGroups().then((groups: Array<Group>) => {
          $scope.groups = groups;
          $scope.$apply();
        });
      };

      $scope.deleteGroup = async function (id: number) {
        $scope.groups = $scope.groups.filter((group: Group) => group.id !== id);
        await dao.saveGroups($scope.groups);
        $scope.$apply();
      };

      $scope.save = async (isValid: boolean) => {
        if (isValid) {
          return dao.saveGroups($scope.groups);
        }
      };

      $scope.onAddNewGroupClicked = async function () {
        let name: string = $scope.newGroup.name.trim();
        if (name) {
          await dao
            .addGroup(name, $scope.newGroup.backgroundColor)
            .then((group: Group) => {
              $scope.groups.push(group);
            });
          $scope.newGroup.name = '';
          $scope.newGroup.backgroundColor = Settings.DEFAULT_BACKGROUND_COLOR;
          $scope.newGroupForm.$setPristine();
          $scope.showNewGroupForm = false;
          $scope.$apply();
        }
      };
      await $scope.load();
    }
  );
