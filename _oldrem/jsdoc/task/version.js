/**
 * node task/version major=1 minor
 */

/*
  One reason for continuing to use the single letter options is because they can be strung together: ls -ltr is a lot easier to type than ls --sort=time --reverse --format=long. There are a number of times when both are good to use. As for searching for this topic, try "unix command line options convention".
*/

var fs = require('fs')
  ,exec = require('child_process').exec
  //
  ,files = [
     './src/js/jsdoc.js'
    ,'./package.json'
    ,'./bower.json'
  ]
  //
  ,versionObject = {major:0,minor:1,patch:2}
  // set default options // todo extend
  ,options = {
      major: false
      ,minor: false
      ,patch: false
      ,version: false
      ,build: 'num'//||hash
      ,git: false
      ,regex: /\d+\.\d+\.\d+-?[0-9A-Za-z-.]*\+?[0-9A-Za-z-.]*/
  }
  //,filesNum = files.length
  ,isBump
;

process.argv.slice(2).forEach(s=>{
  var split = s.split('=');
  options[split.shift()] = split.pop()||true;
});

// if all options are false simply bump patch
if (options.major===false&&options.minor===false&&options.patch===false) {
  options.patch = true;
}

// set bump string
isBump = options.major===true&&'major'||options.minor===true&&'minor'||options.patch===true&&'patch';

// check if GIT is installed for project
if (options.git) {
  exec('git rev-list HEAD --count', function(error,stdout){//,stderr
    var match = stdout.match(/\d+/)
      ,hasGit = !!match;
    if (hasGit) {
      iterateFiles(match.pop());
    } else {
      console.warn('GIT not found'); // log
    }
  });
} else {
  iterateFiles();
}

// Iterate over all specified file groups.
function iterateFiles(gitRevision){
        var highestVersion = '0.0.0'
            ,highestVersionNumeral = 0
            ,processedFiles = [];
  files.forEach(src=>{
    var source = fs.readFileSync(src).toString()
      ,version
      ,versionNewList
      ,versionNew
      ,isRegexArray = Array.isArray(options.regex)
                ,versionNumber
    ;
    if (isRegexArray) {
      var versionMax = 0;
      options.regex.forEach(function(regex){
        var check = getSourceVersion(source,regex)
          ,checkNumber = versionToInt(check);
        if (checkNumber>versionMax) {
          versionMax = checkNumber;
          version = check;
        }
      });
    } else {
      version = getSourceVersion(source,options.regex);
    }
    versionNewList = getVersionArray(version);
    //
    // bump version
    if (isBump) {
      var start = versionObject[isBump]
        ,len = 3-start
      ;
      for (var j=0;j<len;j++) {
        var pos = 3-len+j;
        if (j===0) {
          versionNewList[pos]++;
        } else {
          versionNewList[pos] = 0;
        }
      }
    } else { // set version
      if (!isBool(options.major)) versionNewList[0] = options.major;
      if (!isBool(options.minor)) versionNewList[1] = options.minor;
      if (!isBool(options.patch)) versionNewList[2] = options.patch;
    }
            versionNew = versionNewList.join('.');
            versionNumber = versionToInt(versionNew);
            if (versionNumber>highestVersionNumeral) {
                highestVersionNumeral = versionNumber;
                highestVersion = versionNew;
            }
            processedFiles.push({
                version: version
                ,source: source
                ,src: src
            });
        });
  processedFiles.forEach(function(o) {
    var src = o.src
      ,source = o.source
      ,version = o.version
      ,versionNew = highestVersion
      ,isRegexArray = Array.isArray(options.regex)
    ;
    // add release
    /*if (isParamRelease) {
      versionNew = versionNew+'-'+paramRelease;
    }*/
    // add build
    if (options.git) {
      versionNew = versionNew+'+'+gitRevision;
    }
    // save file
    if (versionNew!==version) {
      if (isRegexArray) {
        options.regex.forEach(function(regex){
          source = replaceSource(source,regex,versionNew);
        });
      } else {
        source = replaceSource(source,options.regex,versionNew);
      }
      fs.writeFileSync(src,source);
      console.log('File \''+src+'\' updated from',version,'to',versionNew);
    } else {
      console.log('File \''+src+'\' is up to date',version);
    }
  });
}

function replaceSource(source,regex,version){
  var match = source.match(regex);
  if (match) {
    var matchNum = match.length
      ,replace = match.pop();
    if (matchNum===2) {
      var sFull = match.pop();
      source = source.replace(sFull,sFull.replace(replace,version));
    } else {
      source = source.replace(regex,version);
    }
  }
  return source;
}

function getSourceVersion(source,regex){
  var match = source.match(regex);
  return match?match.slice(0).pop():'0.0.0';
}

function getVersionArray(version){
  return version.split(/[-+]/g).shift().split('.').map(s=>parseInt(s,10));
}

function versionToInt(version){
  var max = 1E6
    ,number = 0;
  getVersionArray(version).forEach(function (n,i) {
    number += n * Math.pow(max,3 - i);
  });
  return number;
}

function isBool(o){
  return o===true||o===false;
}