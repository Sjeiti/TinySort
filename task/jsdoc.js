var fs = require('fs')
    ,promisify = require('promisify-node')
		,rimraf = promisify(require('rimraf'))
		,exec = promisify(require('child_process').exec)
    ,glob = promisify(require('glob'))
    ,mkdirp = promisify(require('mkdirp'))
    ,jsdom = require('jsdom')
;

rimraf('./doc/*')
    .then(exec.bind(null,'"node_modules/.bin/jsdoc" -c jsdoc.json',{cwd:'./'}))
    .then(()=>(new Promise(r=>setTimeout(r,2000)))) // hacky
    .then(mkdirp.bind(null,'./doc/dist/'))
    .then(copy.bind(null,'./dist/*.js','./doc/dist/'))
    //.then(()=>'jsdoc files copied')
    //.then(console.log.bind(console))
    // read tinysort jsdoc output and insert options table to index
    .then(readFile.bind(null,'./doc/global.html'))
    .then(querySelector.bind(null,'#header-options+* table'))
    .then(parseTable)
;

function parseTable(table){
  var map = Array.prototype.map
      ,data = map.call(table.querySelectorAll('tr'),tr=>map.call(tr.children,child=>child.textContent.replace(/^\s*|\s*$/g,'')))
      ,fileIndex = './doc/index.html'
      ,fileMarkdown = './jsdoc/main.md'
      ,fileMarkdownTarget = './README.md'
      ,dl = ''
      ,md = '';
  data.shift();
  data.forEach(vars=>{
    dl += `<dt id="option-${vars[0]}">
           <a href="#option-${vars[0]}">${vars[0]}</a>
           <small class="option-type" title="type">${vars[1]}</htmlelement></small>
           <small class="option-default" title="default: ${vars[3]}">${vars[3]}</small>
         </dt>
         <dd>${vars[4]}</dd>`;
    md += `
**options.${vars[0]}** (${vars[1]}${(vars[3]&&'=')+vars[3]})
${vars[4]}
`;
  });
  dl = `<dl class="dl-horizontal options">${dl}</dl>`;
  // save index.html
  readFile(fileIndex)
      .then(source=>source.replace('{{options}}',dl))
      .then(save.bind(null,fileIndex));
  // save README.md
  readFile(fileMarkdown)
      .then(source=>source.replace('{{options}}',md))
      .then(save.bind(null,fileMarkdownTarget));
}

function querySelector(selector,source){
	return new Promise((resolve,reject)=>jsdom.env(source,[],(err,window)=>err&&reject(err)||resolve(window.document.querySelector(selector))));
}

function readFile(file){
  return new Promise((resolve,reject)=>fs.readFile(file,(err,data)=>err&&reject(err)||resolve(data.toString())));
}

function save(file,data) {
  console.log('saving',file);
  var mkdirp = require('mkdirp');
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

/*
function mkdirp(path){
  var mkdirp = require('mkdirp');
  return new Promise((resolve,reject)=>{
    mkdirp(path,err=>{
      err&&reject(err)||resolve();
    });
  });
}
*/

function copy(sourceGlob,target){
	//return (new Promise(r=>r()))//mkdirp(target)
   // .then(glob.bind(null,sourceGlob))
  return glob(sourceGlob)
    .then(files=>Promise.all(files.map(file=>copyFile(file,target+file.split('/').pop()))));
}

function copyFile(source, target) {
  return new Promise((resolve,reject)=>{
    var cbCalled = false
        ,rd = fs.createReadStream(source)
        ,wr = fs.createWriteStream(target);
    rd.on('error',err=>done(err));
    wr.on('error',err=>done(err));
    wr.on('close',()=>done());
    rd.pipe(wr);
    function done(err) {
      if (!cbCalled) {
        err&&reject(err)||resolve();
        cbCalled = true;
      }
    }
  });
}