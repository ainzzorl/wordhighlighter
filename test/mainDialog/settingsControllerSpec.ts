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
        settings.showTooltip = ShowTooltip.ALWAYS;
        settings.blockedWebsites = ['blocked.example.com'];
        settings.allowedWebsites = ['allowed.example.com'];
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
      expect($scope.settings.showTooltip).toEqual(ShowTooltip.ALWAYS);
      expect($scope.settings.blockedWebsites).toEqual(['blocked.example.com']);
      expect($scope.settings.allowedWebsites).toEqual(['allowed.example.com']);
    });
  });

  describe('save', () => {
    let expected: any;

    beforeEach(async () => {
      spyOn(dao, 'saveSettings').and.callThrough();
      $scope.settings = new Settings();
      $scope.settings.timeout = 456;
      $scope.settings.enableHighlighting = false;
      $scope.settings.enablePageStats = false;
      $scope.settings.showTooltip = ShowTooltip.NEVER;
      $scope.settings.blockedWebsitesStr =
        '  \nblocked-1\n\n\n   blocked-2   \n  \n';
      $scope.settings.allowedWebsitesStr =
        '  \nallowed-1\n\n\n   allowed-2   \n  \n';

      expected = angular.copy($scope.settings);
      expected.blockedWebsites = ['blocked-1', 'blocked-2'];
      expected.allowedWebsites = ['allowed-1', 'allowed-2'];
      await $scope.save(true);
    });

    it('saves the settings', () => {
      expect(dao.saveSettings).toHaveBeenCalledWith(expected);
    });
  });
});
