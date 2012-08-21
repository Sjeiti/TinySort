/*
* jQuery TinySort 1.3.25
* A plugin to sort child nodes by (sub) contents or attributes.
*
* Copyright (c) 2008-2012 Ron Valstar http://www.sjeiti.com/
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
* contributors:
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
* in this update:
*	- replaced pushStack with actual replace so initial jQ object is reordered (not only the returned object)
* 	- fixed non-latin character ordering
*
* in last update:
*	- removed isNum
*   - fixed mixed literal/numeral values
*	- refactored fn contains()
*	- revision number now corresponds to svn revision
*
* Todos:
* 	- todo: uppercase vs lowercase
* 	- todo: 'foobar' != 'foobars' in non-latin
*
*/
;(function($) {
	// private vars
	var fls = !1							// minify placeholder
		,nll = null							// minify placeholder
		,prsflt = parseFloat				// minify placeholder
		,frCrCd = String.fromCharCode		// minify placeholder
		,mathmn = Math.min					// minify placeholder
		,rxLastNr = /(-?\d+\.?\d*)$/g		// regex for testing strings ending on numbers
		//
		// character specific ordering is off by default for speed
		,sCharOrder							// equals the input oSettings.charOrder so we can test any changes
		,aAllChars = []						// all latin chars 32-255
		,aOrderChar							// similar to sAllChars but with the changed char order
		,bDoubles							// boolean indicating double-non-latin chars, ie: lj, dž, Aa, ch, ss etc...
		,iReplace = 0x2500					// doubles are replaced with Unicode char starting at 0x2500
		,oReplace = {}						// replacement object
		,rxNotLatin							// regular expression to test for non-latin chars
	;
	// fix IE8 indexOf (issue 26)
	if (!Array.indexOf) {
		Array.prototype.indexOf = function (o) {
			for (var i=0,l=this.length;i<l;i++) if (this[i]==o) return i;
			return -1;
		}
	}
	// create basic latin string chars 32-255
	for (var i=32,s=frCrCd(i),len=255;i<len;i++,s=frCrCd(i).toLowerCase()) { // using lowerCase instead of upperCase so _ will sort before
		if (aAllChars.indexOf(s)!==-1) aAllChars.push(s);
	}
	aAllChars.sort();
	//
	// init plugin
	$.tinysort = {
		 id: 'TinySort'
		,version: '1.3.25'
		,copyright: 'Copyright (c) 2008-2012 Ron Valstar'
		,uri: 'http://tinysort.sjeiti.com/'
		,licenced: {
			MIT: 'http://www.opensource.org/licenses/mit-license.php'
			,GPL: 'http://www.gnu.org/licenses/gpl.html'
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

			,charOrder: sCharOrder	// the order of non-latin characters

		}
	};
	$.fn.extend({
		tinysort: function(_find,_settings) {
			if (_find&&typeof(_find)!='string') {
				_settings = _find;
				_find = nll;
			}

			var oSettings = $.extend({}, $.tinysort.defaults, _settings)
				,sParent
				,oThis = this
				,iLen = $(this).length
				,oElements = {} // contains sortable- and non-sortable list per parent
				,bFind = !(!_find||_find=='')
				,bAttr = !(oSettings.attr===nll||oSettings.attr=="")
				,bData = oSettings.data!==nll
				// since jQuery's filter within each works on array index and not actual index we have to create the filter in advance
				,bFilter = bFind&&_find[0]==':'
				,$Filter = bFilter?oThis.filter(_find):oThis
				,fnSort = oSettings.sortFunction
				,iAsc = oSettings.order=='asc'?1:-1
				,aNewOrder = [];

			// check charOrder (non latin chars)
			// sCharOrder only to check wether other vars are set
			// variables used on sort
			//		- oSettings.charOrder to test
			//		- bDoubles to test
			//		- oReplace for doubles
			//		- rxNotLatin to test
			//		- aOrderChar to order
			//
			if (oSettings.charOrder!=sCharOrder) {
				sCharOrder = oSettings.charOrder;
				if (!oSettings.charOrder) {
					bDoubles = false;
					iReplace = 0x2500;
					oReplace = {};
					rxNotLatin = aOrderChar = nll;
				} else {
					aOrderChar = aAllChars.slice(0); // first set to entire 32-255 charlist
					bDoubles = false;
					// then loop through the sCharOrder rule
					for (var
						 aCharNotLatin = []
						,fnAddNonLatinChar = function(key,nonLatin){
								aCharNotLatin.push(nonLatin);
								oReplace[oSettings.cases?key:key.toLowerCase()] = nonLatin;
							}
						,sAllCharNotLatin = ''
						,sCharLatin = 'z' // if oSettings.charOrder has no [a-z] characters are appended to z
						,l = sCharOrder.length
						,j,m // init
					,i=0;i<l;i++) { // loop through chars to set 'rxNotLatin' and 'sOrderChar'
						var  sChar = sCharOrder[i]
							,iChar = sChar.charCodeAt()
							,bIsLatin = iChar>96&&iChar<123; // 'a'.charCodeAt()===97 'z'.charCodeAt()===122
						if (!bIsLatin){
							if (sChar=='[') { // find replace chars: ë will sort similar to e
								var iCharNotLatin = aCharNotLatin.length
									,sLastChar = iCharNotLatin?aCharNotLatin[iCharNotLatin-1]:sCharLatin
									,sReplaces = sCharOrder.substr(i+1).match(/[^\]]*/)[0]
									,aDoubles = sReplaces.match(/{[^}]*}/g); // find doubles: dž, ss, lj ...
								if (aDoubles) {
									for (j=0,m=aDoubles.length;j<m;j++) {
										var sCode = aDoubles[j];
										i += sCode.length; // increment i because of .replace(...
										sReplaces = sReplaces.replace(sCode,'');
										fnAddNonLatinChar(sCode.replace(/[{}]/g,''),sLastChar);
										bDoubles = true;
									}
								}
								for (j=0,m=sReplaces.length;j<m;j++) fnAddNonLatinChar(sLastChar,sReplaces[j]);
								i += sReplaces.length+1;
							} else if (sChar=='{') { // find doubles: dž, ss, lj ...
								var sDouble = sCharOrder.substr(i+1).match(/[^}]*/)[0];
								fnAddNonLatinChar(sDouble,frCrCd(iReplace++)); // replace the double with single Unicode 0x2500+
								i += sDouble.length+1;
								bDoubles = true;
							} else {
								aCharNotLatin.push(sChar);
							}
						}
						if (aCharNotLatin.length&&(bIsLatin||i===l-1)) {
							var sCharNotLatin = aCharNotLatin.join('');
							sAllCharNotLatin += sCharNotLatin;
							// first remove non latin chars
							$.each(sCharNotLatin,function(j,s){
								aOrderChar.splice(aOrderChar.indexOf(s),1);
							});
							// then append chars to latin char
							var aParse = aCharNotLatin.slice(0);
							aParse.splice(0,0,aOrderChar.indexOf(sCharLatin)+1,0);
							Array.prototype.splice.apply(aOrderChar,aParse);
							//
							aCharNotLatin.length = 0;
						}
						if (i+1===l) rxNotLatin = new RegExp('['+sAllCharNotLatin+']','gi'); // make regex to test for chars
						else if (bIsLatin) sCharLatin = sChar;
					}
				}
			}

			if (!fnSort) fnSort = oSettings.order=='rand'?function() {
				return Math.random()<.5?1:-1;
			}:function(a,b) {
				var bNumeric = fls
				// maybe toLower
					,sA = !oSettings.cases?toLowerCase(a.s):a.s
					,sB = !oSettings.cases?toLowerCase(b.s):b.s;
				// maybe force Strings
//				var bAString = typeof(sA)=='string';
//				var bBString = typeof(sB)=='string';
//				if (!oSettings.forceStrings&&(bAString||bBString)) {
//					if (!bAString) sA = ''+sA;
//					if (!bBString) sB = ''+sB;
				if (!oSettings.forceStrings) {
					// maybe mixed
					var  aAnum = sA&&sA.match(rxLastNr)
						,aBnum = sB&&sB.match(rxLastNr);
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
				var iReturn = iAsc*(sA<sB?-1:(sA>sB?1:0));
				// test for non latin chars
				if (!bNumeric&&oSettings.charOrder) {
					if (bDoubles) { // first replace doubles
						for (var s in oReplace) {
							var o = oReplace[s];
							sA = sA.replace(s,o);
							sB = sB.replace(s,o);
						}
					}
					// then test if either word has non latin chars
					// we're using the slower string.match because strangely regex.test sometimes fails
					if (sA.match(rxNotLatin)!==nll||sB.match(rxNotLatin)!==nll) {
					   	for (var k=0,l=mathmn(sA.length,sB.length);k<l;k++) {
					   		var iAchr = aOrderChar.indexOf(sA[k])
					   			,iBchr = aOrderChar.indexOf(sB[k]);
					   		if (iReturn=iAsc*(iAchr<iBchr?-1:(iAchr>iBchr?1:0))) break;
					   	}
					}
				}
				return iReturn;
			};
			oThis.each(function(i,el) {
				var $Elm = $(el)
					// element or sub selection
					,mElmOrSub = bFind?(bFilter?$Filter.filter(el):$Elm.find(_find)):$Elm
					// text or attribute value
					,sSort = bData?''+mElmOrSub.data(oSettings.data):(bAttr?mElmOrSub.attr(oSettings.attr):(oSettings.useVal?mElmOrSub.val():mElmOrSub.text()))
 					// to sort or not to sort
					,mParent = $Elm.parent();
				if (!oElements[mParent])	oElements[mParent] = {s:[],n:[]};	// s: sort, n: not sort
				if (mElmOrSub.length>0)		oElements[mParent].s.push({s:sSort,e:$Elm,n:i}); // s:string, e:element, n:number
				else						oElements[mParent].n.push({e:$Elm,n:i});
			});
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
					,i;
				switch (oSettings.place) {
					case 'first':	$.each(oParent.s,function(i,obj) { iLow = mathmn(iLow,obj.n) }); break;
					case 'org':		$.each(oParent.s,function(i,obj) { aOrg.push(obj.n) }); break;
					case 'end':		iLow = oParent.n.length; break;
					default:		iLow = 0;
				}
				for (i = 0;i<iLen;i++) {
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