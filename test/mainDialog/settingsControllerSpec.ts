///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../node_modules/@types/angular/index.d.ts" />
///<reference path="../../src/lib/common/settings.ts" />

describe('settingsController', () => {
  let controller: any;
  let $scope: any;
  let dao: any;

  let mod: any = module;
  beforeEach(mod('mainDialog'));

  beforeEach(() => {
    dao = {
      getSettings: () => {
        let settings: Settings = new Settings();
        settings.enableHighlighting = true;
        settings.timeout = 123;
        return Promise.resolve(settings);
      },
      saveSettings(_settings: Settings) {
        return Promise.resolve();
      },
    };
  });

  beforeEach(
    async () =>
      await inject(async function ($controller, $rootScope) {
        $scope = $rootScope.$new();
        controller = await $controller('settingsController', {
          $scope: $scope,
          dao: dao,
        });
      })
  );

  describe('load', () => {
    beforeEach(async () => {
      await $scope.load();
    });

    it('loads the settings', () => {
      expect($scope.settings.enableHighlighting).toBe(true);
      expect($scope.settings.timeout).toEqual(123);
    });
  });

  describe('save', () => {
    beforeEach(async () => {
      spyOn(dao, 'saveSettings').and.callThrough();
      $scope.settings = new Settings();
      $scope.settings.timeout = 456;
      $scope.settings.enableHighlighting = false;
      $scope.settings.enablePageStats = false;
      await $scope.save(true);
    });

    it('saves the settings', () => {
      expect(dao.saveSettings).toHaveBeenCalledWith($scope.settings);
    });
  });
});
