//var apvApp = angular.module('apvApp', ['ngGrid', 'ngMaterial', 'chieffancypants.loadingBar', 'ngAnimate'])
//    .config(function (cfpLoadingBarProvider) {
//        cfpLoadingBarProvider.includeSpinner = true;
//    })

apvApp.controller('MyCtrl', ['$scope', '$http', 'serListProject', 'serListFileProject', 'cfpLoadingBar', function (scope, http, serListProject, serListFileProject, cfpLoadingBar) {
    scope.init = function () {
        scope.loadListProject();
    }
    scope.currentProject = {};
    scope.gridSelections = [];
    scope.checked = false;
    scope.gridType = Enumeration.GridType.ListProject;
    scope.data = [];
    scope.columnDefs = [];
    //columns list file in project
    scope.columnDefs2 = [{ displayName: 'STT', cellTemplate: '<div style="text-align:center;">{{row.rowIndex}}</div>', width: 50, enableCellEdit: false },
                         { field: 'FileName', displayName: 'FileName', enableCellEdit: false, minWidth: 220, resizable: true },
                         { field: 'FilePath', displayName: 'File Path', enableCellEdit: false, minWidth: 350, resizable: true },
                         { field: 'FileType', displayName: 'File Type', cellTemplate: '<div class="ngCellText ng-scope ngCellElement">{{getFileTypeName(row.entity.FileType)}}</div>', enableCellEdit: false, width: 70, minWidth: 50, resizable: true },
                        { field: 'LastUpdate', displayName: 'Last Update', type: 'date', cellFilter: 'date:\'mm:hh dd/MM/yyyy\'', enableCellEdit: false, minWidth: 150, resizable: true }];
    //column list project
    scope.columnDefs1 = [{ displayName: 'STT', cellTemplate: '<div style="text-align:center;">{{row.rowIndex}}</div>', width: 50, enableCellEdit: false },
                         { field: 'Title', displayName: 'ProjectName', enableCellEdit: false, minWidth: 200, resizable: true },
                         { field: 'Status', displayName: 'Status', minWidth: 100, cellTemplate: '<div class="ngCellText ng-scope ngCellElement">{{row.entity.Progress<100?"Translating":"Translated"}}</div>', enableCellEdit: false, resizable: true },
                         { field: 'Progress', displayName: 'Progress', minWidth: 100, cellTemplate: '<div class="ngCellText ng-scope ngCellElement">{{row.entity.Progress*100}}%</div>', width: 80, enableCellEdit: false, resizable: true },
                         { field: 'Path', displayName: 'Path', enableCellEdit: false, resizable: true, minWidth: 220 },
                         { field: 'LanguageDescription', displayName: 'TranslateLanguage', enableCellEdit: false, resizable: true, minWidth: 220 },
                         { field: 'CreateAt', displayName: 'CreateAt', enableCellEdit: false, type: 'date', cellFilter: 'date:\'mm:hh dd/MM/yyyy\'', resizable: true, minWidth: 150 },
                         { field: 'CreateBy', displayName: 'CreateBy', minWidth: 200, enableCellEdit: false, resizable: true },
                         { field: 'DeadLine', displayName: 'DeadLine', enableCellEdit: false, cellFilter: 'date:\'mm:hh dd/MM/yyyy\'', resizable: true, minWidth: 150 }];
    scope.gridOptions = {
        data: 'data',
        enableCellSelection: false,
        enableColumnResize: true,
        selectedItems: scope.gridSelections,
        enableRowSelection: scope.enableRowSelection,
        afterSelectionChange: function (row, event) {
            if (scope.gridType == Enumeration.GridType.ListProject) {
                scope.currentProject = Utility.clone(scope.gridSelections[0]);
            }
            if (scope.selections != "") {
                scope.disabled = false;
            } else {
                scope.disabled = true;
            }
        },
        enableFiltering: true,
        showFilter: true,
        multiSelect: false,
        rowTemplate: rowTemplate(),
        columnDefs: 'columnDefs'
    };

    scope.rowDblClick = function (row) {
        try {
            if (scope.gridType == Enumeration.GridType.ListProject) {
                scope.loadListFileProject(row);
            }
        } catch (e) {

        }
    };

    scope.backToListProject = function () {
        scope.columnDefs = scope.columnDefs1;
    }

    function rowTemplate() {
        return '<div ng-dblclick="rowDblClick(row)" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}" ng-cell></div>';
    }

    scope.getFileTypeName = function (typeFile) {
        switch (typeFile) {
            case Enumeration.FileType.Word:
                return 'Word'
                break;
            case Enumeration.FileType.PowerPoint:
                return 'PowerPoint'
                break;
            case Enumeration.FileType.Excel:
                return 'Excel'
                break;
            default:
                break;
        }
    }

    scope.loadListProject = function () {
        cfpLoadingBar.start();
        scope.enableRowSelection = true;
        serListProject.data()
        .success(function (response) {
            if (response.GetListProjectResult && response.GetListProjectResult.IsSuccess) {
                scope.data = JSON.parse(response.GetListProjectResult.Value);
                scope.columnDefs = scope.columnDefs1;
                scope.checked = false;
                scope.gridType = Enumeration.GridType.ListProject;
            }
            cfpLoadingBar.complete();
        }).error(function (err) {
            console.log(err);
            cfpLoadingBar.complete();
        });
    }

    scope.loadListFileProject = function (row) {
        cfpLoadingBar.start();
        scope.enableRowSelection = false;
        serListFileProject.data(row.entity.Id)
            .success(function (response) {
                if (response.GetListFileProjectResult && response.GetListFileProjectResult.IsSuccess) {
                    scope.data = JSON.parse(response.GetListFileProjectResult.Value);
                    scope.columnDefs = scope.columnDefs2;
                    scope.checked = true;
                    scope.gridType = Enumeration.GridType.ListFileProject;
                }
                cfpLoadingBar.complete();
            }).error(function (err) {
                console.log(err);
                cfpLoadingBar.complete();
            });
    }
}])
apvApp.service('serListProject', function ($http) {
    this.data = function () {
        return $http.get(Utility.getBaseUrl() + 'Services/DashboardService.svc/GetListProject');
    };
});
apvApp.service('serListFileProject', function ($http) {
    this.data = function (projectId) {
        return $http.post(Utility.getBaseUrl() + 'Services/DashboardService.svc/GetListFileProject', { 'projectID': projectId });
    };
});

