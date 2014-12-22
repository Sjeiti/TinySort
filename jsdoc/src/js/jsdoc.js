iddqd.ns('jsdoc',(function(undefined){
	'use strict';

	var loadScript = iddqd.pattern.callbackToPromise(iddqd.loadScript)
		,toSlug = iddqd.internal.native.string.toSlug
		,createElement = iddqd.createElement
		,forEach = Array.prototype.forEach;

	function init(){
		initTableOfContents();
		initBootstrapNoCSS();
		initPreCode();
		initTutorials();
		//initHash();
		//initSmoothScroll();
//		loadScript('scripts/jsdoc.tinysort.js').then(function(){
//			jsdoc.tinysort();
//		});
		loadScript('scripts/jsdoc.tinysort.js').then(function(){
			jsdoc.tinysort();
		});
		//account: 'UA-37777223-1'
		//,domain: 'sjeiti.com'
	}

	function initTableOfContents(){
		var mList = document.createDocumentFragment()
			,aList = [mList]
			,iHeaderNrLast
			,mNavBar = document.querySelector('nav.navbar')
			,iNavBar = mNavBar.offsetHeight;
		forEach.call(document.querySelectorAll('h1,h2,h3,h4,h5,h6'),function(elm){
			var sNodeName = elm.nodeName
				,iHeaderNr = parseInt(sNodeName.match(/\d+/).pop(),10)
				,bIgnore = iHeaderNr===1
				,sText = elm.textContent
				,sSlug = toSlug(sText)
				,wasH1 = false
				,mLi
			;
			if (iHeaderNr===2) iHeaderNr = 1;
			//
			var mA = createElement('div',null,null,{id:sSlug,style:'position:relative;top:-'+iNavBar+'px'});//type,classes,parent,attributes,text,click
			elm.parentNode.insertBefore(mA,elm);
//			createElement('span',null,elm,{id:sSlug,style:'position:relative;top:-50px'});//type,classes,parent,attributes,text,click
//			elm.setAttribute('id',sSlug);
			//
			if (iHeaderNrLast!==undefined) {
				if (iHeaderNr>iHeaderNrLast) {
					var mLiLast = mList.lastChild;
					wasH1 = iHeaderNrLast===1;
					if (wasH1) {
						mLiLast.classList.add('dropdown');
						var mALast = mLiLast.querySelector('a');
						mALast.classList.add('dropdown-toggle');
						mALast.setAttribute('data-toggle','dropdown');
						createElement('b','caret',mALast);
					}
					mList = createElement('ul',wasH1?'dropdown-menu':null,mLiLast,{role:'menu'});
					aList.push(mList);
				} else if (iHeaderNr<iHeaderNrLast) {
					aList.pop();
					mList = aList[aList.length-1];
				}
			}
			iHeaderNrLast = iHeaderNr;
			mLi = createElement('li',null,mList);
			!bIgnore&&createElement('a',null,mLi,{href:'#'+sSlug},sText);
		});
		var mNav = document.querySelector('.nav.navbar-nav')
			,mFirstNav = mNav.firstChild;
		if (mFirstNav) mNav.insertBefore(aList[0],mFirstNav);
		else mNav.appendChild(aList[0]);
	}

	function initBootstrapNoCSS(){
//		loadScript('vendor/bootstrap-without-jquery/bootstrap3/bootstrap-without-jquery.min.js');
		initHamburgerCSS();
		initDropdownCSS();
		initNavbarAnchors();
	}

	function initHamburgerCSS(){
		var mButton = document.querySelector('button.navbar-toggle')
			,mNavBar = document.getElementById('navbar')
			,sId = btoa(123)
			,mLabel = createElement('label','reveal',null,{for:sId})
			,mCheckbox = createElement('input','reveal',null,{type:'checkbox',id:sId})
		;
		while (mButton.childNodes.length) mLabel.appendChild(mButton.childNodes[0]);
		mButton.appendChild(mLabel);
		mNavBar.parentNode.insertBefore(mCheckbox,mNavBar);
		mNavBar.classList.remove('collapse');
	}

	function initDropdownCSS(){
		forEach.call(document.querySelectorAll('.dropdown-toggle'),function(elm,i){
			var mUl = elm.nextSibling
				,mParent = elm.parentNode
				,sId = btoa(1234+i)
				,mLabel = createElement('label','reveal',null,{for:sId})
				,mRadio = createElement('input','reveal',null,{type:'radio',name:'foo',id:sId})
			;
			while (elm.childNodes.length) mLabel.appendChild(elm.childNodes[0]);
			elm.appendChild(mLabel);
			mParent.insertBefore(mRadio,mUl);
		});
		// toggle radio buttons
		var sDataChecked = 'data-checked';
		var mNav = document.querySelector('.nav.navbar-nav');
		mNav.addEventListener('change',function(e){
			var target = e.target;
			if (target.nodeName==='INPUT'){ // refine here
				target.removeAttribute(sDataChecked);
			}
		});
		mNav.addEventListener('click',function(e){
			console.log('clickclickclick'); // log
			var target = e.target;
			if (target.nodeName==='INPUT'){
				setTimeout(function(){
					if (target.checked) {
						if (target.getAttribute(sDataChecked)) {
							target.checked = !target.checked;
							target.removeAttribute(sDataChecked);
						} else {
							target.setAttribute(sDataChecked,1);
						}
					} else {
						target.removeAttribute(sDataChecked);
					}
				},1);
			}
		},false);

	}

	function initNavbarAnchors(){
		var mNavbar = document.getElementById('navbar');
		mNavbar.addEventListener('click',function(e){
			var mTarget = e.target
				,isAnchor = mTarget.nodeName==='A'
				,isToggle = mTarget.classList.contains('dropdown-toggle');
			if (isAnchor&&!isToggle) {
				mNavbar.previousSibling.checked = false;
				forEach.call(mNavbar.querySelectorAll('input.reveal:checked'),function(elm){
					elm.checked = false;
				});
			} else if (isAnchor&&isToggle) {
				iddqd.fireEvent(mTarget.querySelector('label'),'click');
			}
			console.log('mTarget',mTarget.nodeName==='A',mTarget.classList.contains('dropdown-toggle')); // log
		});
	}

	function initPreCode(){
		forEach.call(document.querySelectorAll('pre.source'),function(pre){
			var aMatchLang = pre.getAttribute('class').match(/lang-(\w+)/)
				,sLang = aMatchLang&&aMatchLang.length>1?aMatchLang[1]:'javascript'
				,mCode
			;
			pre.classList.remove('prettyprint');
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

	/*function initHash(){
		if (location.hash) {
			*//*setTimeout(function () {
				$(location.hash).addClass('highlight');
				$.scrollTo&&$.scrollTo(location.hash,500,{axis: 'y',offset: -50});
			},500);*//*
		}
	}

	function initSmoothScroll(){
		var amAnchors = document.querySelectorAll('a[href*=\'#\']')
			,iAnchors = amAnchors.length;
		while(iAnchors--) {
			amAnchors[iAnchors].setAttribute('data-scroll',1);
		}
	}*/

	return {init:init};
})());