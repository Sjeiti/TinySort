/*global QUnit, zen*/
(function(){
	'use strict';

	// config qUnit
	QUnit.config.hidepassed = true;

	// global test methods
	window.zenLi = function zenLi(){
		return zen.apply(zen,arguments).pop().querySelectorAll('li');
	};

	window.eachElement = function eachElement(nodeList,fn){
		var s = '';
		nodeList.forEach(function(elm){ s += fn(elm); });
		return s;
	};

	// load test scripts
	[
		'../../src/tinysort.js'
		,'test-api.js'
		,'test-private.js'
		,'test-regression.js'
		,'../../src/tinysort.charorder.js'
		,'test-charorder.js'
	].forEach(function(script){
		/*jslint evil: true */
		document.write('<script src="'+script+'"></script>');
	});

	//$('#qunit-header').text($.tinysort.id+' '+$.tinysort.version);

})();