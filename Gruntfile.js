module.exports = function (grunt) {
	'use strict';

	var sPackage = 'package.json',
		oPackage = grunt.file.readJSON(sPackage)
		,bannerTinysort = '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %> */'
		,bannerCharorder = bannerCharorder;

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
	grunt.loadTasks('gruntTasks');

	/*GLOBAL.jQuery = {fn:{extend:function(){}}};
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
		return '*//*! '+o.id+' '+o.version+'\n'+
			'* '+o.copyright+' '+ o.uri+'\n'+
			'* License:\n'+(function(o){
				var s = '';
				for (var ss in o) s += '*     '+ss+': '+o[ss]+'\n';
				return s;
			})(o.licensed)+
			'*//*';
	}*/

	grunt.initConfig({
		pkg: oPackage,

		watch: {
			gruntfile: {
				files: ['Gruntfile.js', '.jshintrc'],
				options: { spawn: false, reload: true }
			}
			,default: {
				files: ['src/*.js']
				,tasks: ['jshint']
				,options: { spawn: false }
			}
			,revision: {
				files: ['.git/COMMIT_EDITMSG']
				,tasks: ['version_git']
				,options: { spawn: false }
			}
			,jsdoc: {
				files: [
					'jsdoc/template/tmpl/*.tmpl'
					,'jsdoc/src/**/*'
					,'jsdoc/template/static/styles/*.css'
					,'jsdoc/**/*.md'
				]
				,tasks: ['jsdoc']
				,options: { spawn: false }
			}
		}

		// update revision
		,version_git: {
			main: {
				files: {
					src: 'src/*.js'
					,package: './package.json'
					,bower: './bower.json'
				}
			}
			,mainVar: {
				files: {src:'src/tinysort.js'}
				,options: {regex: /sVersion\s*=\s*'(\d+\.\d+\.\d+)'/}
			}
		}

		// command line interface
		,cli: {
			/*elasticsearch: { cwd: 'elasticsearch-1.4.0/bin/', command: 'elasticsearch', output: true }
			,*/jsdoc: { cwd: './', command: '"node_modules/.bin/jsdoc" -c jsdoc.json', output: true }
			//,jsgrudoc: { cwd: './', command: 'jsdoc -c jsdoc.json', output: true }
			,jsdocprepare: { cwd: './jsdoc', command: 'grunt prepare', output: true }
			//
			,jsdocInitNpm: { cwd: './jsdoc', command: 'npm install', output: true }
			,jsdocInitBower: { cwd: './jsdoc', command: 'bower install', output: true }
		}

		// uses Phantomjs to render pages and inject a js file
		,renderPages: {
			template: {
				baseUri: 'src/'
				,dest: './temp/stripped/'
				,pages: ['widget.html'] // todo: change to {"dest":src} style
				,inject: 'src-dev/js/phantomStripWidget.js'
				,renderImage: false
			}
			,docs: {
				baseUri: 'doc/'
				,dest: './temp/'
				,destType: 'json'
				,pages: ['tinysort.html'] // todo: change to {"dest":src} style
				,inject: 'src-dev/js/phantomRenderDocs.js'
				,renderImage: false
			}
		}

		// clean
		,clean: {
			dist: {
				src: ['dist/**']
			}
			,jsdoc: {
				src: ['doc/**']
			}
			,temp: {
				src: ['temp/**']
			}
		}

		,jshint: {
			options: { jshintrc: '.jshintrc' },
			files: [
				'src/jquery.tinysort.js',
				'src/jquery.tinysort.charorder.js'
			]
		},

		uglify: {
			tinysort: {
				options: { banner: bannerTinysort+'\n' },
				src: 'src/jquery.tinysort.js',
				dest: 'dist/tinysort.min.js'
			},
			charorder: {
				options: { banner: bannerCharorder+'\n' },
				src: 'src/jquery.tinysort.charorder.js',
				dest: 'dist/tinysort.charorder.min.js'
			},
			tinysortgz: {
				src: 'src/jquery.tinysort.js',
				dest: 'dist/tinysort.jgz',
				compress: true
			},
			charordergz: {
				src: 'src/jquery.tinysort.charorder.js',
				dest: 'dist/tinysort.charorder.jgz',
				compress: true
			}
		},

		copy: {
			external: {
				files: [
//					{
//						expand: true,
//						cwd: '../opensource/web/style/',
//						src: ['*.!(less|php|*.php)','*/**'],
//						dest: 'style/'
//					},
//					{
//						expand: true,
//						flatten: true,
//						src: '../zen/dist/*.min.js',
//						dest: 'libs/'
//					}
				]
			}
			,src2dist: {
				files: [
					{
						expand: true
						,cwd: './src/'
						,src: ['tinysort.js','tinysort.charorder.js']
						,dest: 'dist/'
						,filter: 'isFile'
						,dot: true
					}
				]
			}
			,dist2doc: {
				files: [
					{
						expand: true
						,cwd: './'
						,src: ['dist/**']
						,dest: 'doc/'
						,filter: 'isFile'
						,dot: true
					}
				]
			}
		}
	});

	grunt.registerTask('default',[
		'jshint'
		,'uglify:tinysort'
		,'uglify:charorder'
		,'uglify:tinysortgz'
		,'uglify:charordergz'
		,'copy:src2dist'
	]);

	grunt.registerTask('opensource',[
		'uglify:opensource'
	]);

	grunt.registerTask('external',[
		'copy:external'
	]);
	grunt.registerTask('jsdocInit',[
		'cli:jsdocInitNpm'
		,'cli:jsdocInitBower'
	]);
	grunt.registerTask('jsdoc',[
		'clean:jsdoc'
		,'cli:jsdocprepare'
		,'cli:jsdoc'
		,'copy:dist2doc'
//		,'copy:jsdoc'
//		,'renderPages:docs'
//		,'extendDocs'
	]);
};