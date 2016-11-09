//var app = angular.module('myApp', ['ngGrid', 'ngMaterial', 'chieffancypants.loadingBar', 'ngAnimate'])
//    .config(function (cfpLoadingBarProvider) {
//        cfpLoadingBarProvider.includeSpinner = true;
//    })
apvApp.controller('MyCtrl', ['$scope', '$http', 'serListProject', 'serListFileProject', 'serCreateNewProject', 'serGetListUser', 'cfpLoadingBar', function (scope, http, serListProject, serListFileProject, serCreateNewProject, serGetListUser, cfpLoadingBar) {
    scope.init = function () {
        scope.loadListProject();
    }
    scope.currentProject = {};
    scope.gridSelections = [];
    scope.checked = false;
    scope.gridType = Enumeration.GridType.ListProject;
    scope.data = [];
    scope.data2 = [];
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
                         { field: 'Progress', displayName: 'Progress', cellTemplate: '<div class="ngCellText ng-scope ngCellElement">{{row.entity.Progress*100}}%</div>', width: 150, enableCellEdit: false, resizable: true },
                         { field: 'Path', displayName: 'Path', enableCellEdit: false, resizable: true, minWidth: 220 },
                         { field: 'LanguageDescription', displayName: 'TranslateLanguage', enableCellEdit: false, resizable: true, minWidth: 220, cellClass: 'wrap-text' },
                         { field: 'CreateAt', displayName: 'CreateAt', enableCellEdit: false, type: 'date', cellFilter: 'date:\'mm:hh dd/MM/yyyy\'', resizable: true, minWidth: 150 },
                         { field: 'CreateBy', displayName: 'CreateBy', minWidth: 200, enableCellEdit: false, resizable: true },
                         { field: 'DeadLine', displayName: 'DeadLine', enableCellEdit: false, cellFilter: 'date:\'mm:hh dd/MM/yyyy\'', resizable: true, minWidth: 150 }];
    scope.gridOptions = {
        data: 'data',
        enableCellSelection: false,
        enableColumnResize: true,
        selectedItems: scope.gridSelections,
        rowHeight: 50,
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

    scope.createNewProject = function (object) {
        // cfpLoadingBar.start();

      
        var projectObject = {};
        projectObject["Title"] = angular.element('#projectName').val();

        var translateLanguage = document.getElementById("translateLanguage");
        var translateLanguageValue = translateLanguage.options[translateLanguage.selectedIndex].value;
       
        projectObject["TranslateLanguage"] = translateLanguageValue;

        serCreateNewProject.data(JSON.stringify(projectObject))
          .success(function (response) {
              if (response.CreateNewProjectResult) {

              }
              cfpLoadingBar.complete();
          }).error(function (err) {
              console.log(err);
              cfpLoadingBar.complete();
          });
    }

    scope.data2 = {
        availableOptions: [],
        selectedOption: {} //This sets the default value of the select in the ui
    };

    scope.tags = [];

    //scope.loadTags = function (query) {
    //    return $http.get(scope.tags);
    //};

    scope.getListUser = function () {
        cfpLoadingBar.start();

        serGetListUser.data()
        .success(function (response) {
            console.log(response.GetListUserResult);
            console.log(response.GetListUserResult.IsSuccess);
            if (response.GetListUserResult && response.GetListUserResult.IsSuccess) {
                scope.data2.availableOptions = JSON.parse(response.GetListUserResult.Value);
               // alert(scope.data2.availableOptions[0].Title);
            } else {
                alert(1);
            }
        }).error(function (err) {
            console.log(err);
            cfpLoadingBar.complete();
        });
    }

    scope.changedValue = function (item) {
        var isDuplicated = false;
        //scope.data2.availableOptions.push();
        for (var i = 0; i < scope.tags.length; i++) {
            //if(){
            //     scope.tags[i][text] == item.Email
            //}
            var obj = scope.tags[i];
            if(obj.Email === item.Email){
                isDuplicated = true;
                break;
            }
        }
        if(!isDuplicated){
            scope.tags.push(item);

        }
        //alert(item.value);
        console.log(scope.tags);
    }
    scope.endDateBeforeRender = endDateBeforeRender
    scope.endDateOnSetTime = endDateOnSetTime
    scope.startDateBeforeRender = startDateBeforeRender
    scope.startDateOnSetTime = startDateOnSetTime
   
    function startDateOnSetTime() {
        scope.$broadcast('start-date-changed');
    }

    function endDateOnSetTime() {
        scope.$broadcast('end-date-changed');
    }

    function startDateBeforeRender($dates) {
        if (scope.dateRangeEnd) {
            var activeDate = moment(scope.dateRangeEnd);

            $dates.filter(function (date) {
                return date.localDateValue() >= activeDate.valueOf()
            }).forEach(function (date) {
                date.selectable = false;
            })
        }
    }

    function endDateBeforeRender($view, $dates) {
        if (scope.dateRangeStart) {
            var activeDate = moment(scope.dateRangeStart).subtract(1, $view).add(1, 'minute');

            $dates.filter(function (date) {
                return date.localDateValue() <= activeDate.valueOf()
            }).forEach(function (date) {
                date.selectable = false;
            })
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
apvApp.service('serCreateNewProject', function ($http) {
    this.data = function (object) {
        return $http.post(Utility.getBaseUrl() + 'Services/DashboardService.svc/CreateNewProject', { 'newProject': object });
    };
});
apvApp.service('serGetListUser', function ($http) {
    this.data = function () {
        return $http.get(Utility.getBaseUrl() + 'Services/DashboardService.svc/GetListUser');
    };
});


//Handle splitter transition 
var isOpen = true;
var initialWidth;
function toggle() {
    if (isOpen == true) {
        closeNav();
        isOpen = false;
        document.getElementById("splitterID").setAttribute("title", "Mở chi tiết dự án");
    } else {
        openNav();
        isOpen = true;
        document.getElementById("splitterID").setAttribute("title", "Đóng chi tiết dự án");
    }
}
function openNav() {
    document.getElementById("mySidenav").style.width = "25%";
    document.getElementById("gridTable").style.width = "75%";
    $('#gridTable').trigger('resize');
    $('#gridTable2').trigger('resize');

}

function closeNav() {
    initialWidth = document.getElementById('mySidenav').offsetWidth;
    document.getElementById("mySidenav").style.width = "0.5%";
    document.getElementById("gridTable").style.width = "99.5%";
    $('#gridTable').trigger('resize');
    $('.main-index').trigger('resize'); $('#DashBoard').trigger('resize');
}

//Create New Project Modal
