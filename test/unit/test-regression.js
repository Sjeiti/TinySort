/* global module, test, ok */
(function(){
	'use strict';

	module('regression');
	/*test('issue 8', function() {
		expect(1);
		ok( (function(){
			var s = '';
			$zen('ul>li{a$}*13',{a:['Q','R','S','T','U','V','W','X','Y','Z','Å','Ä','Ö']}).find('li').tsort({cases:true})
			.each(function(i,el){ s += $(el).text(); });
			return s=='QRSTUVWXYZÄÅÖ';
		})(),'fixed using new');
	});
	test('issue 10', function() {
		expect(1);
		ok( (function(){
			var s = '';
			var $Li = $zen('ul>li#a${a}*6',{a:aList}).find('li');
			$Li.filter(':eq(2)')[0].removeAttribute('id');
			$Li.tsort().each(function(i,el){ s += $(el).attr('id')||''; });
			return s=='eek-oif-aar-oac-eax-';
		})());
	});
	test('issue 13', function() {
		expect(3);
		ok( (function(){
			var s = '';
			$zen('ul>li{a$}*6',{a:['eEk-','oif-','myr-','aar-','oac-','eax-']}).find('li').tsort()
			.each(function(i,el){ s += $(el).text(); });
			return s=='aar-eax-eEk-myr-oac-oif-';
		})(),'regular order');
		ok( (function(){
			var s = '';
			$zen('ul>li{a$}*6',{a:['eEk-','oif-','myr-','aar-','oac-','eax-']}).find('li').tsort({cases:true})
			.each(function(i,el){ s += $(el).text(); });
			return s=='aar-eEk-eax-myr-oac-oif-';
		})(),'case sensitive order');
		ok( (function(){
			var s = '';
			$zen('ul>li{a$}*6',{a:aList}).find('li').tsort({sortFunction:function(a,b){
				var aa = a[0], bb = b[0];
				return aa==bb?0:(aa>bb?1:-1);
			}})
			.each(function(i,el){ s += $(el).text(); });
			return s=='eek-oif-myr-aar-oac-eax-';
		})(),'custom sort function');
	});
	test('issue 14', function() {
		expect(1);
		ok( (function(){
			var s = '';
			$zen('ul>li[data-foo=a$]{_a$}*6',{a:aList}).find('li').tsort({data:'foo'})
			.each(function(i,el){ s += $(el).data('foo'); });
			return s==sJoin;
		})(),'implement data-attribute support');
	});
	test('issue 15', function() {
		expect(1);
		ok( (function(){
			var s = '';
			$zen('ul>li{a$}*5',{a:['01','001','a','0a','ba']}).find('li').tsort()
			.each(function(i,el){ s += $(el).text(); });
			return s=='010010aaba'; // not 001010aaba
		})(),'implementation of forceStrings');
	});
	test('issue 24', function() {
		expect(1);
		ok( (function(){
			var s = '';
			$zen('ul>li{a$}*5',{a:[20,0,-30,40,-120]}).find('li').tsort()
			.each(function(i,el){ s += $(el).text(); });
			return s=='-120-3002040'; // not -30-12002040
		})(),'negative numeral value bug');
	});
	test('issue 27', function() {
		expect(1);
		ok( (function(){
			var s = '';
			$zen('ul>li[data-foo=a$]{_a$}*8',{a:[20,0,-30,20.5,'a','a01',40,-120]}).find('li').tsort()
			.each(function(i,el){ s += $(el).text(); });
			return s=='_-120_-30_0_20_20.5_40_a_a01';
		})(),'data integer bug');
	});
	test('issue 39', function() {
		expect(1);
		ok( (function(){
			var s = '';
			$zen('ul>li[value=a$]{_a$}*6',{a:[0,5,1,4,2,3]}).find('li').tsort({attr:"value"})
			.each(function(i,el){ s += $(el).text(); });
			return s=='_0_1_2_3_4_5';
		})(),'regexp match onto number bug');
	});
	test('issue 51', function() {
		expect(1);
		ok( (function(){
			var s = '';
			$zen('ul>li{_a$}*6',{a:[' 0 ',' 5 ',' 1 ',' 4 ',' 2 ',' 3 ']}).find('li').tsort()
			.each(function(i,el){ s += $(el).text(); });
			return s=='_ 0 _ 1 _ 2 _ 3 _ 4 _ 5 ';
		})(),'numeral values with leading and trailing spaces');
	});*/
})();