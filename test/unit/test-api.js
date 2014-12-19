/* global module, test, ok, zenLi, eachElement */ //expect
(function(){
	'use strict';

	var aList = ['eek-','oif-','myr-','aar-','oac-','eax-']
		,sJoin = aList.slice(0).sort().join('')
		,sHfJn = aList.slice(0,4).sort().join('')
		,sSRvr = aList.slice(0).sort().reverse().join('')
	;

	module('TinySort');
	test('default functionality', function() {
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li{a$}*6',{a:aList}))
				,sSorted = eachElement(aSorted,function(elm){return elm.textContent;});
			return sSorted===sJoin;
		})(),'tinysort(nodeList);');
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li#a${a}*6',{a:aList}),{attr:'id'})
				,sSorted = eachElement(aSorted,function(elm){return elm.getAttribute('id');});
			return sSorted==sJoin;
		})(),'tinysort(nodeList,{attr:\'id\'});');
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li*6>(p{$}+p{a$})',{a:aList}),'p:nth-child(2)')
				,sSorted = eachElement(aSorted,function(elm){return elm.querySelector('p:nth-child(2)').textContent;});
			return sSorted==sJoin;
		})(),'tinysort(nodeList,\'p:nth-child(2)\');');
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li*6>p[title=a$]{a}',{a:aList}),'p[title]',{attr:'title'})
				,sSorted = eachElement(aSorted,function(elm){return elm.querySelector('p').getAttribute('title'); });
			return sSorted==sJoin;
		})(),'tinysort(nodeList,\'p[title]\',{attr:\'title\'});');
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>(li>input[value=a$]+li>select>option[value=b$])*3',{a:aList.slice(0,3),b:aList.slice(3)}),'input,select',{useVal:true})
				,sSorted = eachElement(aSorted,function(elm){return elm.querySelector('input,select').value; });
			return sSorted==sJoin;
		})(),'tinysort(nodeList,\'input,select\',{useVal:true})');
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li[data-foo=a$]{_a$}*6',{a:aList}),{data:'foo'})
				,sSorted = eachElement(aSorted,function(elm){ return elm.getAttribute('data-foo'); });
			return sSorted==sJoin;
		})(),'tinysort(nodeList,\'li\',{data:\'foo\'})');
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li{a$}*6',{a:aList}),':nth-child(-n+4)',{returns:true})
				,sSorted = eachElement(aSorted,function(elm){ return elm.textContent; });
			return sSorted==sHfJn;
		})(),'tinysort(nodeList,{returns:true});');
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li{a$}*6',{a:aList}),{order:'desc'})
				,sSorted = eachElement(aSorted,function(elm){ return elm.textContent; });
			return sSorted==sSRvr;
		})(),'tinysort(nodeList,{order:\'desc\'});');
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li{a$}*5',{a:[6,1,5,2,4]}))
				,sSorted = eachElement(aSorted,function(elm){ return elm.textContent; });
			return sSorted=='12456';
		})(),'tinysort(nodeList); with integers');
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li{a$}*5',{a:[4.6,3.1,2.5,5.2,7.4]}))
				,sSorted = eachElement(aSorted,function(elm){ return elm.textContent; });
			return sSorted=='2.53.14.65.27.4';
		})(),'tinysort(nodeList); with floats');
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li{a$}*15',{a:[4.6,'c',7.4,6,'a',11,1,5,3.1,'d',2.5,5.2,'b',2,4]}))
				,sSorted = eachElement(aSorted,function(elm){ return ' '+elm.textContent; });
			return sSorted==' 1 2 2.5 3.1 4 4.6 5 5.2 6 7.4 11 a b c d';
		})(),'tinysort(nodeList); mixed types');
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li{a$}*15',{a:[4.6,'c',7.4,6,'a',11,1,5,3.1,'d',2.5,5.2,'b',2,4]}),{forceStrings:true})
				,sSorted = eachElement(aSorted,function(elm){ return ' '+elm.textContent; });
			return sSorted==' 1 11 2 2.5 3.1 4 4.6 5 5.2 6 7.4 a b c d';
		})(),'tinysort(nodeList,{forceStrings:true}); mixed types');
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li{b$}*4',{b:['a11','a1.1','a1','a7']}))
				,sSorted = eachElement(aSorted,function(elm){ return ' '+elm.textContent; });
			return sSorted==' a1 a1.1 a7 a11';
		})(),'tinysort(nodeList); mixed numeral/literal');
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>(li>span{a$}+li>span.striked{b$})*3',{a:aList.slice(0,3),b:aList.slice(3)}),'span:not([class=striked])',{returns:true,place:'org'})
				,sSorted = aSorted[0].parentNode.textContent+aSorted.length;//eachs(aSorted,function(elm){ return ' '+elm.textContent; });
			return sSorted=='eek-aar-myr-oac-oif-eax-3';
		})(),'tinysort(nodeList,\'span:not([class=striked])\',{returns:true,place:\'org\'}); return only sorted at original position');
		ok( (function(){
			var aSorted = tinysort(zenLi('div>((ul>li{a$}*4)+ul>li{b$}*4)',{a:['a9','a2','a3','a7'],b:['a11','a1.1','a1','a7']}))
				,sSorted = eachElement(aSorted,function(elm){ return ' '+elm.textContent; });
			return sSorted==' a1 a1.1 a2 a3 a7 a7 a9 a11';
		})(),'tinysort(nodeList); multiple parents');
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li{a$}*5',{a:['a-2','a-5','a-6','a-4','a-1']}),{ignoreDashes:true})
				,sSorted = eachElement(aSorted,function(elm){ return elm.textContent; });
			return sSorted=='a-1a-2a-4a-5a-6';
		})(),'tinysort(nodeList,{ignoreDashes:true}); ignore dashes');
	});

	test('default functionality: multiple criteria', function() {
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li[value=a$]{b$}*8',{a:[12,4,2,3,5,1,11,6],b:['bb','aa','cc','aa','bb','aa','aa','cc']}),{},{useVal:true})
				,sSorted = eachElement(aSorted,function(elm){ return ' '+elm.textContent+'_'+elm.value; });
			return sSorted===' aa_1 aa_3 aa_4 aa_11 bb_5 bb_12 cc_2 cc_6';
		})(),'tinysort(nodeList,{},{useVal:true});');
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li#ida${b$}*8',{a:[12,4,2,3,5,1,11,6],b:['bb','aa','cc','aa','bb','aa','aa','cc']}),{},{attr:'id'})
				,sSorted = eachElement(aSorted,function(elm){ return ' '+elm.textContent+'_'+elm.getAttribute('id'); });
			return sSorted===' aa_id1 aa_id3 aa_id4 aa_id11 bb_id5 bb_id12 cc_id2 cc_id6';
		})(),'tinysort(nodeList,{},{attr:\'id\'});');
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li[title=ida$]*8>(p{b$}+p{c$})',{a:[12,4,2,3,5,1,11,6],b:['aa','cc','aa','bb','aa','aa','bb','cc'],c:['bb','aa','cc','aa','bb','aa','aa','cc']}),'p:nth-child(2)',{},{attr:'title'})
				,sSorted = eachElement(aSorted,function(elm){ return ' '+elm.textContent+'_'+elm.getAttribute('title'); });
			return sSorted===' aaaa_id1 bbaa_id3 ccaa_id4 bbaa_id11 aabb_id5 aabb_id12 aacc_id2 cccc_id6';
		})(),'tinysort(nodeList,\'p:eq(1)\',{},{attr:\'title\'});');
	});
})();