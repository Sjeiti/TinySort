/* global module, test, ok */
(function(){
	'use strict';

	module('plugin');
	/*
	$zen('ul>li{a$}*13',{a:['džep','luđak','čovjek','gospodin','muškarac','ljubav','coga','zec','čega','liljana','godina','nož','njuška']}).find('li').tsort({charOrder:'cčćd{dž}đl{lj}n{nj}sšzž'});
	test('non latin characters plugin', function() {
		expect(2);
		ok( (function(){
			var s = '';
			$zen('ul>li{a$}*13',{a:['džep','luđak','čovjek','gospodin','muškarac','ljubav','coga','zec','čega','liljana','godina','nož','njuška']}).find('li').tsort({charOrder:'cčćd{dž}đl{lj}n{nj}sšzž'})
			.each(function(i,el){ s += ' '+$(el).text(); });
			return s==' coga čega čovjek džep godina gospodin liljana luđak ljubav muškarac nož njuška zec';
		})(),'tinysort(nodeList,{charOrder:\'cčćd{dž}đl{lj}n{nj}sšzž\'});   Serbo-Croatian');
		ok( (function(){
			var s = '';
			$zen('ul>li{a$}*6',{a:['Åben','Æble','Åse','København','Aarhus','Øresund']}).find('li').tsort({charOrder:'æøå[{Aa}]'})
			.each(function(i,el){ s += ' '+$(el).text(); });
			return s==' København Æble Øresund Åben Aarhus Åse';
		})(),'tinysort(nodeList,{charOrder:\'æøå[{Aa}]\'});   Danisch');
	});*/
})();