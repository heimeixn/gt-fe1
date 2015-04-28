'use strict';

// require依赖的文件

var extend = require('extend');
var each = require('each');
var $jq = require('jquery');
//var $ng = require('angular');
var header = require('header');
var menu = require('menu');
var footer = require('footer');

// 内部变量
var lastView, timer;

// 定义页面和模块对应关系
var views = {
    '404': 'pages/404',
    'index': 'pages/index'
};

each(menu.views, function(view){
    views[view.name] = view.module || ('pages/' + view.name);
});

/**
 * 注册页面
 * @param {String|Object} name 页面名
 * @param {String|undefined} moduleName 模块名
 */
exports.register = function(name, moduleName){
    switch(typeof name){
        case 'string':
            views[name] = moduleName;
            break;
        case 'object':
            extend(views, name);
            break;
    }
};

/**
 * 判断页面是否注册
 * @param {String} name 页面名
 * @returns {boolean}
 */
exports.has = function(name){
    return views.hasOwnProperty(name);
};

/**
 * 加载页面，未找到则展示404页面
 * @param {Context} context 访问路径信息
 * @param {boolean} preload 是否预加载其他页面
 */
exports.load = function(context, preload){
    clearTimeout(timer);
    // 未注册页面则展示404
    var name = context.params.page;
    var title = context.queries.title;
    name = this.has(name) ? name : '404';
    var container = document.getElementById('site-views');
    var pages = container.querySelectorAll('[data-page]');
    each(pages, function(dom){
        var p = dom.getAttribute('data-page');
        if(p !== lastView){
            dom.innerHTML = '';
        }
        var clazz = ' ' + dom.className;
        dom.className = clazz.replace(/\s+active\b/, '').trim();
    });
    menu.active(lastView = name);
    // 异步加载
    require.async(views[name], function(page){
        //防止用户loading过程中多次切换
        if(name === lastView) {
            var dom = container.querySelector('[data-page="' + name + '"]');
            if(dom){
                if(!dom.innerHTML){
                    var content;
                    if(typeof page.getMarkdown === 'function'){
                        content = '<div class="site-view-inner markdown-body">' + page.getMarkdown() + '</div>';
                    } else {
                        content = page.getHTML();
                    }
                    dom.innerHTML = content;
                }
                dom.className = dom.className + ' active';
                if(typeof title !== 'undefined'){
                    var id = 'user-content-' + encodeURIComponent(title.toLowerCase());
                    var anchor = document.getElementById(id);
                    if(anchor){
                        timer = setTimeout((function(anchor, dom){
                            return function(){
                                dom.scrollTop = anchor.offsetTop;
                            }
                        })(anchor, dom), 401);
                    }
                }

                if(page.needCallback){
                    angular.module('site-views', [], function($compileProvider) {
                        // configure new 'compile' directive by passing a directive
                        // factory function. The factory function injects the '$compile'
                        console.log('Am I begin?');
                        $compileProvider.directive('site-views', function($compile) {
                          // directive factory creates a link function
                          return function(scope, element, attrs) {
                            scope.$watch(
                              function(scope) {
                                 // watch the 'compile' expression for changes
                                return scope.$eval(attrs.compile);
                              },
                              function(value) {
                                // when the 'compile' expression changes
                                // assign it into the current DOM
                                element.html(value);

                                // compile the new DOM and link it to the current
                                // scope.
                                // NOTE: we only compile .childNodes so that
                                // we don't get into infinite loop compiling ourselves
                                $compile(element.contents())(scope);
                                console.log('Am I done?');
                              }
                            );
                          };
                        })
                    });
                    page.callback();
                }
            }
        }

        // 如果开启预加载，则在完成当前页面加载之后去异步加载其他页面
        if(preload){
            // 将其他页面收集起来
            var others = [];
            each(views, function(moduleName, pageName){
                if(name !== pageName){
                    others.push(moduleName);
                }
            });
            // 发起异步请求获取，不阻塞当前页面
            require.async(others);
        }
    });
};

/**
 * 设置页面title
 * @param {String} title
 */
exports.title = function(title){
    document.title = title;
};

/**
 * 渲染页面骨架
 * @param {HTMLElement} dom
 */
exports.render = function(dom){
    // 使用__inline函数嵌入其他文件、图片。这里用作内嵌模板，
    // scrat已经配置了对handlebars后置的文件进行预编译，因此
    // 可以直接内嵌这里文件当做js函数执行
    var tpl = __inline('site.handlebars');
    dom.innerHTML = tpl({
        views: views
    });

    //渲染头部
    header.render($jq('#site-header')[0]);
    // 渲染menu模块
    menu.render($jq('#site-menu')[0]);
    // 渲染footer模块
    footer.render($jq('#site-footer')[0]);
};