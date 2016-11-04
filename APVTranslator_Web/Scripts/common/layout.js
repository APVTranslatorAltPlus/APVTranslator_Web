var apvApp = angular.module('apvApp', ['ngGrid', 'ngMaterial', 'chieffancypants.loadingBar', 'ngAnimate'])
    .config(function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;
    })
    .controller('ctTopbar', ['$scope', '$http', 'cfpLoadingBar', function (scope, http, cfpLoadingBar) {
        scope.test = function () {
            alert('abc');
        }
    }])
