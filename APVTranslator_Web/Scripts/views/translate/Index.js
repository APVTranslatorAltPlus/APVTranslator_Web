apvApp.controller('translateCtrl', ['$scope', '$http', 'cfpLoadingBar', '$mdDialog', 'cfpLoadingBar',
    function (scope, http, cfpLoadingBar, $mdDialog, cfpLoadingBar) {
        scope.init = function () {
            scope.loadListProject();
        }
        scope.data = [];
        scope.columnDefs = [{ displayName: 'STT', cellTemplate: '<div style="text-align:center;">{{row.rowIndex}}</div>', width: 40, enableCellEdit: false },
                         { field: 'SourceLanguage', displayName: 'Source Language', enableCellEdit: false, minWidth: 250, resizable: true },
                         { field: 'DestinationLanguage', displayName: 'DestinationLanguage', enableCellEdit: true, minWidth: 250, resizable: true },
                         { field: 'Suggestion', displayName: 'Suggestion', enableCellEdit: false, width: 250, minWidth: 200, resizable: true },
                         { field: 'GoogleTranslate', displayName: 'GoogleTranslate', enableCellEdit: false, minWidth: 200, resizable: true },
                         { field: 'Row', displayName: 'Row', enableCellEdit: false, minWidth: 100, width: 100, resizable: true },
                         { field: 'Col', displayName: 'Col', enableCellEdit: false, minWidth: 100, width: 100, resizable: true },
                         { field: 'SheetName', displayName: 'SheetName', enableCellEdit: false, minWidth: 100, width: 150, resizable: true }];
        scope.gridOptions = {
            data: 'data',
            enableCellSelection: false,
            enableColumnResize: true,
            selectedItems: scope.gridSelections,
            rowHeight: 50,
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
        function rowTemplate() {
            return '<div ng-dblclick="rowDblClick(row)" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}" ng-cell></div>';
        }
    }]);