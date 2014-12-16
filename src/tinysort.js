if (!window.tinysort) window.tinysort = (function(){
	'use strict';
	// private vars
	var /*fls = !1							// minify placeholder
		,nll = null							// minify placeholder
		,prsflt = parseFloat				// minify placeholder
		,mathmn = Math.min					// minify placeholder
		,rxLastNr = /(-?\d+\.?\d*)$/g		// regex for testing strings ending on numbers
		,rxLastNrNoDash = /(\d+\.?\d*)$/g	// regex for testing strings ending on numbers ignoring dashes
		,aPluginPrepare = []
		,aPluginSort = []
		,isString = function(o){return typeof o=='string';}
		,*/loop = function(array,func){
            var l = array.length
                ,i = l
                ,j;
            while (i--) {
                j = l-i-1;
                func(array[j],j);
            }
		}
	;
	function sort(nodeList){
		var aoList = []
			,mFragment = document.createDocumentFragment()
			,mParent;
		loop(nodeList,function(elm,i){
			if (!mParent) mParent = elm.parentNode;
			aoList.push({
				elm: elm
				,pos: i
				,text: elm.textContent
			});
		});
		aoList.sort(function (a,b) {
			return a.text>b.text?1:-1;
		});
		aoList.forEach(function (o) {
			mFragment.appendChild(o.elm);
		});
		mParent.appendChild(mFragment);
		return aoList.map(function(o) {
			return o.elm;
		});
	}

	return sort;
})();