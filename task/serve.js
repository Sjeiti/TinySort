/**
 * node task/serve dist 8383
 */

var express    = require('express')
		,serveStatic = require('serve-static')
		,openBrowser = require('open')
		,root = process.argv[2]||'doc'
		,port = process.argv[3]||8183
;

express()
    .use(serveStatic('./'+root+'/'))
    .listen(port);

openBrowser('http://localhost:'+port);