if (!window.tinysort) window.tinysort = (function(){
	'use strict';
	// private vars
	var fls = !1							// minify placeholder
		,nll = null							// minify placeholder
		/*,prsflt = parseFloat				// minify placeholder
		,mathmn = Math.min					// minify placeholder
		,rxLastNr = /(-?\d+\.?\d*)$/g		// regex for testing strings ending on numbers
		,rxLastNrNoDash = /(\d+\.?\d*)$/g	// regex for testing strings ending on numbers ignoring dashes
		,aPluginPrepare = []
		,aPluginSort = []
		,*/
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
	 *
	 * @param {NodeList} nodeList
	 * @param {String} [select]
	 * @param {Object} [options]
	 * @returns {Array}
	 */
	function tinysort(nodeList,select,options){
		var aoList = []
			,mFragment = document.createDocumentFragment()
			,mParent
			//
			,aSelect = []
			,aOption = []
		;
		//
		(function(){
			initArguments();
			initSortList();
			sort();
			applyToDOM();
		})();

		/**
		 * Order arguments in paired select and option list
		 */
		function initArguments(){
			var iSelect;
			loop(arguments,function(param,i){
				if (i>0){
					if (isString(param))	{
						if (aSelect.push(param)-1>aOption.length) aOption.length = aSelect.length-1;
					} else {
						if (aOption.push(extend(param,defaults))>aSelect.length) aSelect.length = aOption.length;
					}
				}
			});
			// equal length
			iSelect = aSelect.length;
			if (iSelect>aOption.length) aOption.length = iSelect; // todo: and other way around?
			// no select arguments
			if (iSelect===0) {
				aSelect.length = 1;
				aOption.push({});
			}
			//
			console.log('aFind,aSettings',aSelect,aOption); // log
		}

		/**
		 * Creates a list of objects to be sorted
		 */
		function initSortList(){
			loop(nodeList,function(elm,i){
				if (!mParent) mParent = elm.parentNode;
				aoList.push({
					elm: elm
					,pos: i
					,text: elm.textContent
				});
			});
		}

		/**
		 * Sorts the sortList
		 */
		function sort(){
			aoList.sort(function (a,b) {
				return a.text>b.text?1:-1;
			});
		}

		/**
		 * Applies the sorted list to the DOM
		 */
		function applyToDOM(){
			aoList.forEach(function (o) {
				mFragment.appendChild(o.elm);
			});
			mParent.appendChild(mFragment);
		}

		return aoList.map(function(o) {
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