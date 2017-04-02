///<reference path="../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../node_modules/@types/angular/index.d.ts" />
///<reference path="../src/lib/common/settings.ts" />

describe('settingsController', function() {

    let controller;
    let $scope: any;
    let dao;

    let mod: any = module;
    beforeEach(mod('mainDialog'));

    beforeEach(function() {
        dao = {
            getSettings: function(callback: (settings: Settings) => void) {
                let settings: Settings = new Settings();
                settings.enableHighlighting = true;
                settings.timeout = 123;
                callback(settings);
            },
            saveSettings(settings: Settings, callback: () => void): void {
                callback();
            }
        };
    });

    beforeEach(inject(function($controller, $rootScope) {
        $scope = $rootScope.$new();
        controller = $controller('settingsController', { $scope: $scope, dao: dao });
    }));

    describe('load', function() {
        beforeEach(function() {
            $scope.load();
        });

        it ('loads the settings', function() {
            expect($scope.settings.enableHighlighting).toBe(true);
            expect($scope.settings.timeout).toEqual(123);
        });
    });

    describe('save', function() {
        beforeEach(function() {
            spyOn(dao, 'saveSettings');
            $scope.settings = new Settings();
            $scope.settings.timeout = 456;
            $scope.settings.enableHighlighting = false;
            $scope.settings.enablePageStats = false;
            $scope.save();
        });

        it ('saves the settings', function() {
            expect(dao.saveSettings).toHaveBeenCalledWith($scope.settings, jasmine.any(Function));
        });
    });
});
