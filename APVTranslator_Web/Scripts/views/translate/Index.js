var angularScope = {};
apvApp.controller('translateCtrl', ['$scope', '$http', 'cfpLoadingBar', '$mdDialog', 'cfpLoadingBar',
    function (scope, http, cfpLoadingBar, $mdDialog, cfpLoadingBar) {
        scope.init = function () {
            angularScope = scope;
            if (projectId == "" || fileId == "") {
                Utility.showMessage(scope, $mdDialog, 'Some param expect!');
            }
            else {
                scope.getListTextSegment(projectId, fileId);
            }
        }
        scope.time;
        scope.isTranslateGrid = true;
        scope.clientsEdit = [];
        scope.ws = null;
        scope.projectName = 'project name';
        scope.fileName = 'file name';
        scope.colct = {};
        scope.data = [];
        scope.columnDefs = [];
        scope.columnExcelDefs = [{
                            displayName: 'STT',
                            cellTemplate: '<div ng-click="cellClick(row,col)" style="text-align:center;">{{row.rowIndex}}</div>',
                            width: 40,
                            enableCellEdit: false
                        },
                         {
                             field: 'TextSegment1',
                             displayName: 'Source Language',
                             cellTemplate: '<div ng-click="cellClick(row,col)" Id={{row.getProperty("Id")}} Field={{col.field}} ng-class=""><div class="ngCellText">{{row.getProperty(col.field)}}</div></div><div class="cellTooltip"></div>',
                             enableCellEdit: false,
                             width: 250,
                             resizable: true
                         },

                         {
                             field: 'TextSegment2',
                             displayName: 'DestinationLanguage',
                             cellTemplate: '<div Id={{row.getProperty("Id")}} Field={{col.field}} ng-class=""><div class="ngCellText">{{row.getProperty(col.field)}}</div></div><div class="cellTooltip"></div>',
                             enableCellEdit: true, 
                             width: 250,
                             resizable: true
                         },
                         {
                             field: 'Suggestion',
                             displayName: 'Suggestion',
                             enableCellEdit: false,
                             cellTemplate: '<div ng-click="cellClick(row,col)" Id={{row.getProperty("Id")}} Field={{col.field}} ng-class=""><div class="ngCellText">{{row.getProperty(col.field)}}</div></div><div class="cellTooltip"></div>',
                             width: 250,
                             minWidth: 200,
                             resizable: true
                         },
                         {
                             field: 'GoogleTranslate',
                             displayName: 'GoogleTranslate',
                             cellTemplate: '<div ng-click="cellClick(row,col)" Id={{row.getProperty("Id")}} Field={{col.field}} ng-class=""><div class="ngCellText">{{row.getProperty(col.field)}}</div></div><div class="cellTooltip"></div>',
                             enableCellEdit: false, 
                             width: 200,
                             resizable: true
                         },
                         {
                             field: 'Row',
                             displayName: 'Row',
                             enableCellEdit: false,
                             cellTemplate: '<div ng-click="cellClick(row,col)" Id={{row.getProperty("Id")}} Field={{col.field}} ng-class=""><div class="ngCellText">{{row.getProperty(col.field)}}</div></div><div class="cellTooltip"></div>',
                             minWidth: 100,
                             width: 100,
                             resizable: true
                         },
                         {
                             field: 'Col',
                             displayName: 'Col',
                             enableCellEdit: false,
                             cellTemplate: '<div ng-click="cellClick(row,col)" Id={{row.getProperty("Id")}} Field={{col.field}} ng-class=""><div class="ngCellText">{{row.getProperty(col.field)}}</div></div><div class="cellTooltip"></div>',
                             minWidth: 100,
                             width: 100,
                             resizable: true
                         },
                         {
                             field: 'SheetName',
                             displayName: 'SheetName',
                             cellTemplate: '<div ng-click="cellClick(row,col)" Id={{row.getProperty("Id")}} Field={{col.field}} ng-class=""><div class="ngCellText">{{row.getProperty(col.field)}}</div></div><div class="cellTooltip"></div>',
                             enableCellEdit: false,
                             minWidth: 100,
                             width: 150,
                             resizable: true
                         }];
        scope.columnOtherDefs = [{
                            displayName: 'STT',
                            cellTemplate: '<div  ng-click="cellClick(row,col)" style="text-align:center;">{{row.rowIndex}}</div>',
                            width: 40,
                            enableCellEdit: false
                        },
                         {
                             field: 'TextSegment1',
                             cellTemplate: '<div  ng-click="cellClick(row,col)" Id={{row.getProperty("Id")}} Field={{col.field}} ng-class=""><div class="ngCellText">{{row.getProperty(col.field)}}</div></div><div class="cellTooltip"></div>',
                             displayName: 'Source Language',
                             enableCellEdit: false,
                             minWidth: 250,
                             resizable: true
                         },
                         {
                             field: 'TextSegment2',
                             cellTemplate: '<div Id={{row.getProperty("Id")}} Field={{col.field}} ng-class=""><div class="ngCellText">{{row.getProperty(col.field)}}</div></div><div class="cellTooltip"></div>',
                             displayName: 'DestinationLanguage',
                             enableCellEdit: true,
                             editableCellTemplate: '<input type="text" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" />',
                             minWidth: 250,
                             resizable: true
                         },
                         {
                             field: 'Suggestion',
                             cellTemplate: '<div ng-click="cellClick(row,col)" Id={{row.getProperty("Id")}} Field={{col.field}} ng-class=""><div class="ngCellText">{{row.getProperty(col.field)}}</div></div><div class="cellTooltip"></div>',
                             displayName: 'Suggestion',
                             enableCellEdit: false,
                             width: 250,
                             minWidth: 200,
                             resizable: true
                         },
                         {
                             field: 'GoogleTranslate',
                             cellTemplate: '<div ng-click="cellClick(row,col)" Id={{row.getProperty("Id")}} Field={{col.field}} ng-class=""><div class="ngCellText">{{row.getProperty(col.field)}}</div></div><div class="cellTooltip"></div>',
                             displayName: 'GoogleTranslate',
                             enableCellEdit: false,
                             minWidth: 200,
                             resizable: true
                         }];

        scope.gridOptions = {
            data: 'data',
            enableColumnResize: true,
            enableCellEditOnFocus: 'tesst',
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
            columnDefs: 'columnDefs',
            rowHeight: 80
        };

        scope.$on('affterSetAttr', function () {
            if (scope.time) clearTimeout(scope.time);
            scope.time = setTimeout(function () {
                console.log('b:' + scope.time);
                if (scope.clientsEdit && scope.clientsEdit.length > 0) {
                    var clients = scope.clientsEdit;
                    var allCell = $('[Id][Field]');
                    var parentCell = allCell.closest('.ngCell');
                    var toolTip = allCell.next();
                    toolTip.text('');
                    toolTip.css("background-color", 'inherit');
                    parentCell.attr("isreadonly", "0");
                    parentCell.css("border", "none");
                    for (var i = 0; i < clients.length; i++) {
                        var cell = $('[Id=' + clients[i].Id + '][Field=' + clients[i].Field + ']')
                        var parentCell = cell.closest('.ngCell');
                        var toolTip = cell.next();
                        toolTip.text(clients[i]['UserName']);
                        toolTip.css("background-color", clients[i].Color);
                        parentCell.attr("isreadonly", "1");
                        parentCell.css("border", "2px solid " + clients[i].Color);
                    }
                }
            }, 400);
        })

        scope.timer = function () {
            if (!scope.lockTimer) {
                scope.lockTimer = true;
                setTimeout(scope.rebuildCell, 1000)
            }
        }

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

        //scope.$on('ngGridEventStartCellEdit', function (evt) {
        //    debugger;
        //})

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
            scope.onopen = function () {
                try {
                    console.log('connect to server');
                } catch (e) {

                }
            };
            ws.onmessage = scope.onmessage;
            ws.onerror = scope.onerror;
            ws.onclose = scope.onclose;
        }

        scope.onmessage = function (evt) {
            try {
                console.log(evt.data);
                var data = JSON.parse(evt.data);
                var arrClient = scope.grep(scope.clientsEdit, data, "UserId");
                if (arrClient.length == 0) {
                    scope.clientsEdit.push(data);
                    var cell = $('[Id=' + data.Id + '][Field=' + data.Field + ']')
                    var parentCell = cell.closest('.ngCell');
                    var toolTip = cell.next();
                    toolTip.text(data['UserName']);
                    toolTip.css("background-color", data.Color);
                    parentCell.attr("isreadonly", "1");
                    parentCell.css("border", "2px solid " + data.Color);
                }
                else if (arrClient.length == 1) {
                    //clear old Cell
                    var cell = $('[Id=' + arrClient[0].Id + '][Field=' + arrClient[0].Field + ']')
                    var parentCell = cell.closest('.ngCell');
                    var toolTip = cell.next();
                    toolTip.text('');
                    parentCell.css("border", "none");
                    parentCell.attr("isreadonly", "0");
                    //set new cell
                    var indexOldCell = scope.clientsEdit.indexOf(arrClient[0]);
                    scope.clientsEdit[indexOldCell] = data;
                    var cell = $('[Id=' + data.Id + '][Field=' + data.Field + ']');
                    var parentCell = cell.closest('.ngCell');
                    var toolTip = cell.next();
                    toolTip.css("background-color", data.Color);
                    toolTip.text(data['UserName']);
                    parentCell.attr("isreadonly", "1");
                    parentCell.css("border", "2px solid " + data.Color);
                }
                var arrRecord = scope.grep(angularScope.data, data, "Id")
                if (arrRecord.length == 0) {
                    //not found
                }
                else if (arrRecord.length == 1) {
                    arrRecord[0][data.Field] = data[data.Field];
                }
            } catch (e) {

            }
        };

        scope.onerror = function (evt) {
            try {
                console.log(evt.message);
            } catch (e) {

            }
        };

        scope.onclose = function () {
            Utility.showMessage(scope, $mdDialog, "Socket closed");
        };

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

        scope.grep = function (arr, data, field) {
            var arrResult = $.grep(arr, function (e) {
                return (e[field] == data[field]);
            });
            return arrResult;
        }
    }]);