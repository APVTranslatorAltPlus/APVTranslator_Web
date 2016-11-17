apvApp.controller('translateCtrl', ['$scope', '$http', 'cfpLoadingBar', '$mdDialog', 'cfpLoadingBar',
    function (scope, http, cfpLoadingBar, $mdDialog, cfpLoadingBar) {
        scope.init = function () {
            if (projectId == "" || fileId == "") {
                Utility.showMessage(scope, $mdDialog, 'Some param expect!');
            }
            else {
                scope.getListTextSegment(projectId, fileId);
            }
        }
        scope.projectName = 'project name';
        scope.fileName = 'file name';
        scope.colct = {};
        scope.data = [];
        scope.columnDefs = [];
        scope.columnExcelDefs = [{ displayName: 'STT', cellTemplate: '<div style="text-align:center;">{{row.rowIndex}}</div>', width: 40, enableCellEdit: false },
                         { field: 'TextSegment1', displayName: 'Source Language', enableCellEdit: false, minWidth: 250, resizable: true },
                         { field: 'TextSegment2', displayName: 'DestinationLanguage', enableCellEdit: true, minWidth: 250, resizable: true },
                         { field: 'Suggestion', displayName: 'Suggestion', enableCellEdit: false, width: 250, minWidth: 200, resizable: true },
                         { field: 'GoogleTranslate', displayName: 'GoogleTranslate', enableCellEdit: false, minWidth: 200, resizable: true },
                         { field: 'Row', displayName: 'Row', enableCellEdit: false, minWidth: 100, width: 100, resizable: true },
                         { field: 'Col', displayName: 'Col', enableCellEdit: false, minWidth: 100, width: 100, resizable: true },
                         { field: 'SheetName', displayName: 'SheetName', enableCellEdit: false, minWidth: 100, width: 150, resizable: true }];
        scope.columnOtherDefs = [{ displayName: 'STT', cellTemplate: '<div  ng-click="cellClick(row,col)" style="text-align:center;">{{row.rowIndex}}</div>', width: 40, enableCellEdit: false },
                         {
                             field: 'TextSegment1',
                             cellTemplate: '<div  ng-click="cellClick(row,col)" Id={{row.getProperty("Id")}} Field={{col.field}} ng-class=""><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>',
                             displayName: 'Source Language',
                             enableCellEdit: false,
                             minWidth: 250,
                             resizable: true
                         },
                         {
                             field: 'TextSegment2',
                             cellTemplate: '<div ng-click="cellClick(row,col)" Id={{row.getProperty("Id")}} Field={{col.field}} ng-class=""><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>',
                             displayName: 'DestinationLanguage',
                             enableCellEdit: true,
                             minWidth: 250,
                             resizable: true
                         },
                         {
                             field: 'Suggestion',
                             cellTemplate: '<div ng-click="cellClick(row,col)" Id={{row.getProperty("Id")}} Field={{col.field}} ng-class=""><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>',
                             displayName: 'Suggestion',
                             enableCellEdit: false,
                             width: 250,
                             minWidth: 200,
                             resizable: true
                         },
                         {
                             field: 'GoogleTranslate',
                             cellTemplate: '<div ng-click="cellClick(row,col)" Id={{row.getProperty("Id")}} Field={{col.field}} ng-class=""><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>',
                             displayName: 'GoogleTranslate',
                             enableCellEdit: false,
                             minWidth: 200,
                             resizable: true
                         }];
        scope.gridOptions = {
            data: 'data',
            enableColumnResize: true,
            enableCellEditOnFocus: true,
            //selectedItems: scope.gridSelections,
            enableCellSelection: true,
            enableRowSelection: false,
            //afterSelectionChange: function (row, event) {
            //    if (scope.gridType == Enumeration.GridType.ListProject) {
            //        scope.currentProject = Utility.clone(scope.gridSelections[0]);
            //        scope.projectSelection = true;
            //    }
            //    else if (scope.gridType == Enumeration.GridType.ListFileProject) {
            //        scope.currentFileProject = Utility.clone(scope.gridSelections[0]);
            //        scope.fileProjectSelection = true;
            //    }
            //    if (scope.selections != "") {
            //        scope.disabled = false;
            //    } else {
            //        scope.disabled = true;
            //    }
            //},
            enableFiltering: true,
            showFilter: true,
            rowTemplate: rowTemplate(),
            columnDefs: 'columnDefs'
        };

        scope.cellClick = function (row, col) {
            try {
                var dataEdit = {};
                var rowData = row.entity;
                dataEdit.Id = rowData.Id;
                dataEdit.TextSegment1 = rowData.TextSegment1;
                dataEdit.TextSegment2 = rowData.TextSegment2;
                dataEdit.Field = col.field;
                scope.sendMessageSocket(dataEdit)
            } catch (e) {

            }
        }

        scope.$on('ngGridEventEndCellEdit', function (evt) {
            try {
                var dataEdit = {};
                var rowData = evt.targetScope.row.entity;
                var col = evt.targetScope.col;
                dataEdit.Id = rowData.Id;
                dataEdit.TextSegment1 = rowData.TextSegment1;
                dataEdit.TextSegment2 = rowData.TextSegment2;
                dataEdit.Field = col.field;
                scope.sendMessageSocket(dataEdit)
            } catch (e) {
                Utility.showMessage(scope, $mdDialog, "Can't sent edited to server!");
            }
        });

        function rowTemplate() {
            return '<div ng-dblclick="rowDblClick(row)" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}" ng-cell></div>';
        }

        scope.getListTextSegment = function (projectId, fileId) {
            cfpLoadingBar.start();
            $.ajax({
                type: "POST",
                url: Utility.getBaseUrl() + 'Translate/GetTextSegment',
                data: JSON.stringify({ 'projectId': projectId, 'fileId': fileId }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    cfpLoadingBar.complete();
                    if (response.ControllerResult.IsSuccess) {
                        scope.data = JSON.parse(response.ControllerResult.Value)
                        scope.getSocket();
                        if (response.FileType == Enumeration.FileType.Excel) {
                            scope.columnDefs = scope.columnExcelDefs;
                        }
                        else {
                            scope.columnDefs = scope.columnOtherDefs;
                        }
                        scope.projectName = response.ProjectName;
                        scope.fileName = response.FileName;
                    }
                    else {
                        Utility.showMessage(scope, $mdDialog, response.ControllerResult.Message);
                    }
                },
                error: function (error) {
                    cfpLoadingBar.complete();
                    Utility.showMessage(scope, $mdDialog, error);
                }
            });
        }
        scope.getSocket = function () {
            ws = new WebSocket("ws://" + location.host + "/Handler/SocketHandler.ashx" + "?projectId=" + projectId);
            ws.onopen = function () {
                try {
                    console.log('connect to server');
                } catch (e) {

                }
            };
            ws.onmessage = function (evt) {
                try {
                    console.log(evt.data);
                    var data = JSON.parse(evt.data);
                    var s = $('[Id=' + data.Id + '][Field=' + data.Field + ']');
                    s.css("background-color", data.Color);
                } catch (e) {

                }
            };
            ws.onerror = function (evt) {
                try {
                    console.log(evt.message);
                } catch (e) {

                }
            };
            ws.onclose = function () {
                Utility.showMessage(scope, $mdDialog, "Socket closed");
            };
        }

        scope.sendMessageSocket = function (data) {
            try {
                var jsData = JSON.stringify(data);
                if (ws.readyState == 1) {
                    ws.send(jsData);
                }
                else {
                    Utility.showMessage(scope, $mdDialog, "Connect to server had closed, please check your network!");
                }

            } catch (e) {
                Utility.showMessage(scope, $mdDialog, "Can't sent edited to server!");
            }
        }
    }]);