/*global module,require*/
module.exports = function (grunt) {
	'use strict';

	grunt.registerMultiTask('extendDocs','',function () {
		var fs = require('fs')
			//
			,data = this.data
			,sSrc = data.src
			,sDest = data.dest
			,sJSON = data.json
			//
			,sFile = fs.readFileSync(sSrc).toString()
			,oJSON = JSON.parse(fs.readFileSync(sJSON).toString())
			//
			,sOptions = ''
			,sNewFile
		;
		//["Parameters","Type","Argument","Default","Description"]
		for (var i=1,l=oJSON.length;i<l;i++) {
			var aOption = oJSON[i]
				,sName = aOption[0]
				,sType = aOption[1].replace('<','&lt;').replace('>','&gt;')
				,sDefault = aOption[3]
				,sDescription = aOption[4]
				;
			sOptions += '<dt id="option-'+sName+'"><a href="#option-'+sName+'"">'+sName+'</a><small class="option-type" title="type">'+sType+'</small><small class="option-default" title="default: '+sDefault+'">'+sDefault+'</small></dt>';
			sOptions += '<dd>'+sDescription+'</dd>';

		}
		sNewFile = sFile.replace(/{{options}}/,'<dl class="dl-horizontal options">'+sOptions+'</dl>');
		fs.writeFileSync(sDest,sNewFile);
	});
};