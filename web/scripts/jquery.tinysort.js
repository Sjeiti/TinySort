/*!
* jQuery TinySort - A plugin to sort child nodes by (sub) contents or attributes.
*
* Version: 1.1.0
*
* Copyright (c) 2008-2011 Ron Valstar http://www.sjeiti.com/
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*//*
* contributors:
*	brian.gibson@gmail.com
*
* Usage:
*   $("ul#people>li").tsort();
*   $("ul#people>li").tsort("span.surname");
*   $("ul#people>li").tsort("span.surname",{order:"desc"});
*   $("ul#people>li").tsort({place:"end"});
*
* Change default like so:
*   $.tinysort.defaults.order = "desc";
*
* in this update:
*   - if the first char in the _find parameter is a : we'll use $.filter instead of $.find
*   - added caseSensitive sorting
*   - added custom sort function
*	- added data-attribute support
*	- tiny speed increase
*	- tested with jQuery 1.6.2
*
* in last update:
*	- applied patch to sort by .val() instead of .text()  (thanks to brian.gibson@gmail.com)
*
* Todos
*   - fix mixed literal/numeral values
*
*/
;(function($) {
	// default settings
	$.tinysort = {
		 id: "TinySort"
		,version: "1.1.0"
		,copyright: "Copyright (c) 2008-2011 Ron Valstar"
		,uri: "http://tinysort.sjeiti.com/"
		,defaults: {
			 order: "asc"	// order: asc, desc or rand
			,attr: null		// order by attribute value
			,useVal: false	// use element value instead of text
			,data: null		// use the data attribute for sorting
			,place: "start"	// place ordered elements at position: start, end, org (original position), first
			,returns: false	// return all elements or only the sorted ones (true/false)
			,cases: false	// a case sensitive sort orders [aB,aa,ab,bb]
			,sortFunction: null // override the default sort function
		}
	};
	$.fn.extend({
		tinysort: function(_find,_settings) {
			if (_find&&typeof(_find)!="string") {
				_settings = _find;
				_find = null;
			}

			var oSettings = $.extend({}, $.tinysort.defaults, _settings);

			if (!oSettings.sortFunction) oSettings.sortFunction = oSettings.order=='rand'?function() {
				return Math.random()<.5?1:-1;
			}:function(a,b) {
				var x = !oSettings.cases&&a.s&&a.s.toLowerCase?a.s.toLowerCase():a.s;
				var y = !oSettings.cases&&b.s&&b.s.toLowerCase?b.s.toLowerCase():b.s;
				if (isNum(a.s)&&isNum(b.s)) {
					x = parseFloat(a.s);
					y = parseFloat(b.s);
				}
				return (oSettings.order=="asc"?1:-1)*(x<y?-1:(x>y?1:0));
			};

			var oElements = {}; // contains sortable- and non-sortable list per parent

			var bFind = !(!_find||_find=='');
			var bAttr = !(oSettings.attr===null||oSettings.attr=="");
			var bData = oSettings.data!==null;

			// since jQuery's filter within each works on array index and not actual index we have to create the filter in advance
			var bFilter = bFind&&_find[0]==':';
			var $Filter = bFilter?this.filter(_find):this; 

			this.each(function(i) {
				var $This = $(this);
				// element or sub selection
				var mElm = bFind?(bFilter?$Filter.filter(this):$This.find(_find)):$This;

				// text or attribute value
				var sSort = bData?mElm.data(oSettings.data):(bAttr?mElm.attr(oSettings.attr):(oSettings.useVal?mElm.val():mElm.text()));
 				// to sort or not to sort
				var mParent = $This.parent();
				if (!oElements[mParent]) oElements[mParent] = {s:[],n:[]};	// s: sort, n: not sort
				if (mElm.length>0)	oElements[mParent].s.push({s:sSort,e:$This,n:i}); // s:string, e:element, n:number
				else				oElements[mParent].n.push({e:$This,n:i});
			});
			//
			// sort
			for (var sParent in oElements) {
				var oParent = oElements[sParent];
				oParent.s.sort(oSettings.sortFunction);
			}
			//
			// order elements and fill new order
			var aNewOrder = [];
			for (var sParent in oElements) {
				var oParent = oElements[sParent];
				var aOrg = []; // list for original position
				var iLow = $(this).length;
				switch (oSettings.place) {
					case "first": $.each(oParent.s,function(i,obj) { iLow = Math.min(iLow,obj.n) }); break;
					case "org": $.each(oParent.s,function(i,obj) { aOrg.push(obj.n) }); break;
					case "end": iLow = oParent.n.length; break;
					default: iLow = 0;
				}
				var aCnt = [0,0]; // count how much we've sorted for retreival from either the sort list or the non-sort list (oParent.s/oParent.n)
				for (var i=0;i<$(this).length;i++) {
					var bSList = i>=iLow&&i<iLow+oParent.s.length;
					if (contains(aOrg,i)) bSList = true;
					var mEl = (bSList?oParent.s:oParent.n)[aCnt[bSList?0:1]].e;
					mEl.parent().append(mEl);
					if (bSList||!oSettings.returns) aNewOrder.push(mEl.get(0));
					aCnt[bSList?0:1]++;
				}
			}
			return this.pushStack(aNewOrder);
		}
	});
	// is numeric
	function isNum(n) {
		var x = /^\s*?[\+-]?(\d*\.?\d*?)\s*?$/.exec(n);
		return x&&x.length>0?x[1]:false;
	};
	// array contains
	function contains(a,n) {
		var bInside = false;
		$.each(a,function(i,m) {
			if (!bInside) bInside = m==n;
		});
		return bInside;
	};
	// set functions
	$.fn.TinySort = $.fn.Tinysort = $.fn.tsort = $.fn.tinysort;
})(jQuery);