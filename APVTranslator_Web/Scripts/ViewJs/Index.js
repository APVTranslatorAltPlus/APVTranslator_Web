var app = angular.module('myApp', ['ngGrid']).controller('MyCtrl', ['$scope', '$http', 'services', function (scope, http, ser) {
    ser.data()
        .success(function (response) {
            if (response.GetListProjectResult && response.GetListProjectResult.IsSuccess) {
                scope.data = JSON.parse(response.GetListProjectResult.Value);
            }
        }).error(function (err) {
            console.log(err);
        });
    scope.gridOptions = {
        data: 'data',
        enableCellSelection: true,
        enableRowSelection: false,
        enableCellEditOnFocus: false,
        columnDefs: [{ displayName: 'STT', cellTemplate: '<div style="text-align:center;">{{row.rowIndex}}</div>', width: 50, enableCellEdit: false },
                     { field: 'Title', displayName: 'ProjectName', enableCellEdit: false, minWidth: 200, resizable: true },
                     { field: 'Status', displayName: 'Status', cellTemplate: '<div class="ngCellText ng-scope ngCellElement">{{row.entity.Progress<100?"Translating":"Translated"}}</div>', enableCellEdit: false, resizable: true },
                     { field: 'Progress', displayName: 'Progress', cellTemplate: '<div class="ngCellText ng-scope ngCellElement">{{row.entity.Progress*100}}%</div>', width: 80, enableCellEdit: false, resizable: true },
                     { field: 'Path', displayName: 'Path', enableCellEdit: false, resizable: true, minWidth: 220 },
                     { field: 'LanguageDescription', displayName: 'TranslateLanguage', enableCellEdit: false, resizable: true, minWidth: 220 },
                     { field: 'CreateAt', displayName: 'CreateAt', enableCellEdit: false, type: 'date', cellFilter: 'date:\'mm:hh dd/MM/yyyy\'', resizable: true,minWidth:150 },
                     { field: 'CreateBy', displayName: 'CreateBy', enableCellEdit: false, resizable: true },
                     { field: 'DeadLine', displayName: 'DeadLine', enableCellEdit: false, cellFilter: 'date:\'mm:hh dd/MM/yyyy\'', resizable: true, minWidth: 150 }]
    };
}])
app.service('services', function ($http) {
    this.data = function () {
        return $http.get('Services/DashboardService.svc/GetListProject');
    };
});















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