//var apvApp = angular.module('apvApp', ['ngGrid', 'ngMaterial', 'chieffancypants.loadingBar', 'ngAnimate'])
//    .config(function (cfpLoadingBarProvider) {
//        cfpLoadingBarProvider.includeSpinner = true;
//    })

apvApp.controller('MyCtrl', ['$scope', '$http', 'serListProject', 'serListFileProject', 'cfpLoadingBar', '$mdDialog', 'deleteFileProject', 'serCreateNewProject', 'serGetListUser', 'cfpLoadingBar', 'serGetProjectInfo', 'serGetListProjectMember', 'serUpdateProject', 'serDeleteProject', function (scope, http, serListProject, serListFileProject, cfpLoadingBar, $mdDialog, deleteFileProject, serCreateNewProject, serGetListUser, cfpLoadingBar, serGetProjectInfo, serGetListProjectMember, serUpdateProject, serDeleteProject) {
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
    scope.isEdit = false;
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

    scope.confirmDeleteFile = function () {
        var fileName = "";
        if (scope.currentFileProject) {
            fileName = scope.currentFileProject.FileName;
        }
        Utility.showConfirm(scope, $mdDialog, 'Do you want delete the file "' + fileName + '"?', scope.deleteFile)
    }

    scope.confirmDeleteFile = function () {
        try {
            debugger;
            cfpLoadingBar.start();
            var data = {};
            data.projectId = scope.currentFileProject.ProjectID;
            alert(data.projectId)
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
        scope.IdList = [];
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
                  document.getElementById("successMessage").innerHTML = "Create new project successfully!!!";
              } else {
                  $('#errorModal').modal('show');
                  $('#createNewProjectModal').modal('hide');
              }
              cfpLoadingBar.complete();
          }).error(function (err) {
              console.log(err);
              //cfpLoadingBar.complete();
          });
    }

    scope.data2 = {
        availableOptions: [],
        selectedOption: {} //This sets the default value of the select in the ui
    };

    //Get list users when create new project
    scope.getListUser = function () {

        scope.isEdit = false;
        document.getElementById("modalTitle").innerHTML = "Create new project";
        document.getElementById("projectName").disabled = "";
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
            isDuplicated = false;
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

    scope.listMembers = [];
    scope.newlyInsertedIDList = [];
    scope.deletedIDList = [];
    scope.oldIDList = [];
   

    //Edit project
    scope.editProject = function () {
        var projectId = "";
        scope.newlyInsertedIDList = [];
        scope.deletedIDList = [];
        scope.oldIDList = [];
        if (scope.currentProject) {
            projectId = scope.currentProject.Id;
            //alert(projectId);
            serGetProjectInfo.data(projectId)
                .success(function (response) {
                    if (response.GetProjectInfoResult && response.GetProjectInfoResult.IsSuccess) {
                        var project = JSON.parse(response.GetProjectInfoResult.Value);

                        scope.getListUser();
                        scope.isEdit = true;

                        scope.getListProjectMember(projectId);
                        $('#createNewProjectModal').modal('show');
                        angular.element('#projectName').val(project.Title);
                        //angular.element('#member').val('');
                        //angular.element('#tagList').val('');
                        // scope.tags = [];
                        document.getElementById("modalTitle").innerHTML = "Edit project";
                        if (project.CreateAt != '' && project.CreateAt != null) {
                            angular.element('#startDate').val(moment(project.CreateAt).format('YYYY-MM-DD HH:MM:SS'));
                        }
                       
                        if (project.DeadLine != '' && project.DeadLine != null) {
                            angular.element('#deadline').val(moment(project.DeadLine).format('YYYY-MM-DD HH:MM:SS'));
                        }
                        document.getElementById("projectName").disabled = "disabled";

                        //scope.IdList = [];
                        //scope.dateRangeStart = '';
                        //scope.dateRangeEnd = '';
                        //angular.element("#errorMess").text("");
                    }
                    else {
                        alert(2);
                        //   Utility.showMessage(scope, $mdDialog, response.GetListFileProjectResult.Message);
                    }
                }).error(function (err) {
                    console.log(err);
                    Utility.showMessage(scope, $mdDialog, err.message)
                    cfpLoadingBar.complete();
                });
        }
    }

   
    //Get list members of an existing project
    scope.getListProjectMember = function (projectId) {
        serGetListProjectMember.data(projectId)
        .success(function (response) {
            console.log(response.GetListProjectMemberResult);

            if (response.GetListProjectMemberResult && response.GetListProjectMemberResult.IsSuccess) {
                console.log(response.GetListProjectMemberResult.Value);
                scope.tags = JSON.parse(response.GetListProjectMemberResult.Value);
                for (var i = 0; i < scope.tags.length; i++) {
                    var obj = scope.tags[i];
                    scope.oldIDList.push(obj.Id);
                    console.log("INITIAL = " + scope.oldIDList[i]);
                }
            } else {
                alert("error");
            }
        }).error(function (err) {
            console.log(err);
            cfpLoadingBar.complete();
        });
    }


    //Save changes when editing project completed
    scope.saveChanges = function () {
        // cfpLoadingBar.start();
       
        var projectObject = {};

        projectObject["Title"] = angular.element('#projectName').val();
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
        projectObject["Id"] = scope.currentProject.Id;

        if (moment(startDate.value).valueOf() > moment(deadline.value).valueOf()) {
            angular.element("#errorMess").text("Invalid Create At or Deadline Datetime!!!");
            return;
        }

        for (var i = 0; i < scope.tags.length; i++) {

            var obj = scope.tags[i];
            scope.IdList.push(obj.Id);
            console.log("Idlist = " + scope.IdList[i]);
        }

        //Check inserted/deleted user ID
        var isInserted = true;
        var isDeleted = true;

        //If an element in newly created IDList does not exist in initial oldIDList, then add it to newlyInsertedIDList
        for (var i = 0; i < scope.IdList.length; i++) {
            isInserted = true;
            for (var j = 0; j < scope.oldIDList.length; j++) {
                if (scope.IdList[i] === scope.oldIDList[j]) {
                    isInserted = false;
                    break;
                }
            }
            if (isInserted) {
                scope.newlyInsertedIDList.push(scope.IdList[i]);
                console.log("INSERT = " + scope.IdList[i]);
            }

        }

        //If an element in initial oldIDList does not exist in newly created IDList, then add it to deletedIDList
        for (var i = 0; i < scope.oldIDList.length; i++) {
            isDeleted = true;
            for (var j = 0; j < scope.IdList.length; j++) {
                if (scope.oldIDList[i] === scope.IdList[j]) {
                    isDeleted = false;
                    break;
                }
            }
            if (isDeleted) {
                scope.deletedIDList.push(scope.oldIDList[i]);
                console.log("DELETE = " + scope.oldIDList[i]);
            }
        }

        for (var i = 0; i < scope.IdList.length; i++) {
            console.log(scope.IdList[i]);
        }

        cfpLoadingBar.start();
        serUpdateProject.data(JSON.stringify(projectObject), (scope.newlyInsertedIDList),(scope.deletedIDList))
          .success(function (response) {
              if (response.UpdateProjectResult) {
                  scope.loadListProject();
                  console.log(response.UpdateProjectResult);
                  $('#successModal').modal('show');
                  $('#createNewProjectModal').modal('hide');
                  document.getElementById("successMessage").innerHTML = "Update project successfully!!!";
              } else {
                  $('#errorModal').modal('show');
                  $('#createNewProjectModal').modal('hide');
              }
              cfpLoadingBar.complete();
          }).error(function (err) {
              console.log(err);
              //cfpLoadingBar.complete();
          });
    }

    scope.deleteProject = function () {
        cfpLoadingBar.start();
        serDeleteProject.data(scope.currentProject.Id, scope.currentProject.Title)
           .success(function (response) {
               if (response.DeleteProjectResult) {
                   scope.loadListProject();
                   console.log(response.DeleteProjectResult);
                   $('#successModal').modal('show');
                   $('#createNewProjectModal').modal('hide');
                   document.getElementById("successMessage").innerHTML = "Delete project successfully!!!";
               } else {
                   $('#errorModal').modal('show');
                   $('#createNewProjectModal').modal('hide');
               }
               cfpLoadingBar.complete();
           }).error(function (err) {
               console.log(err);
               //cfpLoadingBar.complete();
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
apvApp.service('serGetProjectInfo', function ($http) {
    this.data = function (projectId) {
        return $http.post(Utility.getBaseUrl() + 'Services/DashboardService.svc/GetProjectInfo', { 'projectId': projectId });
    };
});
apvApp.service('serGetListProjectMember', function ($http) {
    this.data = function (projectId) {
        return $http.post(Utility.getBaseUrl() + 'Services/DashboardService.svc/GetListProjectMember', { 'projectId': projectId });
    };
});

apvApp.service('serGetListProjectMember', function ($http) {
    this.data = function (projectId) {
        return $http.post(Utility.getBaseUrl() + 'Services/DashboardService.svc/GetListProjectMember', { 'projectId': projectId });
    };
});
apvApp.service('serUpdateProject', function ($http) {
    this.data = function (project, newlyInsertedIDList, deletedIDList) {
        return $http.post(Utility.getBaseUrl() + 'Services/DashboardService.svc/UpdateProject', { 'project': project, 'newlyInsertedIDList': newlyInsertedIDList, 'deletedIDList': deletedIDList });
    };
});
apvApp.service('serDeleteProject', function ($http) {
    this.data = function (projectId,projectTitle) {
        return $http.post(Utility.getBaseUrl() + 'Services/DashboardService.svc/DeleteProject', { 'projectId' : projectId,'projectTitle':projectTitle});
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
    document.getElementById("mySidenav").style.overflowY = "auto";

}

function closeNav() {
    initialWidth = document.getElementById('mySidenav').offsetWidth;
    document.getElementById("mySidenav").style.width = "0.5%";
    document.getElementById("gridTable").style.width = "99.5%";
    $('#gridTable').trigger('resize');
    $('.main-index').trigger('resize'); $('#DashBoard').trigger('resize');
    document.getElementById("mySidenav").style.overflow = "hidden";
}

