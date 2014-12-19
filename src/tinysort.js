if (!window.tinysort) window.tinysort = (function(undefined){
	'use strict';

	// private vars
	var fls = !1							// minify placeholder
		,nll = null							// minify placeholder
		,prsflt = parseFloat				// minify placeholder
//		,mathmn = Math.min					// minify placeholder
		,rxLastNr = /(-?\d+\.?\d*)$/g		// regex for testing strings ending on numbers
		,rxLastNrNoDash = /(\d+\.?\d*)$/g	// regex for testing strings ending on numbers ignoring dashes
//		,aPluginPrepare = []
//		,aPluginSort = []
		,iCriteria = 0
		,iCriterium = 0
		////////////////////////////
//		id: 'TinySort'
//		,version: '1.5.6'
//		,copyright: 'Copyright (c) 2008-2013 Ron Valstar'
//		,uri: 'http://tinysort.sjeiti.com/'
//		,licensed: {
//			MIT: 'http://www.opensource.org/licenses/mit-license.php'
//			,GPL: 'http://www.gnu.org/licenses/gpl.html'
//		}
		,defaults = { // default settings

			 order: 'asc'			// order: asc, desc or rand

			,attr: nll				// order by attribute value
			,data: nll				// use the data attribute for sorting
			,useVal: fls			// use element value instead of text

			,place: 'start'			// place ordered elements at position: start, end, org (original position), first
			,returns: fls			// return all elements or only the sorted ones (true/false)

			,cases: fls				// a case sensitive sort orders [aB,aa,ab,bb]
			,forceStrings:fls		// if false the string '2' will sort with the value 2, not the string '2'

			,ignoreDashes:fls		// ignores dashes when looking for numerals

			,sortFunction: nll		// override the default sort function
		}
	;

	/**
	 * TinySort is a small and simple script that will sort any nodeElment by it's text- or attribute value, or by that of one of it's children.
	 * @summary A nodeElement sorting script.
	 * @version 2.0.6 beta
	 * @license MIT/GPL
	 * @author Ron Valstar (http://www.sjeiti.com/)
	 * @copyright Ron Valstar <ron@ronvalstar.nl>
	 * @param {NodeList} nodeList
	 * @param {String} [selector]
	 * @param {Object} [...options]
	 * @returns {Array}
	 */
	function tinysort(nodeList){
		var mFragment = document.createDocumentFragment()
			/** both sorted and unsorted elements
			 * @type {elementObject[]} */
			,aoFull = []
			/** sorted elements
			 * @type {elementObject[]} */
			,aoSort = []
			/** unsorted elements
			 * @type {elementObject[]} */
			,aoNot = []
			/** sorted elements before sort
			 * @type {elementObject[]} */
			,aoSortBeforeSort
			/** @type {criterium[]} */
			,aCriteria = []
			/** @type {HTMLElement} */
			,mParent
			,bSameParent = true
		;

		initCriteria.apply(nll,Array.prototype.slice.call(arguments,1));
		initSortList();
		sort();
		applyToDOM();

		/**
		 * Create criteria list
		 */
		function initCriteria(){
			var sTempSelect
				,iArguments = arguments.length;
			if (iArguments===0) {
				addCriterium();
			} else {
				loop(arguments,function(param,i){
					if (isString(param)) {
						if (sTempSelect||iArguments===i+1) addCriterium(sTempSelect||param);
						sTempSelect = param;
					} else {
						addCriterium(sTempSelect,param);
						sTempSelect = nll;
					}
				});
			}
			iCriteria = aCriteria.length;
		}

		/**
		 * A criterium is a combination of the selector, the options and the default options
		 * @typedef {Object} criterium
		 * @property {String} order - order: asc, desc or rand
		 * @property {String} attr - order by attribute value
		 * @property {String} data - use the data attribute for sorting
		 * @property {Boolean} useVal - use element value instead of text
		 * @property {String} place - place ordered elements at position: start, end, org (original position), first
		 * @property {Boolean} returns - return all elements or only the sorted ones (true/false)
		 * @property {Boolean} cases - a case sensitive sort orders [aB,aa,ab,bb]
		 * @property {Boolean} forceStrings - if false the string '2' will sort with the value 2, not the string '2'
		 * @property {Boolean} ignoreDashes - ignores dashes when looking for numerals
		 * @property {Function} sortFunction - override the default sort function
		 */

		/**
		 * Adds a criterium
		 * @param {String} [selector]
		 * @param {Object} [options]
		 */
		function addCriterium(selector,options){
			var bFind = !!selector
				,bFilter = bFind&&selector[0]===':'
				,oOptions = extend(options||{},defaults)
			;
			aCriteria.push(extend({ // todo: only used locally, find a way to minify properties
				 sFind: selector
				,selector: selector
				// has find, attr or data
				,bFind: bFind
				,bAttr: !(oOptions.attr===nll||oOptions.attr==='')
				,bData: oOptions.data!==nll
				// filter
				,bFilter: bFilter
				,mFilter: nll//bFilter?oThis.filter(select):oThis
				,fnSort: oOptions.sortFunction
				,iAsc: oOptions.order==='asc'?1:-1
			},oOptions));
		}

		/**
		 * The element object.
		 * @typedef {Object} elementObject
		 * @property {HTMLElement} elm - The element
		 * @property {number} pos - original position
		 * @property {number} posn - original position on the partial list
		 */

		/**
		 * Creates an elementObject and adds to lists.
		 * Also checks if has one or more parents.
		 */
		function initSortList(){
			loop(nodeList,function(elm,i){
				if (!mParent) mParent = elm.parentNode;
				else if (mParent!==elm.parentNode) bSameParent = false;
				var criterium = aCriteria[0]
					,bFilter = criterium.bFilter
					,sSelector = criterium.selector
					,idd = !sSelector||(bFilter&&elm.matchesSelector(sSelector))||(sSelector&&elm.querySelector(sSelector))
					,aListPartial = idd?aoSort:aoNot
				;
				var oElementObject = {
					elm: elm
					,pos: i
					,posn: aListPartial.length
				};
				aoFull.push(oElementObject);
				aListPartial.push(oElementObject);
			});
			aoSortBeforeSort = aoSort.slice(0);
		}

		/**
		 * Sorts the sortList
		 */
		function sort(){
//			console.log('aCriteria',aCriteria); // log
//			console.log('aoList',aoList); // log
			aoSort.sort(sortFunction);
		}

		/**
		 * Sort all the things
		 * @param {elementObject} a
		 * @param {elementObject} b
		 * @returns {number}
		 */
		function sortFunction(a,b){
			var iReturn = 0;
			if (iCriterium!==0) iCriterium = 0;
			while (iReturn===0&&iCriterium<iCriteria) {
				/** @type {criterium} */
				var oCriterium = aCriteria[iCriterium]
					,rxLast = oCriterium.ignoreDashes?rxLastNrNoDash:rxLastNr;
				//
				// todo: fnPluginPrepare(oSett);
				//
				if (oCriterium.sortFunction) { // custom sort
					iReturn = oCriterium.sortFunction(a,b);
				} else if (oCriterium.order=='rand') { // random sort
					iReturn = Math.random()<0.5?1:-1;
				} else { // regular sort
					var bNumeric = fls
						// prepare sort elements
						,sA = getSortBy(a,oCriterium)//a.text//prepareSortElement(oSett,a.s[iCriteria])
						,sB = getSortBy(b,oCriterium)//b.text//prepareSortElement(oSett,b.s[iCriteria])
					;
					// maybe force Strings
					if (!oCriterium.forceStrings) {
						// maybe mixed
						var  aAnum = isString(sA)?sA&&sA.match(rxLast):fls
							,aBnum = isString(sB)?sB&&sB.match(rxLast):fls;
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
					if (sA===undefined||sB===undefined) {
						iReturn = 0;
					} else {
						iReturn = oCriterium.iAsc*(sA<sB?-1:(sA>sB?1:0));
					}
				}
				//loop(aPluginSort,function(fn){
				//	iReturn = fn.call(fn,bNumeric,sA,sB,iReturn);
				//});
				if (iReturn===0) iCriterium++;
			}
			return iReturn;
//			return a.text>b.text?1:-1;
		}

		/**
		 * Get the string/number to be sorted by checking the elementObject with the criterium.
		 * @param {elementObject} elementObject
		 * @param {criterium} criterium
		 * @returns {String}
		 * @todo memoize
		 */
		function getSortBy(elementObject,criterium){
			var sReturn
				,mElement = elementObject.elm;
			// element
			if (criterium.selector) {
				if (criterium.bFilter) {
					if (!mElement.matchesSelector(criterium.selector)) mElement = nll;
				} else {
					mElement = mElement.querySelector(criterium.selector);
				}
			}
			// value
			if (criterium.bAttr) sReturn = mElement.getAttribute(criterium.attr);
			else if (criterium.useVal) sReturn = mElement.value ;
			else if (criterium.bData) sReturn = mElement.getAttribute('data-'+criterium.data);
			else if (mElement) sReturn = mElement.textContent;
			// sets if the element was not sorted
//			if (criterium.returns&&elementObject.sorted&&!mElement) elementObject.sorted = false;
			//
			return sReturn;
		}

//		function prepareSortElement(settings,element){
//			if (typeof element=='string') {
//				// if !settings.cases
//				if (!settings.cases) element = toLowerCase(element);
//				element = element.replace(/^\s*(.*?)\s*$/i, '$1');
//			}
//			return element;
//		}
//		function toLowerCase(s) {
//			return s&&s.toLowerCase?s.toLowerCase():s;
//		}


		/**
		 * Applies the sorted list to the DOM
		 */
		function applyToDOM(){
			var bAllSorted = aoSort.length===aoFull.length;
			if (bSameParent&&bAllSorted) {
				aoSort.forEach(function(elmObj){
					mFragment.appendChild(elmObj.elm);
				});
				mParent.appendChild(mFragment);
				//
			} else if (bSameParent&&!bAllSorted) {
				aoSort.forEach(function(elmObj){
					var iToPos = aoSort[elmObj.posn].pos;
					aoFull[iToPos] = elmObj;
				});
				aoFull.forEach(function(o) {
					mFragment.appendChild(o.elm);
				});
				mParent.appendChild(mFragment);
				//
			} else {
				aoSort.forEach(function(elmObj) {
					var mElm = elmObj.elm
						,mGhost = document.createElement('div')
					;
					elmObj.ghost = mGhost;
					mElm.parentNode.insertBefore(mGhost,mElm);
				});
				aoSort.forEach(function(elmObj,i) {
					var mGhost = aoSortBeforeSort[i].ghost;
					mGhost.parentNode.insertBefore(elmObj.elm,mGhost);
					mGhost.parentNode.removeChild(mGhost);
				});
			}
		}

		return aoSort.map(function(o) {
			return o.elm;
		});
	}

	/**
	 * Test if an object is a string
	 * @memberOf tinysort
	 * @method
	 * @private
	 * @param o
	 * @returns {boolean}
	 */
	function isString(o){
		return typeof o=='string';
	}

	/**
	 * Traverse an array, or array-like object
	 * @memberOf tinysort
	 * @method
	 * @private
	 * @param {Array} array The object or array
	 * @param {Function} func Callback function with the parameters value and key.
	 */
	function loop(array,func){
		var l = array.length
			,i = l
			,j;
		while (i--) {
			j = l-i-1;
			func(array[j],j);
		}
	}

	/**
	 * Extend an object
	 * @memberOf tinysort
	 * @method
	 * @private
	 * @param {Object} obj Subject.
	 * @param {Object} fns Property object.
	 * @param {boolean} [overwrite=false]  Overwrite properties.
	 * @returns {Object} Subject.
	 */
	function extend(obj,fns,overwrite){
		for (var s in fns) {
			if (overwrite||obj[s]===undefined) {
				obj[s] = fns[s];
			}
		}
		return obj;
	}

	return tinysort;
})();

// todo: add as dependency
(function(){
	'use strict';

	window.Element && function(ElementPrototype) {
		ElementPrototype.matchesSelector = ElementPrototype.matchesSelector ||
		ElementPrototype.mozMatchesSelector ||
		ElementPrototype.msMatchesSelector ||
		ElementPrototype.oMatchesSelector ||
		ElementPrototype.webkitMatchesSelector ||
		function (selector) {
			var node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;

			while (nodes[++i] && nodes[i] != node);

			return !!nodes[i];
		};
	}(Element.prototype);
})();