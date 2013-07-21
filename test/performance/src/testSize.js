(function($){
	var performance = window.perfomance = window.perfomance||{};
	performance.testSize = function(e){
		e.preventDefault();
		// load specific version of tinysort
		var aVersions = [
				'../../src/jquery.tinysort.js'
				//,'src/jquery.tinysort.1.5.4.js'
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
			console.log('startTest'); // log

			// prepare DOM
			var aTenten = [], i, j;
			for (j=0;j<5;j++) {
				var a = []
					,len = Math.pow(10,j+1);
				for (i=0;i<10;i++) a.push(getList(len));
				aTenten.push(a);
			}

			var suite = new Benchmark.Suite;

			// add tests
			$.each(aTenten,function(i,list){
				suite.add('TinySort list length '+$(list[0]).find('li').length, function() {
					$(list[0]).tsort();
					list.unshift(list.pop());
				})
			});

			// add tests
			suite
			// add listeners
			.on('cycle', function(event) {
			  console.log(String(event.target));
			})
			.on('complete', function() {
				console.log('Fastest is ' + this.filter('fastest').pluck('name'));
			})
			// run async
			.run({ 'async': true });

		}
	};
})(jQuery);
