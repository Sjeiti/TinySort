/* global module, test, ok */
(function(){
	'use strict';


	// load tinysort and hack source to expose private functions for testing
	/*$.ajax({
		url:'../../src/jquery.tinysort.js'
		,dataFilter: function(data) {
			return data.replace(/\$\.tinysort\s*=\s*{/g,'$.tinysort={expose:function(){return{toLowerCase:toLowerCase,contains:contains};},');//,isNum:isNum
		}
		,success: function(){
			$.ajax({
				url:'../../src/jquery.tinysort.charorder.js'
				,success: startTest
			});
		}
	});*/


	module('private methods');
	/*test('exposed private functions', function() {
		var o = $.tinysort.expose();
		expect(6);
		ok( (function(){
			return o.toLowerCase('aSdF')=='asdf';
		})(),'toLowerCase("aSdF");');
		ok( (function(){
			return o.toLowerCase(23)===23;
		})(),'toLowerCase(23);');

		ok( (function(){
			return o.contains(['b23'],'a')===false;
		})(),'contains(["b23"],"a");');
		ok( (function(){
			return o.contains(['b23','a'],'a')===true;
		})(),'contains(["b23","a"],"a");');
		ok( (function(){
			return o.contains([2,3,5,74],23)===false;
		})(),'contains([2,3,5,74],23);');
		ok( (function(){
			return o.contains([2,3,5,74],74)===true;
		})(),'contains([2,3,5,74],74);');
	});*/
})();