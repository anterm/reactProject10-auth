// нужен для использования отличного от es5 синтаксиса.
// т.е. применяется для:
// es2015, react, coffee и прочего.
// babel-core/register читает файл .babelrc, где указаны настройки.
require('babel-core/register')

// иногда бывает нужен для различных библиотек
require('es6-promise').polyfill()

// нужен для работы css-modules на сервере
require('css-modules-require-hook/preset')

// главный серверный файл, где уже можно использовать 
// синтаксис es2015, stage-0, react
require('./server.js')