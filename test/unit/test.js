/*global QUnit*/
(function(){
	'use strict';

	QUnit.config.hidepassed = true;
	[
		'../../src/tinysort.js'
		,'test-api.js'
		,'test-private.js'
		,'test-regression.js'
	].forEach(function(script){
		/*jslint evil: true */
		document.write('<script src="'+script+'"></script>');
	});
})();