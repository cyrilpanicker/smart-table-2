(function (angular) {

    'use strict'

    angular.module('smartTable', ['ngSanitize', 'QuickList'])
        .directive('smartTable', ['$compile', '$parse', smartTable])
        .factory('SmartTableModel', ['$q', '$http', '$timeout', SmartTableModel])
        .filter('smartTableTextTruncate', [smartTableTextTruncate])
        .directive('smartTableTooltipWrapper', [smartTableTooltipWrapper])
        .run(['$templateCache', function ($templateCache) {
            // $templateCache.put('dist/smart-table-pagination.html', '<nav ng-init="model=smartTableModel"> <p ng-show="model.totalItems">{{model.paginationTitle}}</p><ul ng-show="model.totalItems"> <li class="previous" ng-class="{\'disabled\': model.page===1}"> <a href="" ng-click="model.previousPage(model.page===1)"> <span>« PREV</span> </a> </li><li ng-class="{\'selected\': model.page==page}" quick-ng-repeat="page in model.pagesArray" quick-repeat-list="pagesList"> <a href="" ng-click="model.selectPage(page)"> <span ng-bind="page"></span> </a> </li><li class="next" ng-class="{\'disabled\': model.page===model.pageCount}"> <a href="" ng-click="model.nextPage(model.page===model.pageCount)"> <span>NEXT »</span> </a> </li></ul></nav>');
            // $templateCache.put('dist/smart-table.html', '<div class="smart-table"> <div class="top-pagination" ng-if="smartTableModel.config.isPaginated" ng-include="\'dist/smart-table-pagination.html\'" > </div><table> <thead> <tr> <th class="row-select" ng-show="smartTableModel.config.isRowSelectable"> <input class="select-all-checkBox" type="checkbox" ng-checked="smartTableModel.allRowsSelected" ng-click="smartTableModel.onSelectAllClick($event)"/> </th> <th quick-ng-repeat="column in smartTableModel.config.columns" quick-repeat-list="columnsList" ng-click="column.isSortable && smartTableModel.sortBy(column.field)" ng-class="{\'sortable\':column.isSortable, \'sort-asc\':smartTableModel.sortParams.sortColumn===column.field && smartTableModel.sortParams.sortOrder===\'asc\', \'sort-desc\':smartTableModel.sortParams.sortColumn===column.field && smartTableModel.sortParams.sortOrder===\'desc\'}" ng-style="{\'width\':column.width+\'%\'}" > <div ng-bind="column.title"></div></th> </tr></thead> <tbody> <tr class="no-records" ng-show="!smartTableModel.loading && !smartTableModel.$data.length"> <td colspan="{{smartTableModel.config.columns.length + smartTableModel.config.isRowSelectable}}" ng-bind="smartTableModel.config.noRecordsMessage" > </td></tr><tr class="loading-message" ng-show="smartTableModel.loading"> <td colspan="{{smartTableModel.config.columns.length + smartTableModel.config.isRowSelectable}}" ng-bind="smartTableModel.config.loadingMessage" > </td></tr></tbody> </table> <div class="bottom-pagination" ng-if="smartTableModel.config.isPaginated" ng-include="\'dist/smart-table-pagination.html\'" > </div></div>');
        }]);

    function smartTable($compile, $parse) {
        return {
            replace: true,
            scope: true,
            templateUrl: 'dist/smart-table.html',
            link: smartTableLink.bind(null, $compile, $parse)
        };
    }

    function smartTableLink($compile, $parse, scope, element, attributes) {
        var deregisterWatcher = scope.$watch(attributes.smartTable, function (_model) {
            if (!_model) return;
            deregisterWatcher();
            var model = scope.smartTableModel = _model;
            var compiledTemplate = $compile(model.template)(scope);
            element.find('tbody').prepend(compiledTemplate);
            model.scope = scope;
            model.selectAllCheckBox = document.getElementsByClassName('select-all-checkBox')[0];
            model.currentSortColumn = null;
            model.defaultSortParams = { sortColumn: null, sortOrder: null };
            if (model.config.defaultSortColumn) {
                model.defaultSortParams.sortColumn = model.config.defaultSortColumn;
                model.currentSortColumn = model.config.defaultSortColumn;
            }
            if (model.config.defaultSortOrder) {
                model.defaultSortParams.sortOrder = model.config.defaultSortOrder;
            }
            model.sortParams = angular.copy(model.defaultSortParams);
            model.selectedRows = [];
            model.apiUrlBasepath = scope.$eval(attributes.apiUrlBasepath);
            model.rowSelectCallback = scope.$eval(attributes.onRowSelect);
            model.onAction = scope.$eval(attributes.onAction);
            model.dataFetchStartCallbackString = attributes.onFetchStart;
            model.dataFetchEndCallbackString = attributes.onFetchEnd;
            model.dataFetchStartCallback = scope.$eval(model.dataFetchStartCallbackString);
            model.dataFetchEndCallback = scope.$eval(model.dataFetchEndCallbackString);
            model.getRequestParams = $parse(attributes.requestParams);
            model.config.noRecordsMessage = model.config.noRecordsMessage || 'No records to show.';
            model.config.loadingMessage = model.config.loadingMessage || 'Loading data';
            model.addMarkerImages = function () {
                var markerImages = angular.element(document.getElementsByClassName('marker-image'));
                for (var i = 0; i < markerImages.length; i++) {
                    var markerImageElement = angular.element(markerImages[i]);
                    var value = markerImageElement.attr('data-value');
                    var mapping = JSON.parse(markerImageElement.attr('data-mapping'));
                    markerImageElement.attr('src', model.getMarkerImageUrl(value, mapping));
                }
            };
            model.selectPage = function (page) {
                model.page = page;
                var currentBlock = model.getCurrentBlock();
                if (!model.previousBlock) {
                    model.previousBlock = currentBlock;
                    model.reload();
                } else if (model.previousBlock === currentBlock) {
                    model.reload();
                } else {
                    model.updatePagerParams();
                    model.previousBlock = currentBlock;
                    model.reload(true);
                }
            };
            model.nextPage = function (isDisabled) {
                if (isDisabled) return;
                model.selectPage(model.page + 1);
            };
            model.previousPage = function (isDisabled) {
                if (isDisabled) return;
                model.selectPage(model.page - 1);
            };
            model.reload(true);
        });
    }

    function SmartTableModel($q, $http, $timeout) {
        return function (config) {
            var model = this;
            model.loading = true;
            model.scope = null;
            model.config = config;
            model.page = 1;
            model.$data = null;
            model.totalItems = 0;
            model.resultSet = [];
            model.template = getTemplate(config.columns, config.isRowSelectable);
            console.log(model.template[0]);
            model.previousBlock = null;
            var cachedResponse = null;

            function getPageCount() {
                if (model.config.rowsPerPage && model.totalItems) {
                    return Math.ceil(model.totalItems / model.config.rowsPerPage);
                } else {
                    return 0;
                }
            }

            model.getCurrentBlock = function () {
                return Math.ceil(model.page / model.config.pagesPerBlock);
            };

            var generatePagesArray = function () {
                var pages = [];
                var pageCount = getPageCount();
                if (pageCount >= 1) {
                    var startIndex, endIndex;
                    var currentBlock = model.getCurrentBlock();
                    var pagesPerBlock = model.config.pagesPerBlock;
                    if (currentBlock === 1) {
                        startIndex = 1;
                        endIndex = pagesPerBlock;
                    } else {
                        startIndex = ((currentBlock - 1) * pagesPerBlock) + 1;
                        endIndex = ((currentBlock - 1) * pagesPerBlock) + pagesPerBlock;
                    }
                    if (endIndex > pageCount) {
                        endIndex = pageCount;
                    }
                    for (var index = startIndex; index <= endIndex; index++) {
                        pages.push(index);
                    }
                }
                return pages;
            };

            function updatePaginationBar() {
                model.pagesArray = generatePagesArray();
                model.pageCount = getPageCount();
                var from = (model.page - 1) * model.config.rowsPerPage + 1;
                var to = model.page * model.config.rowsPerPage;
                if (to > model.totalItems) {
                    to = model.totalItems;
                }
                model.paginationTitle = model.config.paginationTitleTemplate
                    .replace('{FROM}', from)
                    .replace('{TO}', to)
                    .replace('{TOTAL}', model.totalItems);
            }

            function getDataFilteredByPage() {
                var startIndex = (model.page - (model.config.pagesPerBlock * (model.getCurrentBlock() - 1))) - 1;
                return model.resultSet.slice(startIndex * model.config.rowsPerPage, (startIndex + 1) * model.config.rowsPerPage);
            }

            model.updatePagerParams = function () {
                if (!model.page) return;
                if (!model.previousBlock) {
                    model.pagerParams.startPage = 1;
                    model.pagerParams.endPage = model.config.pagesPerBlock;
                } else {
                    var currentBlock = model.getCurrentBlock();
                    if (model.previousBlock < currentBlock) {
                        model.pagerParams.startPage = model.page;
                        var value = model.page + model.config.pagesPerBlock - 1;
                        if (!model.totalItems) {
                            model.pagerParams.endPage = value;
                        } else {
                            var pageCount = getPageCount();
                            if (value <= pageCount) {
                                model.pagerParams.endPage = value;
                            } else {
                                model.pagerParams.endPage = pageCount;
                            }
                        }
                    } else {
                        model.pagerParams.startPage = model.page - model.config.pagesPerBlock + 1;
                        model.pagerParams.endPage = model.page;
                    }
                }
            };

            if (model.config.isPaginated) {
                model.pagerParams = {};
                model.updatePagerParams();
            }

            function getServerData() {
                model.loading = true;
                var requestParams = model.getRequestParams(model.scope);
                var postData = angular.extend({}, model.sortParams, requestParams);
                if (model.config.isPaginated) {
                    postData = angular.extend(postData, model.pagerParams, { pageSize: model.config.rowsPerPage });
                }
                var request = {
                    method: 'POST',
                    url: model.apiUrlBasepath + model.config.apiUrl,
                    data: postData,
                    params: {},
                    headers: {}
                };
                if (model.dataFetchStartCallback && typeof model.dataFetchStartCallback === 'function') {
                    request = model.dataFetchStartCallback(request);
                    if (!request) {
                        return $q.reject('"' + model.dataFetchStartCallbackString + '" should return "request" object');
                    }
                }
                return $http(request).then(function (response) {
                    if (model.dataFetchEndCallback && typeof model.dataFetchEndCallback === 'function') {
                        response = model.dataFetchEndCallback(response);
                        if (!response) {
                            return $q.reject('"' + model.dataFetchEndCallbackString + '" should return "response" object');
                        }
                    }
                    if (!response.data.hasOwnProperty('resultSet')) {
                        return $q.reject('"resultSet" node not found in response.');
                    }
                    if (!response.data.hasOwnProperty('totalItems')) {
                        return $q.reject('"totalItems" node not found in response.');
                    }
                    cachedResponse = response.data;
                    return response.data;
                }, function (error) {
                    return $q.reject(error);
                });
            }

            function getCachedData() {
                if (cachedResponse) {
                    return $q.resolve(cachedResponse);
                } else {
                    return getServerData();
                }
            }

            model.reload = function (fetchFromServer) {
                var promise;
                if (fetchFromServer) {
                    promise = getServerData();
                } else {
                    promise = getCachedData();
                }
                promise.then(function (data) {
                    model.totalItems = data.totalItems;
                    model.resultSet = data.resultSet;
                    $timeout(function () {
                        if (model.config.isPaginated) {
                            model.$data = getDataFilteredByPage();
                        } else {
                            model.$data = model.resultSet;
                        }
                        // $timeout(model.addMarkerImages);
                        if (model.config.isPaginated) {
                            updatePaginationBar();
                        }
                        if (model.config.isRowSelectable) {
                            resetSelectedRows();
                            model.updateSelectedRows();
                        }
                        model.allRowsSelected = false;
                        model.loading = false;
                    });
                }, function (error) {
                    model.allRowsSelected = false;
                    console.log('SMART-TABLE-ERROR');
                    console.log(error);
                    model.loading = false;
                });
            };
            model.resetSorting = function () {
                model.sortParams = angular.copy(model.defaultSortParams);
            };
            model.resetAndReload = function (retainSort) {
                model.page = 1;
                model.previousBlock = null;
                model.totalItems = 0;
                cachedResponse = null;
                model.updatePagerParams();
                if (!retainSort) {
                    model.resetSorting();
                }
                model.reload(true);
            };
            model.sortBy = sortBy.bind(null, model);
            // var counter = 0;
            model.getMarkerImageUrl = function (value, mappings) {
                // counter++;
                // console.log(counter);
                var filteredMappings = mappings.filter(function (mapping) {
                    return mapping.mappedValue == value;
                });
                if (!filteredMappings.length) {
                    return null;
                } else {
                    return filteredMappings[0].imageUrl;
                }
            };

            function resetSelectedRows() {
                if (!model.$data) return;
                model.$data.forEach(function (datum) {
                    datum._isSelected = false;
                });
            }

            function selectAllRows() {
                if (!model.$data) return;
                model.$data.forEach(function (datum) {
                    datum._isSelected = true;
                });
            }

            model.updateSelectedRows = function () {
                if (!model.$data) return;
                var selectedRows = model.$data.filter(function (datum) { return datum._isSelected; });
                if (selectedRows.length === model.$data.length) {
                    angular.element(model.selectAllCheckBox).prop('indeterminate', false);
                    if (model.$data.length) {
                        model.allRowsSelected = true;
                    }
                } else {
                    if (selectedRows.length !== 0) {
                        angular.element(model.selectAllCheckBox).prop('indeterminate', true);
                    } else {
                        angular.element(model.selectAllCheckBox).prop('indeterminate', false);
                    }
                    model.allRowsSelected = false;
                }
                if (model.rowSelectCallback && typeof model.rowSelectCallback === 'function') {
                    model.rowSelectCallback(selectedRows.map(function (_row) {
                        var row = angular.copy(_row);
                        delete row._isSelected;
                        return row;
                    }));
                }
            };

            model.onSelectAllClick = function (event) {
                var selectedRows = model.$data.filter(function (datum) { return datum._isSelected; });
                if (selectedRows.length && !model.allRowsSelected) {
                    model.allRowsSelected = true;
                    selectAllRows();
                } else {
                    if (event.target.checked) {
                        model.allRowsSelected = true;
                        selectAllRows();
                    } else {
                        model.allRowsSelected = false;
                        resetSelectedRows();
                    }
                }
                model.updateSelectedRows();
            };

        };
    }

    function getTemplate(columns, isRowSelectable) {
        var rows = angular.element('<tr class="data-rows" ng-repeat="datum in smartTableModel.$data" quick-repeat-list="dataList" ng-show="!smartTableModel.loading && smartTableModel.$data.length"></tr>');
        if (isRowSelectable) {
            var rowSelectorCell = angular.element('<td class="row-select"></td>')
            rowSelectorCell.append('<input type="checkbox" ng-model="datum._isSelected" ng-click="smartTableModel.updateSelectedRows()" />');
            rows.append(rowSelectorCell);
        }
        for (var i = 0; i < columns.length; i++) {
            var cell = angular.element('<td></td>')
            cell.attr('style', 'text-align:' + (columns[i].alignment ? columns[i].alignment : 'left'))
            var fieldContainer = angular.element('<div class="field-container"></div>');
            var markerContainer = angular.element('<div class="marker-container"></div>');
            var infoColumnsContainer = angular.element('<div class="info-columns-container"></div>');
            var actionsContainer = angular.element('<div class="actions-container"></div>');
            var field = columns[i].field;
            var markers = columns[i].markers;
            var infoColumns = columns[i].infoColumns;
            var actions = columns[i].actions;
            if (markers && markers.length) {
                for (var j = 0; j < markers.length; j++) {
                    var markerGroupDatum = markers[j];
                    var markerGroup = angular.element('<div class="marker-group"></div>');
                    var image = angular.element('<img class="marker-image"></img>');
                    image.attr('ng-src', "{{smartTableModel.getMarkerImageUrl(datum['" + markerGroupDatum.field + "']," + JSON.stringify(markerGroupDatum.mappings) + ")}}");
                    // image.attr('data-value',"{{::datum['"+markerGroupDatum.field+"']}}");
                    // image.attr('data-mapping',JSON.stringify(markerGroupDatum.mappings));
                    markerGroup.append(image);
                    markerContainer.append(markerGroup);
                }
                cell.append(markerContainer);
            }
            if (field) {
                if (columns[i].isFieldActionable) {
                    cell.addClass('has-actionable-field');
                    var anchor = angular.element('<a href=""></a>');
                    anchor.attr('ng-click', "smartTableModel.onAction('" + field + "',null,datum)");
                    anchor.attr('ng-bind-html', "datum['" + field + "']");
                    fieldContainer.append(anchor);
                } else {
                    var span = angular.element('<span></span>');
                    span.attr('ng-bind-html', "datum['" + field + "'] | smartTableTextTruncate:" + columns[i].maxLength);
                    span.attr('title', "{{datum['" + field + "'] && " + columns[i].maxLength + " && datum['" + field + "'].length>" + columns[i].maxLength + " ? datum['" + field + "'] : ''}}");
                    fieldContainer.append(span);
                }
                cell.append(fieldContainer);
            }
            if (infoColumns && infoColumns.length) {
                infoColumnsContainer.attr('smart-table-tooltip-wrapper', '');
                infoColumnsContainer.addClass('tooltip-wrapper');
                infoColumnsContainer.addClass(columns[i].infoTooltipPosition ? columns[i].infoTooltipPosition : 'left');
                infoColumnsContainer.append('<a href="" class="info-icon"></a>');
                var tooltipContainer = angular.element('<div class="tooltip-container"></div>');
                var tooltipContent = angular.element('<div class="tooltip-content"></div>');
                for (var j = 0; j < infoColumns.length; j++) {
                    var infoColumnField = infoColumns[j].field;
                    var infoColumnSpan = angular.element('<span></span>');
                    infoColumnSpan.append('<span class="title">' + infoColumns[j].title + ' : </span>');
                    var infoColumnValue = angular.element('<span></span>');
                    infoColumnValue.attr('ng-bind', "datum['" + infoColumnField + "']");
                    infoColumnSpan.append(infoColumnValue);
                    infoColumnSpan.append('<br/>');
                    tooltipContent.append(infoColumnSpan);
                }
                tooltipContainer.append(tooltipContent);
                infoColumnsContainer.append(tooltipContainer);
                cell.append(infoColumnsContainer);
            }
            if (actions && actions.length) {
                for (var j = 0; j < actions.length; j++) {
                    var actionAnchor = angular.element('<a href=""></a>');
                    actionAnchor.attr('ng-click', "smartTableModel.onAction(null," + actions[j].id + ",datum)");
                    if (actions[j].imageUrl) { actionAnchor.addClass('image-link'); }
                    if (!actions[j].imageUrl) {
                        actionAnchor.append('<span>' + actions[j].text + '</span>');
                    } else {
                        actionAnchor.append('<img src="' + actions[j].imageUrl + '" title="' + actions[j].text + '"></img>');
                    }
                    actionsContainer.append(actionAnchor);
                }
                cell.append(actionsContainer);
            }
            rows.append(cell);
        }
        return rows;
    }

    function sortBy(model, column) {
        model.sortParams.sortColumn = column;
        if (model.sortParams.sortColumn === model.currentSortColumn) {
            model.sortParams.sortOrder = model.sortParams.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            model.sortParams.sortOrder = 'asc';
            model.currentSortColumn = model.sortParams.sortColumn;
        }
        model.resetAndReload(true);
    }

    function smartTableTextTruncate() {
        return function (text, length) {
            if (text && length && text.length > length) {
                return text.substr(0, length) + '...';
            } else {
                return text;
            }
        };
    }

    function smartTableTooltipWrapper() {
        var getTextWidth = function (element) {
            var text = element.html();
            element.html('<span>' + text + '</span>');
            var width = element.find('span:first').width();
            element.html(text);
            return width;
        };
        return {
            link: {
                pre: angular.noop,
                post: function (scope, element) {
                    element.on('mouseenter', function () {
                        var textWidth = getTextWidth(element.find('.tooltip-content'));
                        if (textWidth < 260) {
                            element.find('.tooltip-container').width(textWidth + 1);
                        }
                    });
                }
            }
        };
    }

})(angular);