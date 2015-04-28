/*
 * 使用__inline函数来嵌入其他文件
 */
__inline('scrat/scrat.js');
__inline('handlebars/handlebars.runtime-v1.3.0.js')
__inline('angular/angular.js');


require.config(__FRAMEWORK_CONFIG__);

/**

__inline('../boot/route.js');
__inline('../boot/run.js');
__inline('../boot/config.js');
__inline('../boot/app.js');
**/

var myApp = angular.module('gt-fe', [], function($interpolateProvider) { 
     $interpolateProvider.startSymbol('{['); 
     $interpolateProvider.endSymbol(']}'); 
});
