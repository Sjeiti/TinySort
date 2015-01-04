
module.exports = function(grunt) {
	'use strict';
	grunt.registerMultiTask('map_json', 'Update JSON with other JSON data', function() {
		var fs = require('fs')
			,sSrc = this.data.src
			,sJson = this.data.dest
			,oMap = this.data.map||{}
			//
			,bChanged = false
			//
			,oBanner = readBanner(sSrc)
			,oJson = grunt.file.readJSON(sJson)
		;

		for (var bannerKey in oBanner) {
			var sJsonKey = oMap[bannerKey]||bannerKey
				,oValJ = getVal(oJson,sJsonKey)//oJson[sJsonKey]
				,oValB = oBanner[bannerKey];
			if (oValJ!==undefined&&oValJ!==oValB) {
				grunt.log.writeln('Updated '+sJson+' '+sJsonKey+' from',oValJ,'to',oValB);
				setVal(oJson,sJsonKey,oValB);
				bChanged = true;
			}
		}
		if (bChanged) {
			fs.writeFileSync(sJson,JSON.stringify(oJson,null,'\t'));
		}

		function getVal(object,prop){
			var aProp = prop.split('.');
			aProp.forEach(function(property){
				object = object[property];
			});
			return object;
		}

		function setVal(object,prop,val){
			var aProp = prop.split('.')
				,sVal = aProp.pop();
			aProp.forEach(function(property){
				object = object[property];
			});
			object[sVal] = val;
		}

		function readBanner(sourceFile){
			var sSource = fs.readFileSync(sourceFile).toString()
				,sBanner = sSource.match(/\/\*\*([\s\S]*?)\*\//g)[0]
				,aLines = sBanner.split(/[\n\r]/g)
				,aMatchName = sBanner.match(/(\s?\*\s?([^@]+))/g)
				,sName = aMatchName.shift().replace(/[\/\*\s\r\n]+/g,' ').trim()
				,oBanner = {title:sName};
			for (var i = 0, l = aLines.length; i<l; i++) {
				var sLine = aLines[i]
					,aMatchKey = sLine.match(/(\s?\*\s?@([^\s]*))/);
				if (aMatchKey) {
					var sKey = aMatchKey[2];
					oBanner[sKey] = sLine.split(sKey).pop().trim();
				}
			}
			return oBanner;
		}
	});
};