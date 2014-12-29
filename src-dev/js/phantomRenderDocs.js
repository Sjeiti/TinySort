/*global phantom,require*/
(function(page){
	'use strict';
	var system = require('system')
		,args = system.args
		,sSrcUri = args[1]
	;



	page.viewportSize = { width: 800, height: 600 };
	page.onLoadFinished = handleLoadFinished;
	page.onError = handleError;
	page.open(sSrcUri);

	function handleLoadFinished(){
		var sHtml = page.evaluate(function () {
			var mHTML = document.body
				,mTable = mHTML.querySelector('table.params table.params')
				,amTr = mTable.querySelectorAll('tbody tr')
				,aResult = []
			;
			for (var i=0,l=amTr.length;i<l;i++) {
				var mTr = amTr[i]
					,aTr = [];
				for (var j=0,m=mTr.children.length;j<m;j++) {
					var mTd = mTr.children[j]
						,sContent = j===4?mTd.innerHTML:mTd.textContent;
					aTr.push(
						sContent
							.replace(/[\s\n]+/g,' ')
							.replace(/^\s|\s$/g,'')
					);
				}
				aResult.push(aTr);
			}
			return JSON.stringify(aResult).replace(/[\s\n]+/,' ');
//			return mTable.parentNode.innerHTML;
		});
		console.log(sHtml);
		phantom.exit(sHtml);
	}

	function handleError(){}

})(require('webpage').create());

