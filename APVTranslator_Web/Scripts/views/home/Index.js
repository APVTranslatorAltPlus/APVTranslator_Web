﻿//var apvApp = angular.module('apvApp', ['ngGrid', 'ngMaterial', 'chieffancypants.loadingBar', 'ngAnimate'])
//    .config(function (cfpLoadingBarProvider) {
//        cfpLoadingBarProvider.includeSpinner = true;
//    })

apvApp.controller('MyCtrl', ['$scope', '$http', 'serListProject', 'serListFileProject', 'cfpLoadingBar', '$mdDialog', 'deleteFileProject', 'serCreateNewProject', 'serGetListUser', 'cfpLoadingBar', 'serGetProjectInfo', 'serGetListProjectMember', 'serUpdateProject', 'serDeleteProject', 'serGetListProjectDBReference', 'serSaveChangeProjectSetting', 'serGetInfoForMemberSetting', 'serSaveChangeMemberSetting', 'serGetTextSearch', 'serGetListDictionary','serGetProjectProgress',
    function (scope, http, serListProject, serListFileProject, cfpLoadingBar, $mdDialog, deleteFileProject, serCreateNewProject, serGetListUser, cfpLoadingBar, serGetProjectInfo, serGetListProjectMember, serUpdateProject, serDeleteProject, serGetListProjectDBReference, serSaveChangeProjectSetting, serGetInfoForMemberSetting, serSaveChangeMemberSetting, serGetTextSearch, serGetListDictionary, serGetProjectProgress) {
        scope.init = function () {
            if(projectId === null){
                scope.loadListProject();
            } else {
                scope.loadListFileProject(projectId);
                scope.showSearchBoxDivider = true;
                serGetProjectInfo.data(projectId)
                    .success(function (response) {
                        if (response.GetProjectInfoResult && response.GetProjectInfoResult.IsSuccess) {
                            var project = JSON.parse(response.GetProjectInfoResult.Value);
                            scope.currentProject = Utility.clone(project);
                            serGetProjectProgress.data(projectId)
                  .success(function (response) {
                      if (response.GetProjectProgressResult && response.GetProjectProgressResult.IsSuccess) {
                          var object = JSON.parse(response.GetProjectProgressResult.Value);
                          scope.currentProject.Progress = object;
                          console.log(object);
                      }
                      else {
                          Utility.showMessage(scope, $mdDialog, response.GetProjectProgressResult.Message);
                      }
                  }).error(function (err) {
                      console.log(err);
                      Utility.showMessage(scope, $mdDialog, err.message)
                      cfpLoadingBar.complete();
                  });
                        }
                        else {
                            Utility.showMessage(scope, $mdDialog, response.GetProjectInfoResult.Message);
                        }
                    }).error(function (err) {
                        console.log(err);
                        Utility.showMessage(scope, $mdDialog, err.message)
                        cfpLoadingBar.complete();
                    });
            }

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
        scope.listProject = [];
        scope.columnDefs = [];
        scope.isEdit = false;
        scope.isListProjectScreen = true;
        scope.projectId = null;
        //columns list file in project
        scope.columnDefs2 = [{ displayName: 'STT', cellTemplate: '<div style="text-align:center;">{{row.rowIndex +1}}</div>', width: 50, enableCellEdit: false },
                             { field: 'FileName', displayName: 'FileName', enableCellEdit: false, width: 220, resizable: true },
                             { field: 'FileProgress', displayName: 'File Progress', enableCellEdit: false, minWidth: 120, cellTemplate: '<div class="ngCellText ng-scope ngCellElement">{{buildProcess(row.entity.FileProgress)}}</div>', resizable: true },
                             //{ field: 'FilePath', displayName: 'File Path', enableCellEdit: false, minWidth: 350, resizable: true },
                             { field: 'FileType', displayName: 'File Type', cellTemplate: '<div class="ngCellText ng-scope ngCellElement">{{getFileTypeName(row.entity.FileType)}}</div>', enableCellEdit: false, minWidth: 100, minWidth: 50, resizable: true },
                            { field: 'LastUpdate', displayName: 'Last Update', type: 'date', cellFilter: 'date:\'HH:mm dd/MM/yyyy\'', enableCellEdit: false, minWidth: 150, resizable: true }];
        //column list project
        scope.columnDefs1 = [{ displayName: 'STT', cellTemplate: '<div style="text-align:center;">{{row.rowIndex + 1}}</div>', width: 50, enableCellEdit: false },
                             { field: 'Title', displayName: 'ProjectName', enableCellEdit: false, width: 300, resizable: true },
                             { field: 'Status', displayName: 'Status', width: 150, cellTemplate: '<div class="ngCellText ng-scope ngCellElement">{{buildStatus(row.entity.Progress)}}</div>', enableCellEdit: false, resizable: true },
                             { field: 'Progress', displayName: 'Progress', width: 150, cellTemplate: '<div class="ngCellText ng-scope ngCellElement">{{buildProcess(row.entity.Progress)}}</div>', width: 80, enableCellEdit: false, resizable: true },
                             //{ field: 'Path', displayName: 'Path', enableCellEdit: false, resizable: true, minWidth: 220 },
                             //{ field: 'TranslateLanguageID', displayName: 'TranslateLanguage', enableCellEdit: false, resizable: true, minWidth: 220, cellTemplate: '<div class="ngCellText ng-scope ngCellElement">{{row.entity.TranslateLanguageID == 1?"Japanese To Vietnamese":"Vietnamese To Japanese"}}</div>' },
                             { field: 'CreateAt', displayName: 'CreateAt', enableCellEdit: false, type: 'date', cellFilter: 'date:\'hh:mm dd/MM/yyyy\'', resizable: true, minWidth: 150 },
                             { field: 'CreateBy', displayName: 'CreateBy', width: 250, enableCellEdit: false, resizable: true },
                             { field: 'DeadLine', displayName: 'DeadLine', enableCellEdit: false, cellFilter: 'date:\'HH:mm dd/MM/yyyy\'', resizable: true, minWidth: 150 }];
        scope.gridOptions = {
            data: 'data',
            enableCellSelection: false,
            enableColumnResize: true,
            selectedItems: scope.gridSelections,
            rowHeight: 50,
            selectedRowIndex: 0,
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
            columnDefs: 'columnDefs',
            initialSelected: 1
        };

        scope.$on('ngGridEventData', function () {
            scope.gridOptions.selectRow(0, true);
        });

        scope.selectFirstRow = function () {
            angular.forEach(scope.data, function (data, index) {
                scope.gridOptions.selectItem(index, true);
                return;
            });
        };

        scope.FilterOptions = { filterText: '', useExternalFilter: false };
        scope.showSearchBoxDivider = false;
        scope.rowDblClick = function (row) {
            try {
                scope.showSearchBoxDivider = true;
                if (scope.gridType == Enumeration.GridType.ListProject) {
                    scope.loadListFileProject(row.entity.Id);
                    //window.location.href = Utility.getBaseUrl()+"Home/Index?projectId=" + row.entity.Id;
                    window.history.replaceState("", "", Utility.getBaseUrl() + "Home/Index?projectId=" + row.entity.Id);

                }
                if (scope.gridType == Enumeration.GridType.ListFileProject) {
                    scope.translateFile();
                }
            } catch (e) {
                Utility.showMessage(scope, $mdDialog, e.message);
            }
        };

        scope.backToListProject = function () {
            scope.loadListProject();
            window.history.replaceState("", "", Utility.getBaseUrl() + "Home/Index")
        }
        //scope.backToListProject = function () {
        //    try {
        //        scope.columnDefs = scope.columnDefs1;
        //    } catch (e) {
        //        Utility.showMessage(scope, $mdDialog, e.message);
        //    }
        //}

        scope.checkPermissionNewProject = function () {
            if (parseInt(userRole) == Enumeration.UserRole.Admin && !scope.checked) {
                return true;
            }
            else {
                return false;
            }
        }

        scope.checkPermissionEditProject = function () {
            if (parseInt(userRole) == Enumeration.UserRole.Admin && scope.projectSelection) {
                return true;
            }
            else {
                return false;
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

        scope.buildProcess = function (value) {
            if (value) {
                return Math.floor(value * 100) + "%";
            }
            else {
                return "0%";
            }
        }
        scope.buildStatus = function (value) {
            if (value) {
                if (Math.floor(value * 100) < 100) {
                    return "Translating";
                }
                else
                    if (Math.floor(value * 100) == 100) {
                        return "Translated";
                    }
            }
            else {
                return "New";
            }
        }
        scope.loadListProject = function () {
            cfpLoadingBar.start();
            scope.enableRowSelection = true;
            scope.showSearchBoxDivider = false;
            serListProject.data()
            .success(function (response) {
                if (response.GetListProjectResult && response.GetListProjectResult.IsSuccess) {
                    scope.data = JSON.parse(response.GetListProjectResult.Value);
                    scope.setGridList(Enumeration.GridType.ListProject);
                    if (scope.data.length > 0) {
                        scope.projectSelection = true;
                        scope.currentProject = scope.data[0];
                        scope.selectFirstRow();
                    }
                }
                else {
                    Utility.showMessage(scope, $mdDialog, response.GetListProjectResult.Message);
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
                        $('#file').replaceWith($('#file').val('').clone(true));
                    }
                })
                $('#file').click();
            } catch (e) {
                Utility.showMessage(scope, $mdDialog, e.message);
                $('#file').replaceWith($('#file').val('').clone(true));
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

        scope.translateFile = function () {
            try {
                var projectId = scope.currentFileProject.ProjectID;
                var fileId = scope.currentFileProject.FileID;
                window.open(Utility.getBaseUrl() + 'Translate/Index' + '?projectId=' + projectId + '&fileId=' + fileId, '_blank');
                //window.location.href = Utility.getBaseUrl() + 'Translate/Index' + '?projectId=' + projectId + '&fileId=' + fileId;
            } catch (e) {
                Utility.showMessage(scope, $mdDialog, e.message);
            }
        }
        //Tag list to add member email
        scope.tags = [];
        //Tag list to add project title
        scope.ProjectTags = [];
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

            if (/^[a-zA-Z0-9-_ ]*$/.test(projectObject["Title"]) == false) {
                angular.element("#errorMess").text("Your search string contains illegal characters!!!");
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
            //console.log("STARTDATE" + startDate.value);

            if (projectObject["CreateAt"].trim() > projectObject["Deadline"]) {
                angular.element("#errorMess").text("Invalid date in Create At or Deadline!!!");
                return;
            }

            for (var i = 0; i < scope.tags.length; i++) {

                var obj = scope.tags[i];
                scope.IdList.push(obj.Id);
                console.log(obj.Id);
            }

            serCreateNewProject.data(JSON.stringify(projectObject), (scope.IdList))
              .success(function (response) {
                  if (response.CreateNewProjectResult.IsSuccess && response.CreateNewProjectResult.Value === "true") {
                      scope.loadListProject();
                      console.log(response.CreateNewProjectResult);
                      console.log(response.CreateNewProjectResult.Value);
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
        scope.listProject = {
            availableOptions: [],
            selectedOption: {} //This sets the default value of the select in the ui
        };

        //Get list users when create new project
        scope.getListUser = function () {

            scope.isEdit = false;
            document.getElementById("modalTitle").innerHTML = "Create new project";
            document.getElementById("projectName").disabled = "";
            angular.element('#projectName').val('');
            // angular.element('#member').val('');
            angular.element('#tagList').val('');
            scope.tags = [];
            angular.element('#descriptions').val('');
            //angular.element('#startDate').val((moment(Date($.now())).format('YYYY-MM-DD HH:mm:ss')));
            //angular.element('#deadline').val((moment(Date($.now())).format('YYYY-MM-DD HH:mm:ss')));
            scope.IdList = [];
            //scope.dateRangeStart = '';
            //scope.dateRangeEnd = '';
            angular.element("#errorMess").text("");
            //scope.data2.selectedOption = scope.tags[0];
            if (!scope.isEdit) {
                angular.element('#startDate').val(moment(Date($.now())).format('YYYY-MM-DD HH:mm:ss'));
                var fiveMinutesLater = new Date();
                fiveMinutesLater.setMinutes(fiveMinutesLater.getMinutes() + 5);
                angular.element('#deadline').val(moment(fiveMinutesLater).format('YYYY-MM-DD HH:mm:ss'));
            }

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
            console.log(scope.tags);
        }

        scope.changedValueSetting = function (item) {
            var isDuplicated = false;
            //scope.data2.availableOptions.push();
            for (var i = 0; i < scope.ProjectTags.length; i++) {
                //if(){
                //     scope.tags[i][text] == item.Email
                //}
                var obj = scope.ProjectTags[i];
                if (obj.Id === item.Id) {
                    isDuplicated = true;
                    break;
                }
            }
            if (!isDuplicated) {
                scope.ProjectTags.push(item);
                isDuplicated = false;
            }
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
                                angular.element('#startDate').val(moment(project.CreateAt).format('YYYY-MM-DD HH:mm:ss'));
                            }
                            if (project.DeadLine != '' && project.DeadLine != null) {
                                angular.element('#deadline').val(moment(project.DeadLine).format('YYYY-MM-DD HH:mm:ss'));
                            }
                            document.getElementById("projectName").disabled = "disabled";
                            document.getElementById("descriptions").value = project.Descriptions;
                            var translateLanguage = document.getElementById("translateLanguage");
                            translateLanguage.value = project.TranslateLanguageID;
                            //scope.IdList = [];
                            //scope.dateRangeStart = '';
                            //scope.dateRangeEnd = '';
                            //angular.element("#errorMess").text("");
                        }
                        else {
                            Utility.showMessage(scope, $mdDialog, response.GetProjectInfoResult.Message);
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
                    Utility.showMessage(scope, $mdDialog, response.GetListProjectMemberResult.Message);
                }
            }).error(function (err) {
                console.log(err);
                cfpLoadingBar.complete();
            });
        }

        //Get list db reference of an existing project
        scope.getListProjectDBReference = function (projectId) {
            serGetListProjectDBReference.data(projectId)
            .success(function (response) {

                if (response.GetListProjectDBReferenceResult && response.GetListProjectDBReferenceResult.IsSuccess) {
                    // console.log(response.GetListProjectMemberResult.Value);
                    scope.ProjectTags = JSON.parse(response.GetListProjectDBReferenceResult.Value);
                    console.log(scope.ProjectTags);
                    for (var i = 0; i < scope.ProjectTags.length; i++) {
                        var obj = scope.ProjectTags[i];
                        scope.oldIDList.push(obj.Id);
                        console.log("INITIAL = " + scope.oldIDList[i]);
                    }
                } else {
                    Utility.showMessage(scope, $mdDialog, response.GetListProjectDBReferenceResult.Message);
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
            serUpdateProject.data(JSON.stringify(projectObject), (scope.newlyInsertedIDList), (scope.deletedIDList))
              .success(function (response) {
                  if (response.UpdateProjectResult.IsSuccess && response.UpdateProjectResult.Value === "true") {
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

        //Confirm to delete project
        scope.confirmDeleteProject = function () {
            Utility.showConfirm(scope, $mdDialog, 'Do you want delete the project "' + scope.currentProject.Title + '"?', scope.deleteProject)
        }
        //Delete project
        scope.deleteProject = function () {
            cfpLoadingBar.start();
            serDeleteProject.data(scope.currentProject.Id, scope.currentProject.Title)
               .success(function (response) {
                   if (response.DeleteProjectResult.IsSuccess && response.DeleteProjectResult.Value === "true") {
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

        scope.settingProject = function () {

            angular.element('#projectNameSetting').val("");
            //var translateLanguage = document.getElementById("translateLanguageSetting");
            //translateLanguage.value = 2;
            //angular.element('#pathSetting').val("");
            $('#useCompanyDBSetting').bootstrapToggle('off');
            angular.element('#projectSelect').val('');
            angular.element('#tagListSetting').val(' ');
            scope.ProjectTags = [];
            scope.newlyInsertedIDList = [];
            scope.deletedIDList = [];
            scope.oldIDList = [];
            scope.IdList = [];
          //  $("#tagListSetting").attr("disabled","disabled");
            if (scope.currentProject) {
                projectId = scope.currentProject.Id;
                serListProject.data()
                  .success(function (response) {
                      if (response.GetListProjectResult && response.GetListProjectResult.IsSuccess) {
                          scope.listProject.availableOptions = JSON.parse(response.GetListProjectResult.Value);
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


                serGetProjectInfo.data(projectId)
                    .success(function (response) {
                        if (response.GetProjectInfoResult && response.GetProjectInfoResult.IsSuccess) {
                            var project = JSON.parse(response.GetProjectInfoResult.Value);
                            angular.element('#projectNameSetting').val(project.Title);
                            //var translateLanguage = document.getElementById("translateLanguageSetting");
                            //translateLanguage.value = project.TranslateLanguageID;
                            //angular.element('#pathSetting').val(project.Path);
                            if (project.UseCompanyDB == 0) {
                                $('#useCompanyDBSetting').bootstrapToggle('off');
                                $("#tagListSetting").attr("disabled", "disabled");
                                $("#projectSelect").attr("disabled", "disabled");

                            } else {
                                $('#useCompanyDBSetting').bootstrapToggle('on');
                                $("#tagListSetting").removeAttr("disabled");
                                $("#projectSelect").removeAttr("disabled");
                            }
                            $('#useCompanyDBSetting').change(function () {
                                var isAMemberToggleValue = $(this).prop('checked');

                                if (isAMemberToggleValue === true) {
                                    $("#tagListSetting").removeAttr("disabled");
                                    $("#projectSelect").removeAttr("disabled");
                                } else {
                                    $("#tagListSetting").attr("disabled", "disabled");
                                    $("#projectSelect").attr("disabled", "disabled");
                                }
                            });

                            scope.getListProjectDBReference(projectId);

                        }
                        else {
                            //   Utility.showMessage(scope, $mdDialog, response.GetListFileProjectResult.Message);
                        }
                    }).error(function (err) {
                        console.log(err);
                        Utility.showMessage(scope, $mdDialog, err.message)
                        cfpLoadingBar.complete();
                    });
            }

    
        }

        scope.saveChangeProjectSetting = function () {
            var projectObject = {};
            if (scope.currentProject) {
                projectId = scope.currentProject.Id;

                //var translateLanguage = document.getElementById("translateLanguageSetting");
                //var translateLanguageValue = translateLanguage.options[translateLanguage.selectedIndex].value;
                //projectObject['TranslateLanguage'] = translateLanguageValue;
                projectObject['Id'] = projectId;
                if ($('#checkboxValue').text() === 'true') {
                    projectObject['UseCompanyDB'] = 1;
                } else {
                    projectObject['UseCompanyDB'] = 0;
                }
               
                console.log("UsecompanyDB = " + projectObject['UseCompanyDB']);
                console.log("id = " + projectObject['Id']);

                for (var i = 0; i < scope.ProjectTags.length; i++) {

                    var obj = scope.ProjectTags[i];
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
                    }
                }

                serSaveChangeProjectSetting.data(JSON.stringify(projectObject), scope.newlyInsertedIDList, scope.deletedIDList)
                   .success(function (response) {
                       if (response.SaveChangeProjectSettingResult.IsSuccess && response.SaveChangeProjectSettingResult.Value === "true") {
                           scope.loadListProject();
                           $('#successModal').modal('show');
                           $('#settingModal').modal('hide');
                           document.getElementById("successMessage").innerHTML = "Save changes successfully!!!";
                       }
                       else {
                           $('#errorModal').modal('show');
                           $('#settingModal').modal('hide');
                       }
                   }).error(function (err) {
                       console.log(err);
                       Utility.showMessage(scope, $mdDialog, err.message)
                       cfpLoadingBar.complete();
                   });
            }
        }

        scope.modifiedIsAMemberList = [];
        scope.modifiedNotAMemberList = [];

        scope.settingMember = function () {
            $('#table-body').empty();
            scope.modifiedIsAMemberList = [];
            scope.modifiedNotAMemberList = [];

            if (scope.currentProject) {
                projectId = scope.currentProject.Id;

                serGetInfoForMemberSetting.data(projectId)
                 .success(function (response) {

                     if (response.GetInfoForMemberSettingResult && response.GetInfoForMemberSettingResult.IsSuccess) {
                         var listProjectMembers = JSON.parse(response.GetInfoForMemberSettingResult.Value);
                         console.log(listProjectMembers);
                         var trHTML = '';
                         $.each(listProjectMembers, function (i, item) {
                             var No = parseInt(i) + 1;
                             if (item.ProjectRole == 0 && item.isAMember == 1) {
                                 trHTML += '<tr><td style="display:none">' + item.UserID + '</td><td>' + No + '</td><td>' + item.UserName + '</td>'
                               + '<td>  <select class="form-control" ' + 'id="isAMemberRole_' + i + '" style="max-width:100%!important">';
                                 trHTML += '    <option value="0" selected ="selected">Comter Member</option>';
                                 trHTML += '    <option value="1">Comter Leader</option>'
                             } else
                                 if (item.ProjectRole == 1 && item.isAMember == 1) {
                                     trHTML += '<tr><td style="display:none">' + item.UserID + '</td><td>' + No + '</td><td>' + item.UserName + '</td>'
                                 + '<td>  <select class="form-control" ' + 'id="isAMemberRole_' + i + '" style="max-width:100%!important">';
                                     trHTML += '    <option value="0">Comter Member</option>';
                                     trHTML += '    <option value="1" selected ="selected">Comter Leader</option>'
                                 } else {
                                     trHTML += '<tr><td style="display:none">' + item.UserID + '</td><td>' + No + '</td><td>' + item.UserName + '</td>'
                                + '<td>  <select class="form-control" ' + 'id="notAMemberRole_' + i + '" style="max-width:100%!important">';
                                     trHTML += '    <option value="0" selected ="selected">Comter Member</option>';
                                     trHTML += '    <option value="1">Comter Leader</option>'
                                 }
                             trHTML +=
                                 + '</select> </td>';
                             if (item.isAMember == 0) {
                                 trHTML += '<td> <input type="checkbox"' + 'id="notAMember_' + i + '" data-on="Yes" data-off="No" ></td>'
                                 + '</tr>';
                             } else {
                                 trHTML += '<td> <input checked type="checkbox"' + 'id="isAMember_' + i + '" data-on="Yes" data-off="No" ></td>'
                                  + '</tr>';
                             }

                         });
                         $('#member-table').append(trHTML);
                         $(function () {
                             $('input:checkbox[id^="isAMember_"]').bootstrapToggle();
                             $('input:checkbox[id^="notAMember_"]').bootstrapToggle();
                         })
                         //$('#toggle-cb').
                         //$('input:checkbox[id^="isAMember_"]').each(function () {
                         //    $(this).bootstrapToggle('on');
                         //});
                         //$('input:checkbox[id^="notAMember_"]').each(function () {
                         //   // $(this).bootstrapToggle('off');

                         //});
                         $('select[id^="isAMemberRole_"]').change(function () {
                             var tableRowUserID = $(this).closest('tr').find("td:first").text();
                             var selectedValue = $(this).prop('selectedIndex');
                             $.each(listProjectMembers, function (i, item) {
                                 if (item.UserID == tableRowUserID) {

                                     item.ProjectRole = selectedValue;

                                     if (scope.modifiedIsAMemberList.length == 0) {
                                         scope.modifiedIsAMemberList.push(item);
                                     }
                                     var isDuplicated = false;
                                     $.each(scope.modifiedIsAMemberList, function (j, item2) {
                                         if (item2.UserID == item.UserID) {
                                             // modifiedIsAMemberList.pop(item2);
                                             isDuplicated = true;
                                             return false;
                                         }
                                     });
                                     if (!isDuplicated) {
                                         scope.modifiedIsAMemberList.push(item);
                                     }
                                     console.log(scope.modifiedIsAMemberList);
                                     //   return false;
                                 }
                             });
                         });
                         $('select[id^="notAMemberRole_"]').change(function () {
                             var tableRowUserID = $(this).closest('tr').find("td:first").text();
                             var selectedValue = $(this).prop('selectedIndex');
                             $.each(listProjectMembers, function (i, item) {
                                 if (item.UserID == tableRowUserID) {

                                     item.ProjectRole = selectedValue;

                                     if (scope.modifiedNotAMemberList.length == 0) {
                                         scope.modifiedNotAMemberList.push(item);
                                     }
                                     var isDuplicated = false;
                                     $.each(scope.modifiedNotAMemberList, function (j, item2) {
                                         if (item2.UserID == item.UserID) {
                                             // modifiedIsAMemberList.pop(item2);
                                             isDuplicated = true;
                                             return false;
                                         }
                                     });
                                     if (!isDuplicated) {
                                         scope.modifiedNotAMemberList.push(item);
                                     }
                                     console.log(scope.modifiedNotAMemberList);
                                 }
                             });

                         });
                         $('input:checkbox[id^="isAMember_"]').change(function () {
                             var isAMemberToggleValue = $(this).prop('checked');
                             var tableRowUserID = $(this).closest('tr').find("td:first").text();
                             $.each(listProjectMembers, function (i, item) {
                                 if (item.UserID == tableRowUserID) {
                                     if (isAMemberToggleValue === true) {
                                         item.isAMember = 1;
                                     } else {
                                         item.isAMember = 0;
                                     }
                                     if (scope.modifiedIsAMemberList.length == 0) {
                                         scope.modifiedIsAMemberList.push(item);
                                     }
                                     var isDuplicated = false;
                                     $.each(scope.modifiedIsAMemberList, function (j, item2) {
                                         if (item2.UserID == item.UserID) {
                                             // modifiedIsAMemberList.pop(item2);
                                             isDuplicated = true;
                                             return false;
                                         }
                                     });
                                     if (!isDuplicated) {
                                         scope.modifiedIsAMemberList.push(item);
                                     }
                                     console.log(scope.modifiedIsAMemberList);
                                     return false;
                                 }

                             });

                             //var table = $('#member-table').tableToJSON();
                             //console.log(JSON.stringify(table));
                         });

                         $('input:checkbox[id^="notAMember_"]').change(function () {
                             var isAMemberToggleValue = $(this).prop('checked');
                             var tableRowUserID = $(this).closest('tr').find("td:first").text();
                             $.each(listProjectMembers, function (i, item) {
                                 if (item.UserID == tableRowUserID) {
                                     if (isAMemberToggleValue === true) {
                                         item.isAMember = 1;
                                     } else {
                                         item.isAMember = 0;
                                     }
                                     if (scope.modifiedNotAMemberList.length == 0) {
                                         scope.modifiedNotAMemberList.push(item);
                                     }
                                     var isDuplicated = false;
                                     $.each(scope.modifiedNotAMemberList, function (j, item2) {
                                         if (item2.UserID == item.UserID) {
                                             // modifiedNotAMemberList.pop(item2);
                                             isDuplicated = true;
                                             return false;
                                         }
                                     });
                                     if (!isDuplicated) {
                                         scope.modifiedNotAMemberList.push(item);
                                     }
                                     console.log(scope.modifiedNotAMemberList);
                                     return false;
                                 }
                             });
                         });

                     } else {
                         Utility.showMessage(scope, $mdDialog, response.GetInfoForMemberSettingResult.Message);
                     }
                 }).error(function (err) {
                     console.log(err);
                     cfpLoadingBar.complete();
                 });
            }
        }
        scope.settingDictionary = function () {
            $('#Dic-table-body').empty();
            if (scope.currentProject) {
                projectId = scope.currentProject.Id;

                serGetListDictionary.data(projectId)
                 .success(function (response) {

                     if (response.GetListDictionaryResult && response.GetListDictionaryResult.IsSuccess) {
                         var listDictionaries = JSON.parse(response.GetListDictionaryResult.Value);
                         console.log(listDictionaries);
                         //pending

                     } else {
                         Utility.showMessage(scope, $mdDialog, response.GetListDictionaryResult.Message);
                     }
                 }).error(function (err) {
                     console.log(err);
                     cfpLoadingBar.complete();
                 });
            }
        }
        scope.selectedTab = '#project';

        scope.saveChangeMemberSetting = function () {
            if (scope.currentProject) {
                projectId = scope.currentProject.Id;
                serSaveChangeMemberSetting.data(projectId, JSON.stringify(scope.modifiedIsAMemberList), JSON.stringify(scope.modifiedNotAMemberList))
                   .success(function (response) {
                       if (response.SaveChangeMemberSettingResult.IsSuccess && response.SaveChangeMemberSettingResult.Value === "true") {
                           $('#successModal').modal('show');
                           $('#settingModal').modal('hide');
                           document.getElementById("successMessage").innerHTML = "Save changes successfully!!!";
                       }
                       else {
                           $('#errorModal').modal('show');
                           $('#settingModal').modal('hide');
                       }
                   }).error(function (err) {
                       console.log(err);
                       Utility.showMessage(scope, $mdDialog, err.message)
                       cfpLoadingBar.complete();
                   });
            }
        }

        scope.saveChangesSetting = function () {

            if (scope.selectedTab == "#project") {
                scope.saveChangeProjectSetting();

            }
            if (scope.selectedTab == "#member-manager") {
                scope.saveChangeMemberSetting();
            }
        }

        scope.initSetting = function () {
            scope.settingMember();
            scope.settingProject();
            //    scope.settingDictionary();
        }
        scope.callRestService = function () {
            //$http({ method: 'GET', url: '/someUrl' }).
            //  success(function (data, status, headers, config) {
            //      $scope.results.push(data);  //retrieve results and add to existing results
            //  })
            //alert(10);
        }
        scope.isTextSearchBox2 = false;

        scope.myFunct = function (keyEvent) {

            if (keyEvent.which === 13) {
                scope.searchText();
            }
        }

        scope.searchText = function () {
            $('#textSearchTable-body').empty();
            document.getElementById("noTextFound").style.display = "none";
            var textSearch;
            if ($('#searchModal').hasClass('in')) {
                textSearch = angular.element('#textSearchBox2').val().trim();
            } else {
                textSearch = angular.element('#textSearchBox').val().trim();
                angular.element('#textSearchBox2').val("");
            }

            serGetTextSearch.data(textSearch)
           .success(function (response) {

               if (response.GetTextSearchResult && response.GetTextSearchResult.IsSuccess) {
                   var textSearchResult = JSON.parse(response.GetTextSearchResult.Value);
                   var trHTML = '';
                   $.each(textSearchResult, function (i, item) {
                       var stt = parseInt(i) + 1;
                       trHTML += '<tr><td>' + stt + '</td><td>' + item.TextSegment1 + '</td>'
                     + '<td>' + item.TextSegment2 + ' </td>'
                      + '<td>' + item.Dictionary + ' </td>'
                       + '<td>' + item.Title + ' </td>'
                   }

                   );
                   $('#textSearch-table').append(trHTML);

                   if (textSearchResult.length == 0) {
                       document.getElementById("noTextFound").innerHTML = "Sorry no result found!!!";
                       document.getElementById("noTextFound").style.display = "inline";
                   }
                   if (!$('#myModal').hasClass('in')) {
                       $('#searchModal').modal('show');

                   }
                   console.log(response.GetTextSearchResult);
               } else {
                   angular.element('#noTextFound').val("No result found!!!");
               }
           }).error(function (err) {
               console.log(err);
               cfpLoadingBar.complete();
           });
        }

        scope.downloadFile = function () {
            var projectId = scope.currentFileProject.ProjectID;
            var fileId = scope.currentFileProject.FileID;

            try {
                cfpLoadingBar.start();
                $.ajax({
                    type: "POST",
                    url: Utility.getBaseUrl() + 'Translate/BuildExportFile',
                    data: JSON.stringify({ 'projectId': projectId, 'fileId': fileId }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",

                    success: function (response) {
                        cfpLoadingBar.complete();
                        if (response.IsSuccess) {
                            window.location.replace(Utility.getBaseUrl() + "Handler/DownloadHandler.ashx?projectId=" + projectId + "&fileId=" + fileId + "&fileExportName=" + JSON.parse(response.Value));
                        }
                        else {
                            Utility.showMessage(scope, $mdDialog, response.Message);
                        }
                    },
                    error: function (error) {
                        cfpLoadingBar.complete();
                        Utility.showMessage(scope, $mdDialog, error);
                    }
                });
            } catch (e) {
                Utility.showMessage(scope, $mdDialog, "Can't dowload export file!");
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
    this.data = function (projectId, projectTitle) {
        return $http.post(Utility.getBaseUrl() + 'Services/DashboardService.svc/DeleteProject', { 'projectId': projectId, 'projectTitle': projectTitle });
    };
});
apvApp.service('serGetListProjectDBReference', function ($http) {
    this.data = function (projectId) {
        return $http.post(Utility.getBaseUrl() + 'Services/DashboardService.svc/GetListProjectDBReference', { 'projectId': projectId });
    };
});
apvApp.service('serSaveChangeProjectSetting', function ($http) {
    this.data = function (project, newlyInsertedIDList, deletedIDList) {
        return $http.post(Utility.getBaseUrl() + 'Services/DashboardService.svc/SaveChangeProjectSetting', { 'project': project, 'newlyInsertedIDList': newlyInsertedIDList, 'deletedIDList': deletedIDList });
    };
});

apvApp.service('serGetInfoForMemberSetting', function ($http) {
    this.data = function (projectId) {
        return $http.post(Utility.getBaseUrl() + 'Services/DashboardService.svc/GetInfoForMemberSetting', { 'projectId': projectId });
    };
});
apvApp.service('serSaveChangeMemberSetting', function ($http) {
    this.data = function (projectId, modifiedIsAMemberList, modifiedNotAMemberList) {
        return $http.post(Utility.getBaseUrl() + 'Services/DashboardService.svc/SaveChangeMemberSetting', { 'projectId': projectId, 'modifiedIsAMemberList': modifiedIsAMemberList, 'modifiedNotAMemberList': modifiedNotAMemberList });
    };
});
apvApp.service('serGetTextSearch', function ($http) {
    this.data = function (textSearch) {
        return $http.post(Utility.getBaseUrl() + 'Services/DashboardService.svc/GetTextSearch', { 'textSearch': textSearch });
    };
});
apvApp.service('serGetListDictionary', function ($http) {
    this.data = function (projectId) {
        return $http.post(Utility.getBaseUrl() + 'Services/DashboardService.svc/GetListDictionary', { 'projectId': projectId });
    };
});
apvApp.service('serGetProjectProgress', function ($http) {
    this.data = function (projectId) {
        return $http.post(Utility.getBaseUrl() + 'Services/DashboardService.svc/GetProjectProgress', { 'projectId': projectId });
    };
});
//Handle splitter transition 
var isOpen = true;
var isCollapsed = false;
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
    initialWidth = document.getElementById('mySidenav').offsetWidth;
    document.getElementById("mySidenav").style.display = "none";
    document.getElementById("gridTable").style.width = "100%";
    $('#gridTable').trigger('resize');
    $('.main-index').trigger('resize'); $('#DashBoard').trigger('resize');
    document.getElementById("mySidenav").style.overflow = "hidden";
}

function closeExpandedArea() {

    if (isCollapsed) {
        $("button.navbar-toggle").click();
        isCollapsed = false;
    }
}

function openExpandedArea() {
    isCollapsed = true;
}

$(window).resize(function () {
    var width = $(window).width();
    //Assuming X=550   
    if (width <= 450) {
        //  $('.button-toolbar').removeClass('btn-default');
        $('.button-toolbar').addClass('btn-sm');
    }
    else {
        $('.button-toolbar').removeClass('btn-sm');
        $('.button-toolbar').addClass('btn-default');
    }
})



$(function () {
    $('#useCompanyDBSetting').change(function () {
        $('#checkboxValue').text($(this).prop('checked'));

    })
})

var lastScrollLeft = 0;
$(window).scroll(function () {
    var documentScrollLeft = $(document).scrollLeft();
    if (lastScrollLeft != documentScrollLeft) {
        $('#gridTable').trigger('resize');
        $('.main-index').trigger('resize'); $('#DashBoard').trigger('resize');
        alert(1);
        console.log('scroll x');
        lastScrollLeft = documentScrollLeft;
    }
});
