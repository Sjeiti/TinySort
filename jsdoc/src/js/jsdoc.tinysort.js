/*global zen, tinysort*/
iddqd.ns('jsdoc.tinysort',(function(){
	'use strict';

	var loadScript = iddqd.pattern.callbackToPromise(iddqd.loadScript)
		,formatSize = iddqd.internal.native.number.formatSize
		,createElement = iddqd.createElement
		,forEach = Array.prototype.forEach;

	function init(){
		var sPage = location.href.split('#').shift().split('/').pop();
		if (sPage==='index.html'||sPage==='') {
			initFirstParagraph();
			initScripts()
			.then(initTitle)
			.then(initExamples)
			.then(initAnalytics);
		}
	}

	function initTitle(){
		var aVersion = tinysort.version.split('.')
			,mSmall = createElement('small',null,document.querySelector('.navbar-brand'),null,aVersion.slice(0,2).join('.'));
		createElement('span',null,mSmall,null,'.'+aVersion.pop());
	}

	function initFirstParagraph(){
		// put shit in wide green div
		var sPath = location.pathname;
		if (sPath.indexOf('.html')===-1||sPath.indexOf('index.html')!==-1) {
			var mContainer = document.querySelector('body>.container')
				,mArticle = document.querySelector('#main article')
				,mFirstP = createElement('div','firstparagraph')
				,mFirstC = createElement('div','container',mFirstP)
				,mFirst8 = createElement('div','col-sm-9',mFirstC)
				,mFirst4 = createElement('div','col-sm-3 download',mFirstC);
			while (mArticle.firstChild.nodeName!=='H2') {
				mFirst8.appendChild(mArticle.firstChild);
			}
			mContainer.parentNode.insertBefore(mFirstP,mContainer);
			//
			// add download button
			createElement('h3',null,mFirst4,{},'download');
			createElement('a','btn btn-lg btn-primary',mFirst4,{href:'https://github.com/Sjeiti/TinySort/archive/master.zip'},'zip');
			//
			['dist/tinysort.js','dist/tinysort.min.js','dist/tinysort.charorder.js','dist/tinysort.charorder.min.js'].forEach(function(uri){
				var sFile = uri.split('/').pop()
					,mA = createElement('a','btn btn-sm btn-primary filesize',mFirst4,{download:sFile,href:uri},sFile	);
				iddqd.network.xhttp(uri,function(e){
					mA.setAttribute('data-filesize',formatSize(e.response.length));
				});
			});
			//
			// todo: http://cdnjs.com/libraries/tinysort
			// see: https://github.com/cdnjs/cdnjs#adding-a-new-or-updating-an-existing-library
			// and http://ifandelse.com/its-not-hard-making-your-library-support-amd-and-commonjs/
			createElement('a',null,mFirst4,{href:'https://github.com/Sjeiti/TinySort'},'https://github.com/Sjeiti/TinySort');
			createElement('code','bower',mFirst4,null,'https://github.com/Sjeiti/TinySort.git');
			createElement('code','bower',mFirst4,null,'bower install tinysort');
		}
	}

	function initScripts(){
		return loadScript('dist/tinysort.js')
			.then(loadScript.bind(null,'dist/tinysort.charorder.js',null))
		;

	}

	function initExamples(){
		forEach.call(document.querySelectorAll('pre'),function(pre){
			var mCode = pre.querySelector('code')
				,sCode = mCode.textContent
				,aCodeSelector = sCode.match(/(tinysort\(')([^']*)/)
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
		// table example
		initTableSort();
	}

	function initAnalytics(){
		if (location.hostname==='tinysort.sjeiti.com'){
			loadScript('//www.google-analytics.com/analytics.js')
			.then(function(){
				/*global ga*/
				ga('create', 'UA-37777223-1', 'auto');
				ga('send', 'pageview');
			});
		}
	}

	function doSort(code){
		/*jshint evil:true*/
		eval(code);
		/*jshint evil:false*/
	}

	function reset(parent,selector){
		var aId = selector.match(/#(\w+)/)
			,sId = aId&&aId.pop()
			,oParse = {}
			,iLen = 8
			,l = getList.bind(null,iLen)
			,mExample
		;
		if (sId==='xattr'||sId==='xret'){
			selector += '*'+iLen+'>span.a${b$}';
			oParse = {a:'t',b:'s'};
		} else if (sId==='xsub'){
			selector += '*'+iLen+'>span{a$ }+span{b$}';
			oParse = {a:'s',b:'s'};
		} else if (sId==='xval'){
			selector += '*'+iLen+'>span{a$}+{ }+a[href=#b$ title=c$]{d$}';
			oParse = {a:'s',b:'s',c:'s',d:'s'};
		} else if (sId==='xdta'){
			selector += '*'+iLen+'>span{a$}+a[href=# data-foo=b$]{c$}';
			oParse = {a:'s',b:'s',c:'s'};
		} else if (sId==='xinp'){
			selector += '*'+iLen+'>input[value=a$]';
			oParse = {a:'s'};
		} else if (sId==='xany'){
			selector = 'div#'+sId+'>span{a$ }*'+iLen;
			oParse = {a:'s'};
		} else if (sId==='ximg'){
			selector = 'div#'+sId+'>img[src=styles/logo.svg width=30 title=a$]*'+iLen;
			oParse = {a:'s'};
		} else if (sId==='xnum'){
			selector += '{a$}*'+iLen;
			oParse = {a:'n '};
		} else if (sId==='xmix'){
			selector += '{a$}*'+iLen;
			oParse = {a:l('si',4)};
		} else if (sId==='xmul'){
			selector += '*'+iLen+'>span.name{a$}+span.date[data-timestamp=b$]{b$}';
			oParse = {a:l('s ',4),b:'i'};
		} else if (['greek','serb','danish'].indexOf(sId)!==-1){
			var aLang = {
				greek: 'άλογο,ανδρας,δάσκαλος,δεντρο,δήμητρα,κάτω,λύθηκε,λύξη,μπροστά,πλένω,πλυντήριο'
				,serb: 'άλογο,ανδρας,δάσκαλος,δεντρο,δήμητρα,κάτω,λύθηκε,λύξη,μπροστά,πλένω,πλυντήριο'
				,danish: 'København,Æble,Øresund,Åben,Aarhus,Åse,druenzin,evisk,håndkommertepokker,imagen,mærk,vestegnendenne,vidste,væmme'
			}[sId].split(',').sort(function(){return Math.random()<0.5?1:-1;});
			aLang.length = iLen;
			selector += '{a$}*'+iLen;
			oParse = {a:aLang};
		} else {
			selector += '{a$}*'+iLen;
			oParse = {a:'s'};
		}
		for (var s in oParse) {
			var sVal = oParse[s];
			if (typeof sVal==='string') oParse[s] = l(sVal);
		}
		mExample = zen(selector,oParse).pop();
		if (sId==='ximg') {
			forEach.call(mExample.querySelectorAll('img'),function(img){
				img.style.backgroundColor = '#'+Math.floor(Math.random()*16777215).toString(16);
			});
		}
		while (parent.firstChild) parent.removeChild(parent.firstChild);
		parent.appendChild(mExample);
	}

	function getList(len,type,max){
		var iNum = 1E3
			,iLen = len||8
			,a = [];
		for (var i=0;i<iLen;i++) {
			var aType = type.split('');
			aType.forEach(function(s,n){
				if (s==='s') {
					var aLorem = 'a et at in mi ac id eu ut non dis cum sem dui nam sed est nec sit mus vel leo urna duis quam cras nibh enim quis arcu orci diam nisi nisl nunc elit odio amet eget ante erat eros ipsum morbi nulla neque vitae purus felis justo massa donec metus risus curae dolor etiam fusce lorem augue magna proin mauris nullam rutrum mattis libero tellus cursus lectus varius auctor sociis ornare magnis turpis tortor semper dictum primis ligula mollis luctus congue montes vivamus aliquam integer quisque feugiat viverra sodales gravida laoreet pretium natoque iaculis euismod posuere blandit egestas dapibus cubilia pulvinar bibendum faucibus lobortis ultrices interdum maecenas accumsan vehicula nascetur molestie sagittis eleifend facilisi suscipit volutpat venenatis fringilla elementum tristique penatibus porttitor imperdiet curabitur malesuada vulputate ultricies convallis ridiculus tincidunt fermentum dignissim facilisis phasellus consequat adipiscing parturient vestibulum condimentum ullamcorper scelerisque suspendisse consectetur pellentesque'.split(' ');
					if (max) aLorem.length = max;
					aLorem.sort(function(){return brnd()?1:-1;});
					aType[n] = aLorem.pop();
				} else if (s==='n') {
					var fRnd = Math.random()*iNum;
					aType[n] = brnd()?fRnd:fRnd<<0;
				} else if (s==='i') {
					aType[n] = Math.random()*iNum<<0;
				} else if (s==='f') {
					aType[n] = Math.random()*iNum;
				} else if (s==='t') {
					aType[n] = brnd()?'':'striked';
				}
			});
			a.push(aType.join(''));
		}
		return a;
	}

	function brnd(){
		return Math.random()<0.5;
	}

	function initTableSort(){
		var mTable = document.getElementById('xtable')
			,mTHead = mTable.querySelector('thead')
			,amTh = mTHead.querySelectorAll('th')
			,mTBody = mTable.querySelector('tbody')
			,mPre
		;
		mTHead.addEventListener('click',handleTheadClick.bind(null,amTh,mTBody));
		mTBody.addEventListener('click',handleTbodyClick);
		for (var i=0;i<5;i++) addTableRow(amTh,mTBody);
		//
		mPre = mTable;
		while (mPre.nodeName!=='PRE') mPre = mPre.previousSibling;
		/*jshint evil:true*/
		eval(mPre.textContent);
		/*jshint evil:false*/

	}

	function handleTheadClick(amth,body,e){
		if (e.target.textContent==='add row') addTableRow(amth,body);
	}

	function handleTbodyClick(e){
		var mTr = e.target;
		if (mTr.nodeName==='COMMAND') {
			while (mTr.nodeName!=='TR') mTr = mTr.parentNode;
			mTr.parentNode.removeChild(mTr);
		}
	}

	function addTableRow(amth,body){
		var mTr = document.createElement('tr');
		for (var i=0,l=amth.length;i<l;i++) {
			var sTh = amth[i].textContent
					,mTd = document.createElement('td')
					,sType = {word:'s',int:'i',float:'f',mixed:'si'}[sTh];
			if (sTh==='add row') {
				var mCommand = document.createElement('command');
				mCommand.textContent = 'x';
				mTd.appendChild(mCommand);
			} else {
				mTd.textContent = getList(1,sType).pop();
			}
			mTr.appendChild(mTd);
		}
		body.appendChild(mTr);
	}

	return init;
})());