(function(angular){

    'use strict'

    angular.module('smartTable',['ngSanitize'])
        .directive('smartTable',['$compile','$parse',smartTable])
        .factory('SmartTableModel',['$http',SmartTableModel])
        .filter('smartTableTextTruncate',[smartTableTextTruncate])
        .directive('smartTableTooltipWrapper',[smartTableTooltipWrapper])

    function smartTable($compile,$parse){
        return {
            replace:true,
            scope:true,
            templateUrl:'dist/smart-table.html',
            link:smartTableLink.bind(null,$compile,$parse)
        };
    }

    function smartTableLink($compile, $parse, scope, element, attributes){
        var deregisterWatcher = scope.$watch(attributes.smartTable,function(_model){
            if(!_model)return;
            deregisterWatcher();
            var model = scope.smartTableModel = _model;
            var compiledTemplate = $compile(model.template)(scope);
            element.find('tbody').prepend(compiledTemplate);
            model.scope = scope;
            model.currentSortColumn = null;
            model.sortParams = { sortColumn: null, sortOrder: null };
            model.defaultSortParams = { sortColumn: null, sortOrder: null };
            if(model.config.defaultSortColumn){
                model.defaultSortParams.sortColumn = model.config.defaultSortColumn;
                model.currentSortColumn = model.config.defaultSortColumn;
            }
            if(model.config.defaultSortOrder){
                model.defaultSortParams.sortOrder = model.config.defaultSortOrder;
            }
            model.sortParams = angular.copy(model.defaultSortParams);
            model.selectedRows = [];
            model.apiUrlBasepath = scope.$eval(attributes.apiUrlBasepath);
            model.getRequestParams = $parse(attributes.requestParams);
            model.config.noRecordsMessage = model.config.noRecordsMessage || 'No records to show.';
            model.config.loadingMessage = model.config.loadingMessage || 'Loading data';
            model.reload(true);
        });
    }

    function SmartTableModel($http){
        return function(config){
            var model = this;
            model.loading = true;
            model.scope = null;
            model.config = config;
            model.page = 1;
            model.$data = null;
            model.totalItems = 0;
            model.resultSet = [];
            model.template = getTemplate(config.columns,config.isRowSelectable);
            console.log(model.template[0]);
            model.getPageCount = function(){
                if(model.config.rowsPerPage && model.totalItems){
                    return Math.ceil(model.totalItems/model.config.rowsPerPage);
                }else{
                    return 0;
                }
            };
            model.getCurrentBlock = function(){
                return Math.ceil(model.page/model.config.pagesPerBlock);
            };
            model.generatePagesArray = function(){
                var pages = [];
                var pageCount = model.getPageCount();
                if(pageCount >= 1){
                    var startIndex, endIndex;
                    var currentBlock = getCurrentBlock();
                    var pagesPerBlock = model.config.pagesPerBlock;
                    if(currentBlock === 1){
                        startIndex = 1;
                        endIndex = pagesPerBlock;
                    }else{
                        startIndex = ((currentBlock-1) * pagesPerBlock) + 1;
                        endIndex = ((currentBlock-1) * pagesPerBlock) + pagesPerBlock;
                    }
                    if(endIndex > pageCount){
                        endIndex = pageCount;
                    }
                    for(var index=startIndex; index<=endIndex; index++){
                        pages.push({
                            number:index,
                            active:model.page !== index
                        });
                    }
                }
                return pages;
            };
            model.reload = function(fetchFromServer){
                model.loading = true;
                var promise;
                if(fetchFromServer){
                    promise = getServerData(model,$http);
                }else{
                    promise = getCachedData();
                }
                promise.then(function(data){
                    model.totalItems = data.totalItems;
                    model.resultSet = data.resultSet;
                    if(model.config.isPaginated){
                        model.$data = self.filterDataByPageBlock(data);
                    }else{
                        model.$data = model.resultSet;
                    }
                    model.loading = false;
                },function(error){
                    console.log('SMART-TABLE-ERROR : \n'+JSON.stringify(error));
                    model.loading = false;
                });
            };
            model.resetSorting = function(){
                model.sortParams = angular.copy(model.defaultSortParams);
            };
            model.resetAndReload = function(retainSort){
                if(!retainSort){
                    model.resetSorting();
                }
                model.reload(true);
            };
            model.sortBy = sortBy.bind(null,model);
            model.getMarkerImageUrl = function (value, mappings) {
                var filteredMappings = mappings.filter(function (mapping) {
                    return mapping.mappedValue == value;
                });
                if (!filteredMappings.length) {
                    return null;
                } else {
                    return filteredMappings[0].imageUrl;
                }
            };
        };
    }

    function getTemplate(columns,isRowSelectable){
        var rows = angular.element('<tr class="data-rows" ng-repeat="datum in smartTableModel.$data" ng-show="!smartTableModel.loading && smartTableModel.$data.length"></tr>');
        if (isRowSelectable) {
            var rowSelectorCell = angular.element('<td class="row-select"></td>')
            rowSelectorCell.append('<input type="checkbox" ng-model="datum._isSelected" ng-click="model.updateSelectedRows()" />');
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
                    anchor.attr('ng-bind-html', "!datum['" + field + "'] ? ((datum['" + field + "']===0||datum['" + field + "']===false) ? datum['" + field + "'] : col.defaultText) : datum['" + field + "']");
                    fieldContainer.append(anchor);
                } else {
                    var span = angular.element('<span></span>');
                    span.attr('ng-bind-html', "(!datum['" + field + "'] ? ((datum['" + field + "']===0||datum['" + field + "']===false) ? datum['" + field + "'] : '" + columns[i].defaultText + "') : datum['" + field + "']) | smartTableTextTruncate:" + columns[i].maxLength);
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
                    infoColumnValue.attr('ng-bind', "!datum['" + infoColumnField + "'] ? ((datum['" + infoColumnField + "']===0||datum['" + infoColumnField + "']===false) ? datum['" + infoColumnField + "'] : '" + infoColumns[j].defaultText + "') : datum['" + infoColumnField + "']");
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
                    actionAnchor.attr('ng-click', "model.onAction(null," + actions[j].id + ",datum)");
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

    function getServerData(model,$http){
        // var requestParams = _scope.$eval(model.requestParamsString);
        // var dataFetchStartCallback = _scope.$eval(model.dataFetchStartCallbackString);
        // var dataFetchEndCallback = _scope.$eval(model.dataFetchEndCallbackString);
        // var apiUrlBasepath = _scope.$eval(model.apiUrlBasepathString);
        // postData = Object.assign({}, requestParams, model.sortParams);
        // if (params.$params.paginate) {
        //     postData = Object.assign(postData, _params.pagerData, { pageSize: params.$params.count });
        // }
        // var request = {
        //     method: 'POST',
        //     url: apiUrlBasepath + parameters.apiUrl,
        //     data: postData,
        //     params:{},
        //     headers:{}
        // };                
        // if (dataFetchStartCallback && typeof dataFetchStartCallback === 'function') {
        //     request = dataFetchStartCallback(request);
        //     if(!request){
        //         throw new Error('"'+model.dataFetchStartCallbackString+'" should return "request" object');
        //     }
        // }
        var requestParams = model.getRequestParams(model.scope);
        var postData = Object.assign({},model.sortParams,requestParams);
        return $http({
            method: 'POST',
            url: model.apiUrlBasepath+model.config.apiUrl,
            data: postData,
            params:{},
            headers:{}
        }).then(function (response) {
            // if (dataFetchEndCallback && typeof dataFetchEndCallback === 'function') {
            //     response = dataFetchEndCallback(response,null);
            //     if(!response){
            //         throw new Error('"'+model.dataFetchEndCallbackString+'" should return "response" object');
            //     }
            // }
            // if(!response.data.hasOwnProperty('resultSet')){
            //     throw new Error('resultSet node not found in response.');
            // }
            // if(!response.data.hasOwnProperty('totalItems')){
            //     throw new Error('totalItems node not found in response.');
            // }
            // cachedResponse = response.data;
            return response.data;
        }, function (error) {
            return $q.reject(error);
        });
    }

    function sortBy(model,column){
        model.sortParams.sortColumn = column;
        if (model.sortParams.sortColumn === model.currentSortColumn) {
            model.sortParams.sortOrder = model.sortParams.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            model.sortParams.sortOrder = 'asc';
            model.currentSortColumn = model.sortParams.sortColumn;
        }
        model.resetAndReload(true);
    }

    function smartTableTextTruncate(){
        return function(text,length){
            if(text && length && text.length > length){
                return text.substr(0,length) + '...';
            }else{
                return text;
            }
        };
    }

    function smartTableTooltipWrapper(){
        var getTextWidth = function (element) {
            var text = element.html();
            element.html('<span>' + text + '</span>');
            var width = element.find('span:first').clientWidth;
            element.html(text);
            return width;
        };
        return {
            // restrict: 'C',
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

if (typeof Object.assign != 'function') {
    Object.assign = function(target, varArgs) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            if (nextSource != null) {
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                    	to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}