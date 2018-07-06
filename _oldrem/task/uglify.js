var uglify = require('uglify-js')
    ,mkdirp = require('mkdirp')
    ,fs = require('fs')
    ,exec = require('child_process').exec
    //
    ,warn = console.warn.bind(console)
    //
    ,targetFolder = './dist'
    ,sourceFolder = './src'
    ,files = [
      'tinysort.js'
      ,'tinysort.charorder.js'
      ,'jquery.tinysort.js'
    ]
;

validateFiles(files.map(s=>sourceFolder+'/'+s))
  .then(files=>Promise.all(files.map(
    file=>read(file)
      .then(source=>{
        var fileTarget = file.replace(sourceFolder,targetFolder);
        save(fileTarget,source);
        save(fileTarget.replace(/\.js$/,'.min.js'),minify(source));
      })
  )))
;

function read(file){
  return new Promise((resolve,reject)=>fs.readFile(file,(err,data)=>err&&reject(err)||resolve(data.toString())));
}

function validateFiles(fileNames){
  return promiseExec('jshint ./src/')
      .then(()=>console.log('jshint passed'),warn.bind(console,'jshint failed\n\n'))
      .then(()=>promiseExec('jscs ./src/'))
      .then(()=>console.log('jscs passed'),warn.bind(console,'jscs failed\n\n'))
      .then(()=>fileNames);
}

function promiseExec(command){
	return new Promise((resolve,reject)=>exec(command,(error, stdout)=>error&&reject(stdout)||resolve()));
}

function minify(source,options){
  var matchComment = source.match(/\/\*\*\s*\n([^\*]*(\*[^\/])?)*\*\//)
      ,comment = matchComment&&(matchComment.shift()+'\n')||'';
  return comment+uglify.minify(source,options||{
    fromString: true
    ,pure_getters: true
  }).code;
}

function save(file,data) {
  console.log('saving',file);
  return new Promise(function(resolve,reject){
    mkdirp(getDirName(file), function(err) {
      err&&reject(err);
      fs.writeFile(file, data, resolve);
    });
  });
}

function getDirName(file){
  return file.replace(/[^\/\\]*\.\w{0,4}$/,'');
}