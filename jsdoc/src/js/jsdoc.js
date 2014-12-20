/*global zen*/
/**
 * Jsdoc js copied and refactored a bit from Docstrap.
 * Could use a major overhaul.
 */
iddqd.ns('jsdoc',(function($,u){
	'use strict';

	var loadScript = iddqd.pattern.callbackToPromise(iddqd.loadScript);

	function init(options){
		options.collapseSymbols&&initCollapseSymbols();
		initTableOfContents();
		initPreCode();
		initHash();
		initTutorials();
		loadScript('../src/tinysort.js');
		loadScript('../src/tinysort.charorder.js');
		initExamples();
		console.log('adsf'); // log
//						account: 'UA-37777223-1'
//						,domain: 'sjeiti.com'
	}

	function initCollapseSymbols(){
		$('#main').localScroll({
			offset: { top: 56 } //offset by the height of your header (give or take a few px, see what works for you)
		});
		$("dt h4.name").each(function () {
			var $this = $(this);
			var icon = $("<i/>").addClass("icon-plus-sign").addClass("pull-right").addClass("icon-white");
			var dt = $this.parents("dt");
			var children = dt.next("dd");

			$this.append(icon).css({cursor: "pointer"});
			$this.addClass("member-collapsed").addClass("member");

			children.hide();
			$this.toggle(function () {
				icon.addClass("icon-minus-sign").removeClass("icon-plus-sign").removeClass("icon-white");
				$this.addClass("member-open").removeClass("member-collapsed");
				children.slideDown();
			},function () {
				icon.addClass("icon-plus-sign").removeClass("icon-minus-sign").addClass("icon-white");
				$this.addClass("member-collapsed").removeClass("member-open");
				children.slideUp();
			});
		});
	}

	function initTableOfContents(){
		var sPath = location.pathname.split('/').pop()
			, isIndex = sPath==='' || sPath==='index.html';
		if (false&&isIndex) {
			$("#toc").detach();
		} else {
			$("#toc").toc({
				selectors: "h1,h2,h3,h4,dt>a",
				showAndHide: false,
				scrollTo: 60
			});
			$("#toc>ul").addClass("nav nav-pills nav-stacked");
			$("#main span[id^='toc']").addClass("toc-shim");
			if ($("#toc>ul").html()==='') $("#toc").detach();
		}
	}

	function initPreCode(){
		Array.prototype.forEach.call(document.querySelectorAll('pre.source'),function(pre){
			var aMatchLang = pre.getAttribute('class').match(/lang-(\w+)/)
				,sLang = aMatchLang&&aMatchLang.length>1?aMatchLang[1]:'javascript'
				,mCode
			;
			pre.classList.remove('prettyprint');
			console.log('sLang',sLang); // log
			if (sLang) {
				mCode = pre.querySelector('code');
				if (mCode.textContent.split(/\n/g).length<10) {
					mCode.setAttribute('data-line',-1);
				}
				if (mCode&&!mCode.classList.contains('rainbow')) {
					mCode.setAttribute('data-language',sLang);
				} else if (mCode&&mCode.classList.contains('rainbow')) {
					console.warn('Rainbow already initialised for',mCode);
				}
			}
		});
	}

	function initHash(){
		if (location.hash) {
			setTimeout(function () {
				$(location.hash).addClass('highlight');
				$.scrollTo(location.hash,500,{axis: 'y',offset: -50});
			},500);
		}
	}

	function initTutorials(){
		/*global jsdoc*/
		var aMatchTutorial = location.pathname.match(/\/tutorial-([^.]*).html/);
		if (aMatchTutorial) {
			var sTutorial = aMatchTutorial.pop();
			if (jsdoc.tutorial.hasOwnProperty(sTutorial)) {
				jsdoc.tutorial[sTutorial]();
			}
		}
	}

	function initExamples(){
		Array.prototype.forEach.call(document.querySelectorAll('pre'),function(pre){
			var mCode = pre.querySelector('code')
				,sCode = mCode.textContent
				,aCodeSelector = sCode.match(/(All\(')([^']*)/)
				,sSelector = aCodeSelector&&aCodeSelector.pop()
			;
			if (sSelector) {
				var mDiv = zen('div>(menu[type=toolbar]>a.sort{sort}+{ or }+a.reset{reset})+div.example').pop()
					,mPreParent = pre.parentNode
					,mPreNext = pre.nextSibling
					,mSort = mDiv.querySelector('.sort')
					,mReset = mDiv.querySelector('.reset')
					,fnReset = reset.bind(null,mDiv.querySelector('.example'),sSelector)
				;
				mSort.addEventListener('click',doSort.bind(null,sCode));
				mReset.addEventListener('click',fnReset);
				fnReset();
				//
				if (mPreNext) mPreParent.insertBefore(mDiv,mPreNext);
				else mPreParent.appendChild(mDiv);
			}
		});
	}

	function doSort(code){
		console.log('doSort',code); // log
		/*jshint evil:true*/
		eval(code);
		/*jshint evil:false*/
	}

	function reset(parent,selector){
		var aFoo = 'jlufhl,iuaewf,liuaw,felhua,fhuuf,iudsf,weoijj,pojvnb'.split(',')
			,mExample = zen(selector+'{a$}*'+aFoo.length,{a:aFoo}).pop();
		while (parent.firstChild) parent.removeChild(parent.firstChild);
		parent.appendChild(mExample);
	}


	return {init:init};
})(jQuery));