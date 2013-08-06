(function($,tinysort){
	'use strict';
	var sTestName = 'Difference with latest version';
	$(function(){
		tinysort.add(sTestName,test);
	});
	function test(e){
		e.preventDefault();

		// load specific version of tinysort
		var aVersions = [
				'../../src/jquery.tinysort.js'
				,'src/jquery.tinysort.1.5.4.js'
			]
			,iNumToLoad = aVersions.length
			,aFn = []
		;
		$.each(aVersions,function(i,uri){
			$.ajax({
				url:uri
				,success: versionLoaded
			});
		});
		function versionLoaded(){
			iNumToLoad--;
			aFn.push({
				version: jQuery.tinysort.version
				,fn: jQuery.fn.tsort
			});
			if (iNumToLoad===0) startTest();
		}

		function getList(len){
			if (len===undefined) len = 100;
			var mUl = document.createElement('ul');
			while (len--) {
				var mLi = document.createElement('li');
				mLi.appendChild(document.createTextNode(1E9*Math.random()<<0));
				mUl.appendChild(mLi);
			}
			return mUl;
		}

		function startTest(){
			tinysort.log.clear();
			tinysort.log('start:',sTestName,"\n"); // log

			// prepare DOM
			var a100 = [], a1000 = [], i;
			for (i=0;i<10;i++) a100.push(getList(100));
			for (i=0;i<10;i++) a1000.push(getList(1000));


			var suite = new Benchmark.Suite();

			// add tests
			$.each(aFn,function(i,o){
				suite.add('TinySort '+o.version, function() {
					o.fn.apply($(a1000[0]));
					a1000.unshift(a1000.pop());
				});
			});

			// add listeners
			suite
				.on('cycle', function(event) {
				  tinysort.log(String(event.target));
				})
				.on('complete', function() {
					tinysort.log('=');
					tinysort.log('Fastest is ' + this.filter('fastest').pluck('name'));
				})
				.run({ 'async': true });
		}
	}
})(jQuery,tinysort);
