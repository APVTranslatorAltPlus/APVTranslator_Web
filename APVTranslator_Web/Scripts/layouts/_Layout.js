var apvApp = angular.module('apvApp', ['ngGrid', 'ngMaterial', 'chieffancypants.loadingBar', 'ngAnimate', 'ngTagsInput', 'ui.bootstrap.datetimepicker', 'ui.dateTimeInput'])
    .config(function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;
    })
    .controller('ctTopbar', ['$scope', '$http', 'cfpLoadingBar', function (scope, http, cfpLoadingBar) {
        scope.test = function () {
            alert('abc');
        }
    }])
