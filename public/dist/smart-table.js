(function(angular){

    'use strict'

    angular.module('smartTable',[])
        .directive('smartTable',[smartTable])
        .factory('SmartTableModel',[SmartTableModel])

    function smartTable(){
        return {
            replace:true,
            scope:true,
            templateUrl:'dist/smart-table.html',
            controller:['$scope',smartTableController],
            compile:smartTableCompile
        };
    }

    function smartTableController($scope){
        var deregisterWatcher = $scope.$watch('smartTableModel.params',function(params){
            if(!params)return;
            deregisterWatcher();
            var model = $scope.smartTableModel;
            // model.selectPage = function (page) {
            //     if (!!page && page.number && page.active) {
            //         params.page(page.number);
            //     }
            // };
            // model.previous = function (disableFlag) {
            //     if (disableFlag) return;
            //     var pagenumber = params.page() - 1;
            //     params.page(pagenumber);
            // };
            // model.next = function (disableFlag) {
            //     if (disableFlag) return;
            //     var pagenumber = params.page() + 1;
            //     params.page(pagenumber);
            // };
        });
    }

    function smartTableCompile(){
        return smartTableLink;
    }

    function smartTableLink(scope, element, attributes){
        var deregisterWatcher = scope.$watch(attributes.smartTable,function(model){
            if(!model)return;
            deregisterWatcher();
            scope.smartTableModel = model;
        });
    }

    function SmartTableModel(){
        return function(config){
            this.config = config;
            this.params = {
                param1:'test-param1'
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