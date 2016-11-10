//var apvApp = angular.module('apvApp', ['ngGrid', 'ngMaterial', 'chieffancypants.loadingBar', 'ngAnimate'])
//    .config(function (cfpLoadingBarProvider) {
//        cfpLoadingBarProvider.includeSpinner = true;
//    })

apvApp.controller('MyCtrl', ['$scope', '$http', 'serListProject', 'serListFileProject', 'cfpLoadingBar', '$mdDialog', function (scope, http, serListProject, serListFileProject, cfpLoadingBar, $mdDialog) {
    scope.init = function () {
        scope.loadListProject();
    }
    scope.currentProject = {};
    scope.currentFileProject = {};
    scope.gridSelections = [];
    scope.checked = false;
    scope.projectSelection = false;
    scope.fileProjectSelection = false;
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
                         { field: 'CreateAt', displayName: 'CreateAt', enableCellEdit: false, type: 'date', cellFilter: 'date:\'hh:mm dd/MM/yyyy\'', resizable: true, minWidth: 150 },
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
                scope.projectSelection = true;
            }
            else if (scope.gridType == Enumeration.GridType.ListFileProject) {
                scope.currentFileProject = Utility.clone(scope.gridSelections[0]);
                scope.fileProjectSelection = true;
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
                scope.loadListFileProject(row.entity.Id);
            }
        } catch (e) {
            Utility.showMessage(scope, $mdDialog, e.message);
        }
    };

    scope.backToListProject = function () {
        try {
            scope.columnDefs = scope.columnDefs1;
        } catch (e) {
            Utility.showMessage(scope, $mdDialog, e.message);
        }
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
                scope.setGridList(Enumeration.GridType.ListProject);
            }
            else {
                Utility.showMessage(scope, $mdDialog, response.GetListFileProjectResult.Message);
            }
            cfpLoadingBar.complete();
        }).error(function (err) {
            console.log(err);
            Utility.showMessage(scope, $mdDialog, err.message)
            cfpLoadingBar.complete();
        });
    }

    scope.loadListFileProject = function (Id) {
        cfpLoadingBar.start();
        scope.enableRowSelection = false;
        serListFileProject.data(Id)
            .success(function (response) {
                if (response.GetListFileProjectResult && response.GetListFileProjectResult.IsSuccess) {
                    scope.data = JSON.parse(response.GetListFileProjectResult.Value);
                    scope.setGridList(Enumeration.GridType.ListFileProject);
                }
                else {
                    Utility.showMessage(scope, $mdDialog, response.GetListFileProjectResult.Message);
                }
                cfpLoadingBar.complete();
            }).error(function (err) {
                console.log(err);
                Utility.showMessage(scope, $mdDialog, err)
                cfpLoadingBar.complete();
            });
    }


    scope.setGridList = function (gridType) {
        if (gridType == Enumeration.GridType.ListProject) {
            scope.columnDefs = scope.columnDefs1;
            scope.checked = false;
            scope.gridType = Enumeration.GridType.ListProject;
            if (scope.projectSelection) {
                scope.projectSelection = false;
                scope.currentProject = {};
            }
            if (scope.fileProjectSelection) {
                scope.fileProjectSelection = false;
                scope.currentFileProject = {};
            }
        }
        else if (gridType == Enumeration.GridType.ListFileProject) {
            scope.columnDefs = scope.columnDefs2;
            scope.checked = true;
            scope.gridType = Enumeration.GridType.ListFileProject;
            if (scope.projectSelection) {
                scope.projectSelection = false;
            }
            if (scope.fileProjectSelection) {
                scope.fileProjectSelection = false;
                scope.currentFileProject = {};
            }
        }
    }
    scope.showInputFile = function () {
        try {
            $('#file').one('change', function () {
                try {
                    cfpLoadingBar.start();
                    var formData = new FormData();
                    var hadFile = false;
                    var projectId = scope.currentProject.Id;
                    var projectName = scope.currentProject.Title;
                    formData.append('projectId', projectId);
                    formData.append('projectName', projectName);
                    var files = $('#file')[0].files;
                    $.each(files, function (i, file) {
                        var ext = file.name.split('.').pop();
                        if (Contanst.TypeFile.indexOf(ext) != -1) {
                            hadFile = true;
                            formData.append('file[' + i + ']', file);
                        }
                    });
                    if (hadFile) {
                        $.ajax({
                            type: "POST",
                            url: Utility.getBaseUrl() + 'Handler/UploadHandler.ashx',
                            enctype: 'multipart/form-data',
                            data: formData,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (response) {
                                cfpLoadingBar.complete();
                                scope.loadListFileProject(projectId);
                            },
                            error: function (error) {
                                cfpLoadingBar.complete();
                                Utility.showMessage(scope, $mdDialog, error);
                            }
                        });
                    }
                } catch (e) {
                    Utility.showMessage(scope, $mdDialog, e.message);
                }
            })
            $('#file').click();
        } catch (e) {
            Utility.showMessage(scope, $mdDialog, e.message);
        }
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
