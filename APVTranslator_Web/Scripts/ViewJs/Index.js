var app = angular.module('myApp', ['ngGrid']).controller('MyCtrl', ['$scope', '$http', '$domUtilityService', function ($scope, $http, $domUtilityService) {
    $scope.init = function (project) {
        debugger;
        $scope.data = project;
    }
    $scope.gridOptions = {
        data: 'data',
        enableCellSelection: true,
        enableRowSelection: false,
        enableCellEditOnFocus: true,
        columnDefs: [{ field: 'Title', displayName: 'ProjectName', enableCellEdit: true, resizable: true },
                     { field: 'Path', displayName: 'Path', enableCellEdit: true, resizable: true },
                     { field: 'CreateBy', displayName: 'CreateBy', enableCellEdit: false, resizable: true }]
    };
}])
$(document).ready(function () {
    //$('.splitter').click(function () {
    //    var mleft = $('.main-left');
    //    var mcenter = $('.main-index');
    //    if (mleft.width()==0) {
    //        mleft.animate({
    //            width: '18%'
    //        });
    //        mcenter.css("width", "calc(82% - 6px");
    //    }
    //    else {
    //        mleft.animate({ width: '0%' });

    //        mcenter.css("width","calc(100% - 6px");
    //    }
    //});
});