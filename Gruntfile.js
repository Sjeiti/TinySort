/*global module,require*/
module.exports = function (grunt) {
	'use strict';

	var sPackage = 'package.json',
		oPackage = grunt.file.readJSON(sPackage)
		,sDistBanner = '<%'
			+'var subtask = uglify[grunt.task.current.target];'
			+'var file = subtask?subtask.src:\'\';'
			+'var filename = file.split(\'/\').pop();'
			+'%>'
			+'/*! <%= filename %>'
			+'\n * version: <%= pkg.version %>'
			+'\n * author: <%= pkg.author %>'
			+'\n * license: <%= pkg.license %>'
			+'\n * build: <%= grunt.template.today("yyyy-mm-dd") %>'
			//+'\n<% for ( var s in this) { %> \nthis.<%=s%><% } %>'
			+'\n */\n'
	;

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
	grunt.loadTasks('gruntTasks');

	grunt.initConfig({
		pkg: oPackage,

		watch: {
			gruntfile: {
				files: ['Gruntfile.js', '.jshintrc'],
				options: { spawn: false, reload: true }
			}
			,default: {
				files: ['src/*.js']
				,tasks: ['dist']
				,options: { spawn: false }
			}
			/*,revision: {
				files: ['.git/COMMIT_EDITMSG']
				,tasks: ['version_git']
				,options: { spawn: false }
			}*/
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

		// versioning
		,version_git: {
			tinysort: { files: {src:'src/tinysort.js'} }
			,charorder: { files: {src:'src/tinysort.charorder.js'} }
		}

		// command line interface
		,cli: {
			jsdoc: { cwd: './', command: '"node_modules/.bin/jsdoc" -c jsdoc.json', output: true }
			,jsdocprepare: { cwd: './jsdoc', command: 'grunt prepare', output: true }
			,jsdocInitNpm: { cwd: './jsdoc', command: 'npm install', output: true }
			,jsdocInitBower: { cwd: './jsdoc', command: 'bower install', output: true }
		}

		// map source js jsdoc variables to json variables
		,map_json: {
			package: {
				src: 'src/tinysort.js'
				,dest: 'package.json'
				,map: {
					title:'summary'
				}
			}
			,bower: {
				src: 'src/tinysort.js'
				,dest: 'bower.json'
				,map: {
					title:'summary'
				}
			}
			/*,jsdoc : {
				src: 'src/tinysort.js'
				,dest: 'jsdoc.json'
				,map: {
					summary:'templates.systemName'
					,copyright:'templates.copyright'
					,author:'templates.author'
				}
			}*/
		}

		// uses Phantomjs to render pages and inject a js file
		,renderPages: {
			docs: {
				baseUri: 'doc/'
				,dest: './temp/'
				,destType: 'json'
				,pages: ['tinysort.html']
				,inject: 'src-dev/js/phantomRenderDocs.js'
				,renderImage: false
			}
		}

		,extendDocs: {
			main: {
				src: './doc/index.html'
				,dest: './doc/index.html'
				,json: './temp/tinysort.json'
			}
		}

		,clean: {
			dist:	{ src: ['dist/**'] }
			,jsdoc:	{ src: ['doc/**'] }
			,temp:	{ src: ['temp/**'] }
		}

		,jshint: {
			options: { jshintrc: '.jshintrc' }
			,files: [
				'src/tinysort.js'
				,'src/tinysort.charorder.js'
			]
		}

		,uglify: {
			tinysort: {
				options: { banner: sDistBanner }
				,src: 'src/tinysort.js'
				,dest: 'dist/tinysort.min.js'
			}
			,charorder: {
				options: { banner: sDistBanner }
				,src: 'src/tinysort.charorder.js'
				,dest: 'dist/tinysort.charorder.min.js'
			}
			,tinysortgz: {
				src: 'src/tinysort.js'
				,dest: 'dist/tinysort.jgz'
				,compress: true
			}
			,charordergz: {
				src: 'src/tinysort.charorder.js'
				,dest: 'dist/tinysort.charorder.jgz'
				,compress: true
			}
		}

		,extendMarkdown: {
			bar:{}
		}

		,copy: {
			src2dist: {
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
		'watch'
	]);
	grunt.registerTask('dist',[
		'jshint'
		,'uglify:tinysort'
		,'uglify:charorder'
		,'uglify:tinysortgz'
		,'uglify:charordergz'
		,'copy:src2dist'
	]);
	grunt.registerTask('jsdocInit',[
		'cli:jsdocInitNpm'
		,'cli:jsdocInitBower'
	]);
	grunt.registerTask('version',[
		'version_git:tinysort'
		,'map_json'
	]);
	grunt.registerTask('jsdoc',[
		'clean:jsdoc'
		,'cli:jsdocprepare'
		,'cli:jsdoc'
		,'copy:dist2doc'
		,'renderPages:docs'
		,'extendDocs'
		,'extendMarkdown'
	]);
};