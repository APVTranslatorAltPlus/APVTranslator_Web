//var apvApp = angular.module('apvApp', ['ngGrid', 'ngMaterial', 'chieffancypants.loadingBar', 'ngAnimate'])
//    .config(function (cfpLoadingBarProvider) {
//        cfpLoadingBarProvider.includeSpinner = true;
//    })

apvApp.controller('MyCtrl', ['$scope', '$http', 'serListProject', 'serListFileProject', 'cfpLoadingBar', '$mdDialog', 'deleteFileProject', 'serCreateNewProject', 'serGetListUser', 'cfpLoadingBar', function (scope, http, serListProject, serListFileProject, cfpLoadingBar, $mdDialog, deleteFileProject, serCreateNewProject, serGetListUser, cfpLoadingBar) {
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
        rowHeight: 50,
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
                                $('#file').replaceWith($('#file').val('').clone(true));
                            },
                            error: function (error) {
                                cfpLoadingBar.complete();
                                Utility.showMessage(scope, $mdDialog, error);
                                $('#file').replaceWith($('#file').val('').clone(true));
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

    scope.confirmDeleteFile = function () {
        var fileName = "";
        if (scope.currentFileProject) {
            fileName = scope.currentFileProject.FileName;
        }
        Utility.showConfirm(scope, $mdDialog, 'Do you want delete the file "' + fileName + '"?', scope.deleteFile)
    }

    scope.deleteFile = function () {
        try {
            debugger;
            cfpLoadingBar.start();
            var data = {};
            data.projectId = scope.currentFileProject.ProjectID;
            data.projectName = scope.currentProject.Title;
            data.fileId = scope.currentFileProject.FileID;
            data.fileName = scope.currentFileProject.FileName;
            deleteFileProject.delete(data)
            .success(function (response) {
                if (response.DeleteFileProjectResult && response.DeleteFileProjectResult.IsSuccess) {
                    scope.loadListFileProject(scope.currentFileProject.ProjectID);
                }
                else {
                    Utility.showMessage(scope, $mdDialog, response.DeleteFileProjectResult.Message);
                }
                cfpLoadingBar.complete();
            }).error(function (err) {
                console.log(err);
                Utility.showMessage(scope, $mdDialog, err)
                cfpLoadingBar.complete();
            });
        } catch (e) {
            Utility.showMessage(scope, $mdDialog, e.message);
        }
    }
    //Tag list to add to ng-tag
    scope.tags = [];
    //User id list to pass to service
    scope.IdList = [];


    //Create new project
    scope.createNewProject = function (object) {
        // cfpLoadingBar.start();

        var projectObject = {};
        projectObject["Title"] = angular.element('#projectName').val();

        if (projectObject["Title"].trim() === "" || projectObject["Title"] == null) {
            angular.element("#errorMess").text("Please enter project name!!!");
            return;
        }
        var translateLanguage = document.getElementById("translateLanguage");
        var translateLanguageValue = translateLanguage.options[translateLanguage.selectedIndex].value;

        projectObject["TranslateLanguage"] = translateLanguageValue;
        projectObject["Path"] = "APVTranslator_Projects/" + angular.element('#projectName').val();
        projectObject["UseCompanyDB"] = 0;
        projectObject["ProjectTypeID"] = 0;
        projectObject["Status"] = "False";
        projectObject["CreateBy"] = "";

        var startDate = document.getElementById("startDate");
        var deadline = document.getElementById("deadline");
        var descriptions = document.getElementById("descriptions");

        projectObject["CreateAt"] = startDate.value;
        projectObject["Deadline"] = deadline.value;
        projectObject["Descriptions"] = descriptions.value;
        console.log("STARTDATE" + startDate.value);
        for (var i = 0; i < scope.tags.length; i++) {

            var obj = scope.tags[i];
            scope.IdList.push(obj.Id);
            console.log(obj.Id);
        }

        serCreateNewProject.data(JSON.stringify(projectObject), (scope.IdList))
          .success(function (response) {
              if (response.CreateNewProjectResult) {
                  scope.loadListProject();
                  console.log(response.CreateNewProjectResult);
                  $('#successModal').modal('show');
                  $('#createNewProjectModal').modal('hide');
              } else {
                  $('#errorModal').modal('show');
                  $('#createNewProjectModal').modal('hide');
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

    //Get list users when create new project
    scope.getListUser = function () {

        angular.element('#projectName').val('');
        angular.element('#member').val('');
        angular.element('#tagList').val('');
        scope.tags = [];
        angular.element('#descriptions').val('');
        angular.element('#startDate').val('');
        angular.element('#deadline').val('');
        scope.IdList = [];
        scope.dateRangeStart = '';
        scope.dateRangeEnd = '';
        angular.element("#errorMess").text("");
        //scope.data2.selectedOption = scope.tags[0];
        cfpLoadingBar.start();
        serGetListUser.data()
        .success(function (response) {
            console.log(response.GetListUserResult);
            console.log(response.GetListUserResult.IsSuccess);
            if (response.GetListUserResult && response.GetListUserResult.IsSuccess) {
                scope.data2.availableOptions = JSON.parse(response.GetListUserResult.Value);
                scope.data2.selectedOption = scope.data2.availableOptions[0];
            } else {
                alert("error");
            }
        }).error(function (err) {
            console.log(err);
            cfpLoadingBar.complete();
        });
    }

    //Handle user selection event from ng-select
    scope.changedValue = function (item) {
        var isDuplicated = false;
        //scope.data2.availableOptions.push();
        for (var i = 0; i < scope.tags.length; i++) {
            //if(){
            //     scope.tags[i][text] == item.Email
            //}
            var obj = scope.tags[i];
            if (obj.Email === item.Email) {
                isDuplicated = true;
                break;
            }
        }
        if (!isDuplicated) {
            scope.tags.push(item);

        }
        //alert(item.value);
        console.log(scope.tags);
    }

    //Handle datetime validation
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
apvApp.service('deleteFileProject', function ($http) {
    this.delete = function (data) {
        return $http.post(Utility.getBaseUrl() + 'Services/DashboardService.svc/DeleteFileProject', data);
    };
});

apvApp.service('serCreateNewProject', function ($http) {
    this.data = function (newProject, listMember) {
        return $http.post(Utility.getBaseUrl() + 'Services/DashboardService.svc/CreateNewProject', { 'newProject': newProject, 'listMember': listMember });
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
    document.getElementById("mySidenav").style.display = "block";
    document.getElementById("gridTable").style.width = "75%";
    $('#gridTable').trigger('resize');
    $('#gridTable2').trigger('resize');
    document.getElementById("mySidenav").style.overflowY = "auto";

}

function closeNav() {
    //initialWidth = document.getElementById('mySidenav').offsetWidth;
    document.getElementById("mySidenav").style.display = "none";
    document.getElementById("gridTable").style.width = "100%";
    $('#gridTable').trigger('resize');
    $('.main-index').trigger('resize'); $('#DashBoard').trigger('resize');
    document.getElementById("mySidenav").style.overflow = "hidden";
}

