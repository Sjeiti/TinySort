var uglify = require('uglify-js')
    ,mkdirp = require('mkdirp')
    ,jshint = require('jshint').JSHINT
    ,jscs = require('jscs')
    ,fs = require('fs')
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

hintFiles(files.map(s=>sourceFolder+'/'+s))
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

function hintFiles(fileNames){
  return read('./.jshintrc')
      .then(jshintrc=>{
        var options = JSON.parse(jshintrc)
            ,globals = options.globals;
        delete options.globals;
        return Promise.all(fileNames.map(file=>promiseHint(file, options, globals)));
      })
      .then(()=>console.log('jshint passed'),warn.bind(console,'jshint failed'))
      .then(read.bind(null,'./.jscsrc'))
      .then(jscsrc=>Promise.all(fileNames.map(file=>promiseJscs(file,JSON.parse(jscsrc)))))
      .then(()=>console.log('jscs passed'),warn.bind(console,'jscs failed'))
      .then(()=>fileNames);
}

/**
 * @see http://jshint.com/docs/api/
 * @param {string[]} file
 * @param {object} options
 * @param {object} globals
 * @returns {Promise}
 */
function promiseHint(file, options, globals){
  return read(file)
  .then(source=>{
    return new Promise((resolve,reject)=>{
      jshint(source.split(/\r\n|\n|\r/), options, globals);
      var errors = jshint.errors;
      if (errors.length===0) {
        resolve();
      } else {
        errors.forEach(err=>console.warn(file,err.line+':'+err.character,err.reason));
        reject();
      }
    });
  });
}

function promiseJscs(file, options){
  return read(file)
  .then(source=>{
    return new Promise((resolve,reject)=>{
      var checker = new jscs()
          ,results
          ,errors;
      checker.configure(options);
      results = checker.checkString(source);
      errors = results.getErrorList();
      if (errors.length===0) {
        resolve();
      } else {
        results.getErrorList().forEach(error=>console.log(results.explainError(error, true) + "\n"));
        //console.log('file',file,source); // todo: remove log
        //errors.forEach(err=>console.warn(file,err));
        //errors.forEach(err=>console.warn(file,err.line+':'+err.character,err.reason));
        reject();
      }
    });
  });
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