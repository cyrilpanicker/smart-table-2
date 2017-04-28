(function(angular){

    'use strict'

    angular.module('smartTable',[])
        .directive('smartTable',['$compile',smartTable])
        .factory('SmartTableModel',['$http',SmartTableModel])

    function smartTable($compile){
        return {
            replace:true,
            scope:true,
            templateUrl:'dist/smart-table.html',
            controller:['$scope',smartTableController],
            link:smartTableLink.bind(null,$compile)
        };
    }

    function smartTableController($scope){
    }

    function smartTableLink($compile, scope, element, attributes){
        var deregisterWatcher = scope.$watch(attributes.smartTable,function(_model){
            if(!_model)return;
            deregisterWatcher();
            var model = scope.smartTableModel = _model;
            var compiledTemplate = $compile(model.template)(scope);
            element.find('tbody').prepend(compiledTemplate);
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
            model.$data = null;//filteredData
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
        };
    }

    function getTemplate(columns,isRowSelectable){
        var rows = $('<tr class="data-rows" ng-repeat="datum in smartTableModel.$data" ng-show="!smartTableModel.loading && smartTableModel.$data.length"></tr>');
        // if (isRowSelectable) {
        //     var rowSelectorCell = $('<td class="row-select"></td>')
        //     rowSelectorCell.append('<input type="checkbox" ng-model="datum._isSelected" ng-click="model.updateSelectedRows()" />');
        //     rows.append(rowSelectorCell);
        // }
        for (var i = 0; i < columns.length; i++) {
            var cell = $('<td></td>')
            cell.attr('style', 'text-align:' + (columns[i].alignment ? columns[i].alignment : 'left'))
            var fieldContainer = $('<div class="field-container"></div>');
            var markerContainer = $('<div class="marker-container"></div>');
            var infoColumnsContainer = $('<div class="info-columns-container"></div>');
            var actionsContainer = $('<div class="actions-container"></div>');
            var field = columns[i].field;
            var markers = columns[i].markers;
            var infoColumns = columns[i].infoColumns;
            var actions = columns[i].actions;
            if (markers && markers.length) {
                for (var j = 0; j < markers.length; j++) {
                    var markerGroupDatum = markers[j];
                    var markerGroup = $('<div class="marker-group"></div>');
                    var image = $('<img class="marker-image"></img>');
                    image.attr('ng-src', "{{" + markerGroupDatum.mappings.length + " && model.getMarkerImageUrl(datum['" + markerGroupDatum.field + "']," + JSON.stringify(markerGroupDatum.mappings) + ")}}");
                    markerGroup.append(image);
                    markerContainer.append(markerGroup);
                }
            }
            if (field) {
                if (columns[i].isFieldActionable) {
                    cell.addClass('has-actionable-field');
                    var anchor = $('<a href=""></a>');
                    anchor.attr('ng-click', "model.onAction('" + field + "',null,datum)");
                    anchor.attr('ng-bind-html', "!datum['" + field + "'] ? ((datum['" + field + "']===0||datum['" + field + "']===false) ? datum['" + field + "'] : col.defaultText) : datum['" + field + "']");
                    fieldContainer.append(anchor);
                } else {
                    var span = $('<span></span>');
                    span.attr('ng-bind-html', "(!datum['" + field + "'] ? ((datum['" + field + "']===0||datum['" + field + "']===false) ? datum['" + field + "'] : '" + columns[i].defaultText + "') : datum['" + field + "']) | smartTableTextTruncate:" + columns[i].maxLength);
                    span.attr('title', "{{datum['" + field + "'] && " + columns[i].maxLength + " && datum['" + field + "'].length>" + columns[i].maxLength + " ? datum['" + field + "'] : ''}}");
                    fieldContainer.append(span);
                }
            }
            if (infoColumns && infoColumns.length) {
                infoColumnsContainer.attr('smart-table-tooltip-wrapper', '');
                infoColumnsContainer.addClass('tooltip-wrapper');
                infoColumnsContainer.addClass(columns[i].infoTooltipPosition ? columns[i].infoTooltipPosition : 'left');
                infoColumnsContainer.append('<a href="" class="info-icon"></a>');
                var tooltipContainer = $('<div class="tooltip-container"></div>');
                var tooltipContent = $('<div class="tooltip-content"></div>');
                for (var j = 0; j < infoColumns.length; j++) {
                    var infoColumnField = infoColumns[j].field;
                    var infoColumnSpan = $('<span></span>');
                    infoColumnSpan.append('<span class="title">' + infoColumns[j].title + ' : </span>');
                    var infoColumnValue = $('<span></span>');
                    infoColumnValue.attr('ng-bind', "!datum['" + infoColumnField + "'] ? ((datum['" + infoColumnField + "']===0||datum['" + infoColumnField + "']===false) ? datum['" + infoColumnField + "'] : '" + infoColumns[j].defaultText + "') : datum['" + infoColumnField + "']");
                    infoColumnSpan.append(infoColumnValue);
                    infoColumnSpan.append('<br/>');
                    tooltipContent.append(infoColumnSpan);
                }
                tooltipContainer.append(tooltipContent);
                infoColumnsContainer.append(tooltipContainer);
            }
            if (actions && actions.length) {
                for (var j = 0; j < actions.length; j++) {
                    var actionAnchor = $('<a href=""></a>');
                    actionAnchor.attr('ng-click', "model.onAction(null," + actions[j].id + ",datum)");
                    if (actions[j].imageUrl) { actionAnchor.addClass('image-link'); }
                    if (!actions[j].imageUrl) {
                        actionAnchor.append('<span>' + actions[j].text + '</span>');
                    } else {
                        actionAnchor.append('<img src="' + actions[j].imageUrl + '" title="' + actions[j].text + '"></img>')
                    }
                    actionsContainer.append(actionAnchor);
                }
            }
            // cell.append(markerContainer);
            cell.append(fieldContainer);
            // cell.append(infoColumnsContainer);
            // cell.append(actionsContainer);
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
        return $http({
            method: 'POST',
            url: '/api/users',
            data: {},
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