'use strict';

module.exports = {
    getHTML: function () {
        var data = [
            {
                title: '多语言编译',
                icon: 'code',
                href: '/#!/settings?title=settings.parser.stylus'
            },
            {
                title: '项目脚手架',
                icon: 'wrench',
                href: '/#!/command?title=scrat init'
            }
        ];
        var tpl = __inline('index.handlebars');
        return tpl(data);
    }
};