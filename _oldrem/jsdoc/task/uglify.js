var uglify = require('uglify-js')
    ,mkdirp = require('mkdirp')
    ,jshint = require('jshint').JSHINT
    ,jsdom = require('jsdom')
    //,ngAnnotate = require('ng-annotate')
    ,fs = require('fs')
    ,warn = console.warn.bind(console)
    //
    ,html = 'tmpl/layout.tmpl'
    ,targetFolder = './template'
    ,sourceFolder = './src'
    ,targetJsSub = '/static'
    ,srcIndex = sourceFolder+'/'+html
    ,targetIndex = targetFolder+'/'+html
;

read(srcIndex)
    .then(replaceFileListings,warn)
    .then(hintFiles,warn)
    .then(listingToFile,warn)
;

function read(file){
  return new Promise((resolve,reject)=>fs.readFile(file,(err,data)=>err&&reject(err)||resolve(data&&data.toString())));
}

function replaceFileListings(data){
  var html = data.replace(/[\n\r\t]/g,'')
      ,codeBlocks = html.match(/<!--\s?script:\s?([^>]+\.js)\s?(:\w*)*-->/g)
      ,blocks = [];
  return Promise.all(codeBlocks&&codeBlocks.map(codeBlock=>{
    var regCodeBlock = new RegExp(codeBlock.replace('\\','\\\\')+'((?!<!--\\s?\\/script\\s?-->).)*<!--\\s?\\/script\\s?-->')
        ,fileNameAndOptions = codeBlock.match(/:(.*)--/).pop()
        ,splittedFilenName = fileNameAndOptions.split(':')
        ,fileName = splittedFilenName.shift()
        ,options = (o=>{splittedFilenName.forEach(s=>o[s]=true);return o;})({})
        ,block = html.match(regCodeBlock).shift()
    ;
    html = html.replace(block,'<script src="'+fileName+'"></script>');
    return querySelectorAll('script',block)
        .then(nodeList=>{
          var map = Array.prototype.map
              ,files = map.call(nodeList,script=>({elm:script,src:script.getAttribute('src')}));
          files.forEach(file=>{
            if (file.src) file.src = sourceFolder+file.src;
            else file.source = file.elm.textContent;
          });
          blocks.push({fileName,options,files});
        },warn);
  })||[])
      .then(save.bind(null,targetIndex,html.replace(/<!--[\s\S]*?-->/g,'')))
      .then(()=>blocks);
}

function querySelectorAll(selector,source){
  return new Promise((resolve,reject)=>jsdom.env(source,[],(err,window)=>err&&reject(err)||resolve(window.document.querySelectorAll(selector))));
}

function hintFiles(blocks){
  return read('./.jshintrc')
    .then(jshintrc=>{
      var options = JSON.parse(jshintrc)
          ,globals = options.globals
          ,allFiles = [];
      delete options.globals;
      blocks.forEach(data=>{
        if (data.options.jshint) Array.prototype.push.apply(allFiles,data.files);
      });
      return Promise.all(allFiles.filter(file=>!!file.src).map(file=>promiseHint(file.src, options, globals)));
    })
    .then(()=>blocks,warn.bind(console,'jshint failed'));
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

function listingToFile(blocks){
  blocks.forEach(data=>{
    Promise.all(data.files.map(file=>file.src&&read(file.src)||Promise.resolve(file.source)))
        .then(concatenate,warn)
        .then(source=>data.options.annotate?annotate(source):source)
        .then(minify,warn)
        .then(save.bind(null,targetFolder+targetJsSub+data.fileName),warn)
    ;
  });
}

function concatenate(files){
  return files.join(';');
}

function minify(source){
  return uglify.minify(source, {
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