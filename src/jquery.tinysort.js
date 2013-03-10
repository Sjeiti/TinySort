/*! TinySort 1.5.0
* Copyright (c) 2008-2013 Ron Valstar http://www.sjeiti.com/
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*//*
* Description:
*   A jQuery plugin to sort child nodes by (sub) contents or attributes.
*
* Contributors:
*	brian.gibson@gmail.com
*	michael.thornberry@gmail.com
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
*/
;(function($) {
	// private vars
	var fls = !1							// minify placeholder
		,nll = null							// minify placeholder
		,prsflt = parseFloat				// minify placeholder
		,mathmn = Math.min					// minify placeholder
		,rxLastNr = /(-?\d+\.?\d*)$/g		// regex for testing strings ending on numbers
		,aPluginPrepare = []
		,aPluginSort = []
		,isString = function(o){return typeof o=='string';}
	;
	//
	// init plugin
	$.tinysort = {
		 id: 'TinySort'
		,version: '1.5.0'
		,copyright: 'Copyright (c) 2008-2013 Ron Valstar'
		,uri: 'http://tinysort.sjeiti.com/'
		,licensed: {
			MIT: 'http://www.opensource.org/licenses/mit-license.php'
			,GPL: 'http://www.gnu.org/licenses/gpl.html'
		}
		,plugin: function(prepare,sort){
			aPluginPrepare.push(prepare);	// function(settings){doStuff();}
			aPluginSort.push(sort);			// function(valuesAreNumeric,sA,sB,iReturn){doStuff();return iReturn;}
		}
		,defaults: { // default settings

			 order: 'asc'			// order: asc, desc or rand

			,attr: nll				// order by attribute value
			,data: nll				// use the data attribute for sorting
			,useVal: fls			// use element value instead of text

			,place: 'start'			// place ordered elements at position: start, end, org (original position), first
			,returns: fls			// return all elements or only the sorted ones (true/false)

			,cases: fls				// a case sensitive sort orders [aB,aa,ab,bb]
			,forceStrings:fls		// if false the string '2' will sort with the value 2, not the string '2'

			,sortFunction: nll		// override the default sort function
		}
	};
	$.fn.extend({
		tinysort: function(_find,_settings) {
			var i,l
				,sParent
				,oThis = this
				,iLen = $(oThis).length
				,oElements = {} // contains sortable- and non-sortable list per parent
				,aNewOrder = []
				// multiple sort options (sort===0?iPointer++:iPointer=0)
				,aPoints = []
				,iPointer = 0
				,iPointerMax
				,aFind = []
				,aSettings = []
			;
			// fill aFind and aSettings but keep length pairing up
			for (i=0,l=arguments.length;i<l;i++){
				var o = arguments[i];
				if (isString(o))	{
					if (aFind.push(o)-1>aSettings.length) aSettings.length = aFind.length-1;
				} else {
					if (aSettings.push(o)>aFind.length) aFind.length = aSettings.length;
				}
			}
			if (aFind.length>aSettings.length) aSettings.length = aFind.length;

			iPointerMax = aFind.length;
			if (iPointerMax===0) {
				iPointerMax = aFind.length = 1;
				aSettings.push($.extend({}, $.tinysort. defaults));
			}

			// todo: fix iPointerMax can be 0
			for (i=0,l=iPointerMax;i<l;i++) {
				var sFind = aFind[i]
					,oSettings = $.extend({}, $.tinysort. defaults, aSettings[i])
					// has find, attr or data
					,bFind = !(!sFind||sFind=='')
					,bAttr = !(oSettings.attr===nll||oSettings.attr=='')
					,bData = oSettings.data!==nll
					// since jQuery's filter within each works on array index and not actual index we have to create the filter in advance
					,bFilter = bFind&&sFind[0]==':' // since jQuery's filter within each works on array index and not actual index we have to create the filter in advance
					,$Filter = bFilter?oThis.filter(sFind):oThis
					,fnSort = oSettings.sortFunction
					,iAsc = oSettings.order=='asc'?1:-1
				;
				aPoints.push({ // todo: only used locally, find a way to minify properties
					 sFind: sFind
					,oSettings: oSettings
					,bFind: bFind
					,bAttr: bAttr
					,bData: bData
					,bFilter: bFilter
					,$Filter: $Filter
					,fnSort: fnSort
					,iAsc: iAsc
				});
			}
			//
			// prepare oElements for sorting
			oThis.each(function(i,el) {
				var $Elm = $(el)
					,mParent = $Elm.parent()
					,mFirstElmOrSub // we still need to distinguish between sortable and non-sortable elements (might have unexpected results for multiple criteria)
					,aSort = []
				;
				for (j=0;j<iPointerMax;j++) {
					var oPoint = aPoints[j]
						// element or sub selection
						,mElmOrSub = oPoint.bFind?(oPoint.bFilter?oPoint.$Filter.filter(el):$Elm.find(oPoint.sFind)):$Elm;
					// text or attribute value
					aSort.push(oPoint.bData?mElmOrSub.data(oPoint.oSettings.data):(oPoint.bAttr?mElmOrSub.attr(oPoint.oSettings.attr):(oPoint.oSettings.useVal?mElmOrSub.val():mElmOrSub.text())));
					if (mFirstElmOrSub===undefined) mFirstElmOrSub = mElmOrSub;
				}
				// todo: oElements[mParent] is plain wrong!!! Can't believe I didn't see this before.
				// to sort or not to sort
				if (!oElements[mParent])		oElements[mParent] = {s:[],n:[]};	// s: sort, n: not sort
				if (mFirstElmOrSub.length>0)	oElements[mParent].s.push({s:aSort,e:$Elm,n:i}); // s:string/pointer, e:element, n:number
				else							oElements[mParent].n.push({e:$Elm,n:i});
			});
			//
			//
			var fnPluginPrepare = function(_settings){
				$.each(aPluginPrepare,function(i,fn){
					fn.call(fn,_settings);
				});
			};
			//fnPluginPrepare(oSettings);
			//
			// todo: fix so works with parsed sort function (wrap fn, but not pointer stuff)
			if (!fnSort) fnSort = oSettings.order=='rand'?function() {
				return Math.random()<.5?1:-1;
			}:function(a,b) {
				var iReturn = 0;

				if (iPointer!==0) {
					iPointer = 0;
				}
				while (iReturn===0&&iPointer<iPointerMax) {
					var oPoint = aPoints[iPointer];
					fnPluginPrepare(oPoint.oSettings); // erhm
					//
					var bNumeric = fls
					// maybe toLower
						,sA = !oPoint.oSettings.cases?toLowerCase(a.s[iPointer]):a.s[iPointer]
						,sB = !oPoint.oSettings.cases?toLowerCase(b.s[iPointer]):b.s[iPointer];
					// maybe force Strings
					if (!oSettings.forceStrings) {
						// maybe mixed
//						console.log(sA,sB); // log
						var  aAnum = isString(sA)?sA&&sA.match(rxLastNr):fls
							,aBnum = isString(sB)?sB&&sB.match(rxLastNr):fls;
						if (aAnum&&aBnum) {
							var  sAprv = sA.substr(0,sA.length-aAnum[0].length)
								,sBprv = sB.substr(0,sB.length-aBnum[0].length);
							if (sAprv==sBprv) {
								bNumeric = !fls;
								sA = prsflt(aAnum[0]);
								sB = prsflt(aBnum[0]);
							}
						}
					}
					// return sort-integer
					iReturn = iAsc*(sA<sB?-1:(sA>sB?1:0));

					$.each(aPluginSort,function(i,fn){
						iReturn = fn.call(fn,bNumeric,sA,sB,iReturn);
					});

					if (iReturn===0) iPointer++;
				}

				return iReturn;
			};
			//
			// sort
			for (sParent in oElements) oElements[sParent].s.sort(fnSort);
			//
			// order elements and fill new order
			for (sParent in oElements) {
				var oParent = oElements[sParent]
					,aOrg = [] // list for original position
					,iLow = iLen
					,aCnt = [0,0] // count how much we've sorted for retreival from either the sort list or the non-sort list (oParent.s/oParent.n)
				;
				switch (oSettings.place) {
					case 'first':	$.each(oParent.s,function(i,obj) { iLow = mathmn(iLow,obj.n) }); break;
					case 'org':		$.each(oParent.s,function(i,obj) { aOrg.push(obj.n) }); break;
					case 'end':		iLow = oParent.n.length; break;
					default:		iLow = 0;
				}
				for (i=0;i<iLen;i++) {
					var bSList = contains(aOrg,i)?!fls:i>=iLow&&i<iLow+oParent.s.length
						,mEl = (bSList?oParent.s:oParent.n)[aCnt[bSList?0:1]].e;
					mEl.parent().append(mEl);
					if (bSList||!oSettings.returns) aNewOrder.push(mEl.get(0));
					aCnt[bSList?0:1]++;
				}
			}
			oThis.length = 0;
			Array.prototype.push.apply(oThis,aNewOrder);
			return oThis;
		}
	});
	// toLowerCase
	function toLowerCase(s) {
		return s&&s.toLowerCase?s.toLowerCase():s;
	}
	// array contains
	function contains(a,n) {
		for (var i=0,l=a.length;i<l;i++) if (a[i]==n) return !fls;
		return fls;
	}
	// set functions
	$.fn.TinySort = $.fn.Tinysort = $.fn.tsort = $.fn.tinysort;
})(jQuery);