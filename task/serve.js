/**
 * node task/serve dist 8383
 */

var /*fs = require('fs')
		,*/express    = require('express')
		//,bodyParser = require('body-parser')
		,serveStatic = require('serve-static')
		,openBrowser = require('open')
		,root = process.argv[2]||'doc'
		,port = process.argv[3]||8183
		//,router = express.Router()
;

express()
    .use(serveStatic('./'+root+'/'))
		//.use(bodyParser.urlencoded({ extended: true }))
		//.use(bodyParser.json())
		//.use('/api', router)
    .listen(port);

/*router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});

router.get('/bank', function(req, res) {
	var fs = require('fs');
	fs.readdir('./output', function(err, items) {
    res.json(items);
	});
});

router.get('/bank/:id', function(req, res) {
  fs.readFile('./output/'+req.params.id+'.txt', function (err, content) {
    err&&console.log(err)||res.json(Papa.parse(content.toString()));
  });
});

router.get('/bank/:id/raw', function(req, res) {
  fs.readFile('./output/'+req.params.id+'.txt', function (err, content) {
    err&&console.log(err)||res.send(content.toString());
  });
});*/

openBrowser('http://localhost:'+port);