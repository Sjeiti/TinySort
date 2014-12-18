/* global module, test, ok, expect, zen */
(function(){
	'use strict';

	module('tinysort api');
	test('standalone', function() {
		ok(true,'true');
	});

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


	// start test

		var aList = ['eek-','oif-','myr-','aar-','oac-','eax-']
			,sJoin = aList.slice(0).sort().join('')
			,sHfJn = aList.slice(0,4).sort().join('')
			,sSRvr = aList.slice(0).sort().reverse().join('')
		;
//		console.log('aList',aList.join('')); // log
//		console.log('sJoin',sJoin); // log

//		console.log('zen',zen('ul>li{a$}*6',{a:aList})); // log
//		console.log('zen',zen('ul>li{a$}*6',{a:aList}).pop().querySelectorAll('li')); // log
//		console.log('zen'
//			,tinysort(zen('ul>li{a$}*6',{a:aList}).pop().querySelectorAll('li')).map(function(elm){
//				return elm.textContent;
//			}).join('')
//		); // log

		function $zen(){
			return zen.apply(zen,arguments).pop().querySelectorAll('li');
		}

		function eachs(a,fn){
			var s = '';
			a.forEach(function(elm){ s += fn(elm); });
			return s;
		}

		window.aList=aList;//#####
		window.$zen=$zen;//#####

//		$('#qunit-header').text($.tinysort.id+' '+$.tinysort.version);

		module('TinySort');
		test('default functionality', function() {
			ok( (function(){
				var aSorted = tinysort($zen('ul>li{a$}*6',{a:aList}))
					,sSorted = eachs(aSorted,function(elm){return elm.textContent;});
				return sSorted===sJoin;
			})(),'tinysort(nodeList);');
			ok( (function(){
				var aSorted = tinysort($zen('ul>li#a${a}*6',{a:aList}),{attr:'id'})
					,sSorted = eachs(aSorted,function(elm){return elm.getAttribute('id');});
				return sSorted==sJoin;
			})(),'tinysort(nodeList,{attr:\'id\'});');
			ok( (function(){
				var aSorted = tinysort($zen('ul>li*6>(p{$}+p{a$})',{a:aList}),'p:nth-child(2)')
					,sSorted = eachs(aSorted,function(elm){return elm.querySelector('p:nth-child(2)').textContent;});
				return sSorted==sJoin;
			})(),'tinysort(nodeList,\'p:nth-child(2)\');');
			ok( (function(){
				var aSorted = tinysort($zen('ul>li*6>p[title=a$]{a}',{a:aList}),'p[title]',{attr:'title'})
					,sSorted = eachs(aSorted,function(elm){return elm.querySelector('p').getAttribute('title'); });
				return sSorted==sJoin;
			})(),'tinysort(nodeList,\'p[title]\',{attr:\'title\'});');
			ok( (function(){
				var aSorted = tinysort($zen('ul>(li>input[value=a$]+li>select>option[value=b$])*3',{a:aList.slice(0,3),b:aList.slice(3)}),'input,select',{useVal:true})
					,sSorted = eachs(aSorted,function(elm){return elm.querySelector('input,select').value; });
				return sSorted==sJoin;
			})(),'tinysort(nodeList,\'input,select\',{useVal:true})');
			ok( (function(){
				var aSorted = tinysort($zen('ul>li[data-foo=a$]{_a$}*6',{a:aList}),{data:'foo'})
					,sSorted = eachs(aSorted,function(elm){ return elm.getAttribute('data-foo'); });
				return sSorted==sJoin;
			})(),'tinysort(nodeList,\'li\',{data:\'foo\'})');
			ok( (function(){
				var aSorted = tinysort($zen('ul>li{a$}*6',{a:aList}),':nth-child(-n+4)',{returns:true})
					,sSorted = eachs(aSorted,function(elm){ return elm.textContent; });
				return sSorted==sHfJn;
			})(),'tinysort(nodeList,{returns:true});');
			ok( (function(){
				var aSorted = tinysort($zen('ul>li{a$}*6',{a:aList}),{order:'desc'})
					,sSorted = eachs(aSorted,function(elm){ return elm.textContent; });
				return sSorted==sSRvr;
			})(),'tinysort(nodeList,{order:\'desc\'});');
			ok( (function(){
				var aSorted = tinysort($zen('ul>li{a$}*5',{a:[6,1,5,2,4]}))
					,sSorted = eachs(aSorted,function(elm){ return elm.textContent; });
				return sSorted=='12456';
			})(),'tinysort(nodeList); with integers');
			ok( (function(){
				var aSorted = tinysort($zen('ul>li{a$}*5',{a:[4.6,3.1,2.5,5.2,7.4]}))
					,sSorted = eachs(aSorted,function(elm){ return elm.textContent; });
				return sSorted=='2.53.14.65.27.4';
			})(),'tinysort(nodeList); with floats');
			ok( (function(){
				var aSorted = tinysort($zen('ul>li{a$}*15',{a:[4.6,'c',7.4,6,'a',11,1,5,3.1,'d',2.5,5.2,'b',2,4]}))
					,sSorted = eachs(aSorted,function(elm){ return ' '+elm.textContent; });
				return sSorted==' 1 2 2.5 3.1 4 4.6 5 5.2 6 7.4 11 a b c d';
			})(),'tinysort(nodeList); mixed types');
			ok( (function(){
				var aSorted = tinysort($zen('ul>li{a$}*15',{a:[4.6,'c',7.4,6,'a',11,1,5,3.1,'d',2.5,5.2,'b',2,4]}),{forceStrings:true})
					,sSorted = eachs(aSorted,function(elm){ return ' '+elm.textContent; });
				return sSorted==' 1 11 2 2.5 3.1 4 4.6 5 5.2 6 7.4 a b c d';
			})(),'tinysort(nodeList,{forceStrings:true}); mixed types');
			ok( (function(){
				var aSorted = tinysort($zen('ul>li{b$}*4',{b:['a11','a1.1','a1','a7']}))
					,sSorted = eachs(aSorted,function(elm){ return ' '+elm.textContent; });
				return sSorted==' a1 a1.1 a7 a11';
			})(),'tinysort(nodeList); mixed numeral/literal');
			ok( (function(){
				window.foo=true;//##
				var aSorted = tinysort($zen('ul>(li>span{a$}+li>span.striked{b$})*3',{a:aList.slice(0,3),b:aList.slice(3)}),'span:not([class=striked])',{returns:true,place:'org'})
					,sSorted = aSorted[0].parentNode.textContent+aSorted.length;//eachs(aSorted,function(elm){ return ' '+elm.textContent; });
				console.log('',zen('ul>(li>span{a$}+li>span.striked{b$})*3',{a:aList.slice(0,3),b:aList.slice(3)})[0].textContent); // log
				console.log('aList',aList.join('')); // log
				console.log('sSorted',sSorted); // log
				console.log('=======','eek-aar-myr-oac-oif-eax-3'); // log
				window.foo=false;//##
				return sSorted=='eek-aar-myr-oac-oif-eax-3';
//				var $s = $zen('ul>(li>span{a$}+li>span.striked{b$})*3',{a:aList.slice(0,3),b:aList.slice(3)}).find('li').tsort('span[class!=striked]',{returns:true,place:'org'});
//				return $s.parent().text()+$s.length=='eek-aar-myr-oac-oif-eax-3';
			})(),'tinysort(nodeList,\'span:not([class=striked])\',{returns:true,place:\'org\'}); return only sorted at original position');
			/*ok( (function(){
				var aSorted = tinysort($zen('div>((ul>li{a$}*4)+ul>li{b$}*4)',{a:['a9','a2','a3','a7'],b:['a11','a1.1','a1','a7']}))
					,sSorted = eachs(aSorted,function(elm){ return ' '+elm.textContent; });
				return sSorted==' a2 a3 a7 a9 a1 a1.1 a7 a11';
//				var s = '';
//				$zen('div>((ul>li{a$}*4)+ul>li{b$}*4)',{a:['a9','a2','a3','a7'],b:['a11','a1.1','a1','a7']}).find('li').tsort()
//				.each(function(i,el){ s += ' '+$(el).text(); });
//				return s==' a2 a3 a7 a9 a1 a1.1 a7 a11';
			})(),'tinysort(nodeList); multiple parents');*/
			ok( (function(){
				var aSorted = tinysort($zen('ul>li{a$}*5',{a:['a-2','a-5','a-6','a-4','a-1']}),{ignoreDashes:true})
					,sSorted = eachs(aSorted,function(elm){ return elm.textContent; });
				return sSorted=='a-1a-2a-4a-5a-6';
			})(),'tinysort(nodeList,{ignoreDashes:true}); ignore dashes');
		});

		test('default functionality: multiple criteria', function() {
			ok( (function(){
				var aSorted = tinysort($zen('ul>li[value=a$]{b$}*8',{a:[12,4,2,3,5,1,11,6],b:['bb','aa','cc','aa','bb','aa','aa','cc']}),{},{useVal:true})
					,sSorted = eachs(aSorted,function(elm){ return ' '+elm.textContent+'_'+elm.value; });
				return sSorted===' aa_1 aa_3 aa_4 aa_11 bb_5 bb_12 cc_2 cc_6';
			})(),'tinysort(nodeList,{},{useVal:true});');
			ok( (function(){
				var aSorted = tinysort($zen('ul>li#ida${b$}*8',{a:[12,4,2,3,5,1,11,6],b:['bb','aa','cc','aa','bb','aa','aa','cc']}),{},{attr:'id'})
					,sSorted = eachs(aSorted,function(elm){ return ' '+elm.textContent+'_'+elm.getAttribute('id'); });
				return sSorted===' aa_id1 aa_id3 aa_id4 aa_id11 bb_id5 bb_id12 cc_id2 cc_id6';
			})(),'tinysort(nodeList,{},{attr:\'id\'});');
			ok( (function(){
				var aSorted = tinysort($zen('ul>li[title=ida$]*8>(p{b$}+p{c$})',{a:[12,4,2,3,5,1,11,6],b:['aa','cc','aa','bb','aa','aa','bb','cc'],c:['bb','aa','cc','aa','bb','aa','aa','cc']}),'p:nth-child(2)',{},{attr:'title'})
					,sSorted = eachs(aSorted,function(elm){ return ' '+elm.textContent+'_'+elm.getAttribute('title'); });
				return sSorted===' aaaa_id1 bbaa_id3 ccaa_id4 bbaa_id11 aabb_id5 aabb_id12 aacc_id2 cccc_id6';
			})(),'tinysort(nodeList,\'p:eq(1)\',{},{attr:\'title\'});');
		});





})();