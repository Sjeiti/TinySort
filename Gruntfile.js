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
			},
			opensource: {
				options: { banner: bannerTinysort },
				src: '../opensource/web/scripts/jquery.opensource.js',
				dest: 'libs/jquery.opensource.min.js',
				compress: true
			}
		},

		copy: {
			external: {
				files: [
					{
						expand: true,
						flatten: true,
						src: '../opensource/web/scripts/jquery.opensource.min.js',
						dest: 'libs/'
					},
					{
						expand: true,
						cwd: '../opensource/web/style/',
						src: ['*.!(less|php|*.php)','*/**'],
						dest: 'style/'
					},
					{
						expand: true,
						flatten: true,
						src: '../zen/dist/*.min.js',
						dest: 'libs/'
					}
				]
			}
		}
	});

//	grunt.registerMultiTask('distill', '', function() {
//		var sFile = fs.readFileSync(this.data.src).toString(),
//			sBanner = sFile.match(/\/\*!([\s\S]*?)\*\//g),
//			sToBanner = this.data.options.banner;
//		fs.writeFileSync(this.data.dest,sBanner!==null&&sBanner!==sToBanner?sFile.replace(sBanner,sToBanner):sFile);
//		grunt.log.writeln('File "'+this.data.dest+'" created.');
//	});

	grunt.registerTask('default',[
		'jshint'
		,'uglify:tinysort'
		,'uglify:charorder'
		,'uglify:tinysortgz'
		,'uglify:charordergz'
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
//		,'copy:jsdoc'
//		,'renderPages:docs'
//		,'extendDocs'
	]);
};