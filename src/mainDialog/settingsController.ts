///<reference path="../lib/common/dao.ts" />
///<reference path="websiteLists.ts" />

angular
  .module('mainDialog')
  .controller('settingsController', function ($scope: any, dao: DAO) {
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

    $scope.load = async () => {
      return dao.getSettings().then((settings: Settings) => {
        $scope.settings = settings;
        websiteListsToStrings($scope.settings);
        $scope.$apply();
      });
    };

    $scope.save = async (isValid: boolean) => {
      if (isValid) {
        stringsToWebsiteLists($scope.settings);
        return dao.saveSettings($scope.settings);
      }
    };

    function websiteListsToStrings(settings: any) {
      settings.blockedWebsitesStr = websiteListToStrings(
        settings.blockedWebsites
      );
      settings.allowedWebsitesStr = websiteListToStrings(
        settings.allowedWebsites
      );
    }

    function stringsToWebsiteLists(settings: any) {
      settings.blockedWebsites = stringToWebsiteList(
        settings.blockedWebsitesStr
      );
      settings.allowedWebsites = stringToWebsiteList(
        settings.allowedWebsitesStr
      );
    }

    $scope.load();
  });
