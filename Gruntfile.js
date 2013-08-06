module.exports = function (grunt) {
	'use strict';

	GLOBAL.jQuery = {fn:{extend:function(){}}};
	require('./src/jquery.tinysort.js');
	require('./src/jquery.tinysort.charorder.js');

	var fs = require('fs'),
		sPackage = 'package.json',
		oPackage = grunt.file.readJSON(sPackage),
		bannerTinysort = getBanner(jQuery.tinysort),
		bannerCharorder = getBanner(jQuery.tinysort.charorder)
	;
	if (oPackage.version!==jQuery.tinysort.version) {
		grunt.log.writeln('Updated package version from',oPackage.version,'to',jQuery.tinysort.version);
		oPackage.version = jQuery.tinysort.version;
		fs.writeFile(sPackage,JSON.stringify(oPackage,null,'\t'));
	}

	function getBanner(o){
		return '/*! '+o.id+' '+o.version+'\n'+
			'* '+o.copyright+' '+ o.uri+'\n'+
			'* License:\n'+(function(o){
				var s = '';
				for (var ss in o) s += '*     '+ss+': '+o[ss]+'\n';
				return s;
			})(o.licensed)+
			'*/';
	}

	grunt.initConfig({
		pkg: oPackage,

		jshint: {
			options: { jshintrc: '.jshintrc' },
			files: [
				'src/jquery.tinysort.js',
				'src/jquery.tinysort.charorder.js'
			]
		},

		distill: {
			tinysort: {
				options: { banner: bannerTinysort },
				src: 'src/jquery.tinysort.js',
				dest: 'dist/jquery.tinysort.js'
			},
			charorder: {
				options: { banner: bannerCharorder },
				src: 'src/jquery.tinysort.charorder.js',
				dest: 'dist/jquery.tinysort.charorder.js'
			}
		},

		uglify: {
			tinysort: {
				options: { banner: bannerTinysort+'\n' },
				src: 'src/jquery.tinysort.js',
				dest: 'dist/jquery.tinysort.min.js'
			},
			charorder: {
				options: { banner: bannerCharorder+'\n' },
				src: 'src/jquery.tinysort.charorder.js',
				dest: 'dist/jquery.tinysort.charorder.min.js'
			},
			tinysortgz: {
				src: 'src/jquery.tinysort.js',
				dest: 'dist/jquery.tinysort.jgz',
				compress: true
			},
			charordergz: {
				src: 'src/jquery.tinysort.charorder.js',
				dest: 'dist/jquery.tinysort.charorder.jgz',
				compress: true
			}
		}
	});

	grunt.registerMultiTask('distill', '', function() {
		var sFile = fs.readFileSync(this.data.src).toString(),
			sBanner = sFile.match(/\/\*!([\s\S]*?)\*\//g),
			sToBanner = this.data.options.banner;
		fs.writeFile(this.data.dest,sBanner!==null&&sBanner!==sToBanner?sFile.replace(sBanner,sToBanner):sFile);
		grunt.log.writeln('File "'+this.data.dest+'" created.');
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default',[
		'jshint'
		,'distill'
		,'uglify'
	]);
};