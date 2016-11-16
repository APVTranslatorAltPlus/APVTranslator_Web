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
        scope.columnOtherDefs = [{ displayName: 'STT', cellTemplate: '<div style="text-align:center;">{{row.rowIndex}}</div>', width: 40, enableCellEdit: false },
                         { field: 'TextSegment1', displayName: 'Source Language', enableCellEdit: false, minWidth: 250, resizable: true },
                         { field: 'TextSegment2', displayName: 'DestinationLanguage', enableCellEdit: true, minWidth: 250, resizable: true },
                         { field: 'Suggestion', displayName: 'Suggestion', enableCellEdit: false, width: 250, minWidth: 200, resizable: true },
                         { field: 'GoogleTranslate', displayName: 'GoogleTranslate', enableCellEdit: false, minWidth: 200, resizable: true }];
        scope.gridOptions = {
            data: 'data',
            enableCellSelection: false,
            enableColumnResize: true,
            enableCellEditOnFocus: true,
            selectedItems: scope.gridSelections,

            enableRowSelection: scope.enableRowSelection,
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
            multiSelect: false,
            rowTemplate: rowTemplate(),
            columnDefs: 'columnDefs'
        };

        scope.$on('ngGridEventEndCellEdit', function (evt) {
            try {
                var dataEdit = {};
                var row = evt.targetScope.row.entity;
                dataEdit.Id = row.Id;
                dataEdit.TextSegment1 = row.TextSegment1;
                dataEdit.TextSegment2 = row.TextSegment2;
                scope.sendMessageSocket(dataEdit)
            } catch (e) {
                Utility.showMessage(scope, $mdDialog, "Can't sent edited to server!");
            }
            //console.log(evt.targetScope.row.entity);  the underlying data bound to the row
            // Detect changes and send entity to server 
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
                        scope.getSocket();
                        if (response.FileType == Enumeration.FileType.Excel) {
                            scope.columnDefs = scope.columnExcelDefs;
                        }
                        else {
                            scope.columnDefs = scope.columnOtherDefs;
                        }
                        scope.data = JSON.parse(response.ControllerResult.Value)
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
            ws = new WebSocket("ws://" + location.host + "/Handler/SocketHandler.ashx");
            ws.onopen = function () {
                console.log('connect to server');
            };
            ws.onmessage = function (evt) {
                console.log(evt.data);
            };
            ws.onerror = function (evt) {
                console.log(evt.message);
            };
            ws.onclose = function () {
                Utility.showMessage(scope, $mdDialog, "Socket closed");
            };
        }

        scope.sendMessageSocket = function (data) {
            try {
                var jsData = JSON.stringify(data);
                ws.send(jsData);
            } catch (e) {
                Utility.showMessage(scope, $mdDialog, "Can't sent edited to server!");
            }
        }
    }]);