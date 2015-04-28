'use strict';
var $jq = require('jquery');
exports.getHTML = function(){
	var tpl = __inline('practice.tpl');
	/**
	var template = angular.element(tpl);
	template.ready(function(){
		angular.module('gt_fe',[]);
		angular.bootstrap(template,['gt_fe']);
	});
	*/
    return tpl;
};

function LetterCtrl($scope) {
    $scope.welcome = "欢迎";
    console.log("yes");
}

(function(angular){
    angular.module('compile', [], function($compileProvider) {
        $compileProvider.directive('compile', function($compile) {
            return function(scope, element, attrs) {
                scope.$watch(
                    function(scope) {
                        return scope.$eval(attrs.compile);
                    },
                    function(value) {
                        element.html(value);
                        $compile(element.contents())(scope);
                    }
                );
            };
        });
    });
})(angular);;

exports.needCallback = true;
exports.callback = function($compile){
	console.log('I am callback');
	/**

	var $div = $jq('<div ng-controller="MyCtrl">{[content.label]}</div>');
    $jq(document.body).append($div);
 
    angular.element(document).invoke(function($compile) {
      var scope = angular.element($div).scope();
      $compile($div)(scope);
    });
	*/
}