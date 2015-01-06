/*global QUnit, iddqd, zen*/
(function(){
	'use strict';

	var loadScript = iddqd.pattern.callbackToPromise(iddqd.loadScript)
		,oLoad;

	// config qUnit
	QUnit.config.hidepassed = true;

	// global test methods
	window.zenLi = function zenLi(){
		return zen.apply(zen,arguments).pop().querySelectorAll('li');
	};

	window.eachElement = function eachElement(nodeList,fn){
		var s = '';
		if (fn===undefined) fn = function(elm){ return elm.textContent; };
		nodeList.forEach(function(elm){ s += fn(elm); });
		return s;
	};

	// load test scripts
	[
		'../../src/tinysort.js'
		,'../../src/tinysort.charorder.js'
		,'../../vendor/requirejs/require.js'
		,'test-api.js'
		,'test-regression.js'
		,'test-charorder.js'
		,'test-jquerywrapper.js'
	].forEach(function(script){
		oLoad = oLoad?oLoad.then(loadScript.bind(null,script,null)):loadScript(script);
	});
	oLoad.then(setTimeout.bind(window,setHeader,140));

	function setHeader(){
		document.getElementById('qunit-header').textContent = 'TinySort '+tinysort.version;
	}
})();