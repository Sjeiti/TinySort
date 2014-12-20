/* global module, test, ok, zenLi, eachElement */
(function(){
	'use strict';

	var aList = ['eek-','oif-','myr-','aar-','oac-','eax-']
		,sJoin = aList.slice(0).sort().join('')
	;

	module('regression');
	test('issue 8', function() {
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li{a$}*13',{a:['Q','R','S','T','U','V','W','X','Y','Z','Å','Ä','Ö']}))
				,sSorted = eachElement(aSorted,function(elm){return elm.textContent;});
			return sSorted==='QRSTUVWXYZÄÅÖ';
		})(),'fixed using new');
	});
	test('issue 10', function() {
		ok( (function(){
			var aNodes = zenLi('ul>li#a${a}*6',{a:aList})
				,aSorted,sSorted;
			aNodes[2].removeAttribute('id');
			aSorted = tinysort(aNodes);
			sSorted = eachElement(aSorted,function(elm){return elm.getAttribute('id')||'';});
			return sSorted==='eek-oif-aar-oac-eax-';
		})());
	});
	test('issue 13', function() {
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li{a$}*6',{a:['eEk-','oif-','myr-','aar-','oac-','eax-']}))
				,sSorted = eachElement(aSorted,function(elm){return elm.textContent;});
			return sSorted==='aar-eax-eEk-myr-oac-oif-';
		})(),'regular order');
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li{a$}*6',{a:['eEk-','oif-','myr-','aar-','oac-','eax-']}),{cases:true})
				,sSorted = eachElement(aSorted,function(elm){return elm.textContent;});
			return sSorted==='aar-eEk-eax-myr-oac-oif-';
		})(),'case sensitive order');
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li{a$}*6',{a:aList}),{sortFunction:function(a,b){
					var aa = a[0], bb = b[0];
					return aa==bb?0:(aa>bb?1:-1);
				}})
				,sSorted = eachElement(aSorted,function(elm){return elm.textContent;});
			return sSorted==='eek-oif-myr-aar-oac-eax-';
		})(),'custom sort function');
	});
	test('issue 14', function() {
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li[data-foo=a$]{_a$}*6',{a:aList}),{data:'foo'})
				,sSorted = eachElement(aSorted,function(elm){return elm.getAttribute('data-foo');});
			return sSorted===sJoin;
		})(),'implement data-attribute support');
	});
	test('issue 15', function() {
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li{a$}*5',{a:['01','001','a','0a','ba']}))
				,sSorted = eachElement(aSorted,function(elm){return elm.textContent;});
			return sSorted==='010010aaba';
		})(),'implementation of forceStrings');
	});
	test('issue 24', function() {
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li{a$}*5',{a:[20,0,-30,40,-120]}))
				,sSorted = eachElement(aSorted,function(elm){return elm.textContent;});
			return sSorted==='-120-3002040';
		})(),'negative numeral value bug');
	});
	test('issue 27', function() {
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li[data-foo=a$]{_a$}*8',{a:[20,0,-30,20.5,'a','a01',40,-120]}))
				,sSorted = eachElement(aSorted,function(elm){return elm.textContent;});
			return sSorted==='_-120_-30_0_20_20.5_40_a_a01';
		})(),'data integer bug');
	});
	test('issue 39', function() {
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li[value=a$]{_a$}*6',{a:[0,5,1,4,2,3]}),{attr:'value'})
				,sSorted = eachElement(aSorted,function(elm){return elm.textContent;});
			return sSorted==='_0_1_2_3_4_5';
		})(),'regexp match onto number bug');
	});
	/*test('issue 44', function() {
		ok( (function(){
			var aTest = ['adi95yqw31','eiw19ewe55','eiw73ewe133','eiw99ewe84','eiw9ewe42','eiw9ewe51','eiw9ewe98','jua21soa68','wau147oic54']
				,aSorted = tinysort(zenLi('ul>li{_a$}*'+aTest.length,{a:aTest}))
				,sSorted = eachElement(aSorted,function(elm){return elm.textContent;});
			console.log('sSorted',sSorted); // log
			return sSorted==='_adi95yqw31_eiw9ewe42_eiw9ewe51_eiw9ewe98_eiw19ewe55_eiw73ewe133_eiw99ewe84_jua21soa68_wau147oic54';
		})(),'mixed literal and numeral');
	});*/
	test('issue 51', function() {
		ok( (function(){
			var aSorted = tinysort(zenLi('ul>li{_a$}*6',{a:[' 0 ',' 5 ',' 1 ',' 4 ',' 2 ',' 3 ']}))
				,sSorted = eachElement(aSorted,function(elm){return elm.textContent;});
			return sSorted==='_ 0 _ 1 _ 2 _ 3 _ 4 _ 5 ';
		})(),'numeral values with leading and trailing spaces');
	});
	test('issue 78', function() {
		ok( (function(){
			var aTest = (function(a,i){
					while (i--) a.push(i);
					return a.sort(function(){return Math.random()<0.5?1:-1;});
				})([],14)
				,aSorted = tinysort(zenLi('ul>li[data-position=a$]{a$}*'+aTest.length,{a:aTest}))
				,sSorted = eachElement(aSorted,function(elm){return elm.textContent;});
			return sSorted==='012345678910111213';
		})(),'mixed literal and numeral');
	});
})();