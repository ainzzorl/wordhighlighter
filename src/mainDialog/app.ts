///<reference path="../lib/dao.ts" />
///<reference path="../lib/logger.ts" />

let app = angular.module('mainDialog', ['ngTable']);

app.service('dao', function() {
    return new DAO();
});

app
.run(function($rootScope: any) {
    $rootScope.currentTab = 'words';
});

// The code below is an ugly workaround for a bug.
// For some reason, when any ng-tracked element is changed,
// the scroll position is automatically reset to the top.
// This happens in Firefox, but works normally in Chrome.
// This is an attempt to detect and block these abnormal scrolls.
// Of course, some "real" scrolls are blocked by it as well.
// TODO: find something better or at least disable in Chrome.

let currentXOffset = 0;
let currentYOffset = 0;

app
.run(function($window: any) {
    angular.element($window).bind('scroll', function() {
        if (this.pageYOffset === 0 && this.pageYOffset !== currentYOffset && currentYOffset > 10) {
            WHLogger.log('Strange scroll has been detected');
            $window.scrollTo(currentXOffset, currentYOffset);
            WHLogger.log('Reset scroll to ' + currentXOffset + ', ' + currentYOffset);
        }
        currentXOffset = this.pageXOffset;
        currentYOffset = this.pageYOffset;
    });
});
