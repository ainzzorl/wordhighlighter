///<reference path="../lib/common/dao.ts" />

angular
  .module('mainDialog')
  .controller(
    'settingsController',
    function ($scope: any, $timeout: any, dao: DAO) {
      $scope.isSaving = false;

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

      $scope.load = async () => {
        return dao.getSettings().then((settings: Settings) => {
          $scope.settings = settings;
          $scope.$apply();
        });
      };

      $scope.save = async () => {
        $scope.isSaving = true;
        return dao.saveSettings($scope.settings).then(() => {
          // Saving happens so fast that it's difficult to notice.
          // Keeping the spinner on a little longer
          // to let users see the spinner and assure the changes are saved.
          $timeout(() => {
            $scope.isSaving = false;
            $scope.$apply();
          }, 300);
        });
      };

      $scope.load();
    }
  );
