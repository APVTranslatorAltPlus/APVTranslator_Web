

var app = angular.module('myApp', ['ngGrid']).controller('MyCtrl', ['$scope', '$http', '$domUtilityService', function ($scope, $http, $domUtilityService) {
    $scope.init = function (project) {
        debugger;
        $scope.data = project;
    }
    $scope.gridOptions = {
        data: 'data',
        enableCellSelection: false,
        enableRowSelection: true,
        enableCellEditOnFocus: false,
        columnDefs: [{ field: 'Title', displayName: 'ProjectName',  resizable: true },
                     { field: 'Path', displayName: 'Path',  resizable: true },
                     { field: 'CreateBy', displayName: 'CreateBy', resizable: true }],
        rowTemplate: '<div ng-click="onClickRow(row)" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}" ng-cell></div>'
    };

    $scope.onClickRow = function (rowItem) {
       // alert(rowItem.entity.Id);
        document.getElementById("ProjectName").innerHTML = rowItem.entity.Title
        document.getElementById("Status").innerHTML = rowItem.entity.Status
        document.getElementById("Progress").innerHTML = rowItem.entity.Progress
        document.getElementById("Path").innerHTML = rowItem.entity.Path
        document.getElementById("TranslateLanguage").innerHTML = rowItem.entity.TranslateLanguageID
        document.getElementById("CreateAt").innerHTML = rowItem.entity.CreateAt
        document.getElementById("CreateBy").innerHTML = rowItem.entity.CreateBy
        document.getElementById("Deadline").innerHTML = rowItem.entity.DeadLine

        if (rowItem.entity.Status === 'false') {

        } else {
            document.getElementById("Status").innerHTML = "Translating"
        }

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