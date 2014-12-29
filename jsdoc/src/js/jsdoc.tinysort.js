/*global zen, tinysort*/
iddqd.ns('jsdoc.tinysort',(function(undefined){
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
			.then(initExamples);
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
			// add download button
//			var mDown = createElement('div','download',mFirstC);
			createElement('h3',null,mFirst4,{},'download');
			createElement('a','btn btn-lg btn-primary',mFirst4,{href:'https://github.com/Sjeiti/TinySort/archive/master.zip'},'zip');
//			createElement('a','btn btn-md btn-primary',mFirst4,{href:'https://github.com/Sjeiti/TinySort/archive/master.zip'},'download');
			//
			//
			['dist/tinysort.js','dist/tinysort.min.js','dist/tinysort.charorder.js','dist/tinysort.charorder.min.js'].forEach(function(uri){
				var sFile = uri.split('/').pop()
					,mA = createElement('a','btn btn-sm btn-primary filesize',mFirst4,{download:sFile,href:uri},sFile	);
				iddqd.network.xhttp(uri,function(e){
					mA.setAttribute('data-filesize',formatSize(e.response.length));
				});
			});
			//
			//
//			createElement('a','btn btn-sm btn-primary',mFirst4,{download:1,href:'https://github.com/Sjeiti/TinySort/archive/master.zip'},'download gzip');
			// add github banner

			//createElement('a','repo',mFirst4,{'data-type':'git',href:'https://github.com/Sjeiti/TinySort.git'});
			createElement('a',null,mFirst4,{href:'https://github.com/Sjeiti/TinySort'},'https://github.com/Sjeiti/TinySort');
			createElement('code','bower',mFirst4,null,'https://github.com/Sjeiti/TinySort.git');
			createElement('code','bower',mFirst4,null,'bower install tinysort');
			//<a href="https://github.com/Sjeiti/TinySort.git" class="repo" data-type="git" rel="external" target="_blank"></a>
			/*createElement('img',null,
				createElement('a',null,mFirstC,{href:'https://github.com/Sjeiti/TinySort'})
			,{
				style: 'position:absolute;top:'+document.querySelector('nav.navbar').clientHeight+'px;right:0;border:0;'
				,src: 'https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67'
				,alt: 'Fork me on GitHub'
				,'data-canonical-src': 'https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png'
			});*/
		}
	}

	function initScripts(){
		return loadScript('../src/tinysort.js')//todo:change paths
			.then(initTitle)// in here, otherwise shit fails
			.then(loadScript.bind(null,'../src/tinysort.charorder.js'))
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
	}

	function doSort(code){
		console.log('doSort',code); // log
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
			/*case 'xinp':
				for (i=0;i<num;i++) {
					var fnGetFormElement = function(){
						var aTypes = ['text','password','file','url','email','number','range','search','date','time','select'];//,'radio'
						var sType = aTypes[Math.floor(Math.random()*aTypes.length)];
						var sName = getPassword(6,true);
						var sEcho = '<label for="'+sName+'">'+sType+'</label>';
						switch (sType) {
							case 'text':		sEcho += '<input type="text" name="'+sName+'" placeholder="enter some text" />'; break;
							case 'password':	sEcho += '<input type="password" name="'+sName+'" placeholder="enter a password" />'; break;
							case 'url':			sEcho += '<input type="url" name="'+sName+'" placeholder="enter an url" />'; break;
							case 'number':		sEcho += '<input type="number" name="'+sName+'" />'; break;
							case 'range':		sEcho += '<input type="range" name="'+sName+'" />'; break;
							case 'file':		sEcho += '<input type="file" name="'+sName+'" />'; break;
							case 'date':		sEcho += '<input type="date" name="'+sName+'" />'; break;
							case 'time':		sEcho += '<input type="time" name="'+sName+'" />'; break;
							case 'search':		sEcho += '<input type="search" name="'+sName+'" placeholder="search something" />'; break;
							case 'email':		sEcho += '<input type="email" name="'+sName+'" placeholder="enter an email adress" />'; break;
							case 'radio':
								for (var j=0;j<3;j++) {
									var sVal = getPassword(6,true);
									sEcho += '<input type="radio" name="'+sName+'" value="'+sVal+'">'+sVal+'</input>';
								}
							break;
							case 'select':
								sEcho += '<select name="'+getPassword(6,true)+'">';
								for (j=0;j<4;j++) sEcho += '<option>'+getPassword(6,true)+'</option>';
								sEcho += '<optgroup label="'+getPassword(6,true)+'">';
								for (j=0;j<4;j++) sEcho += '<option>'+getPassword(6,true)+'</option>';
								sEcho += '</optgroup>';
								sEcho += '</select>';
							break;
						}
						return sEcho;
					};
					mEl.append('<li>'+fnGetFormElement()+'<span></span></li>');
				}
			break;*/
		} else if (sId==='xany'){
			selector = 'div#'+sId+'>span{a$ }*'+iLen;
			oParse = {a:'s'};
		} else if (sId==='ximg'){
			selector = 'div#'+sId+'>img[src=styles/logo.svg width=30 title=a$]*'+iLen;
			oParse = {a:'s'};
		} else if (sId==='xcst'){
			selector += '{a$}*'+iLen;
			oParse = {a:'i'};
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
//
//	case 'xcst':	for (i=0;i<num;i++) mEl.append('<li>'+rand(0,999)+'</li>'); break;
//	case 'xnum':	for (i=0;i<num;i++) mEl.append('<li>'+(brnd()?getPassword(6):(rand(0,999)/(brnd()?1:10)))+'</li>'); break;
//	case 'xmix':
//		var sBase1 = getPassword(3,true);
//		var sBase2 = getPassword(3,true);
//		var sNum = rand(0,150);
//		for (i=0;i<num/2;i++) mEl.append('<li>'+(getPassword(3,true)+rand(0,150)+getPassword(3,true)+rand(0,150))+'</li>');
//		for (i=0;i<num/2;i++) mEl.append('<li>'+(sBase1+rand(0,150)+sBase2+rand(0,150))+'</li>');
//		for (i=0;i<num/2;i++) mEl.append('<li>'+(sBase1+sNum+sBase2+rand(0,150))+'</li>');
//	break;
//	case 'xrnd':
//		for (i=0;i<num;i++) {
//			if (i>0) {
//				mEl.append('<li>'+getPassword(6)+'</li>');
//			} else {
//				var sId = 's'+i;
//				mEl.append('<li><ul id="'+sId+'"></ul></li>');
//				refill(sId,6);
//			}
//		}
//	break;
//	case 'xmul':
//		var aNames = [];
//		for (i=0;i<(num/2<<0);i++) aNames.push(getPassword(6));
//
//		for (i=0;i<num;i++) {
//			var iTimestamp = rand(1145925286604,1345925286604)
//				,oDate = new Date(iTimestamp)
//				,iMonth = oDate.getMonth()+1
//				,iDay = oDate.getDate()
//				,sDate = (iDay<10?'0':'')+iDay+'-'+(iMonth<10?'0':'')+iMonth+'-'+oDate.getFullYear();
//			mEl.append('<li><span class="name" style="display:inline-block;width:100px;">'+aNames[rand(0,aNames.length)]+'</span> <span class="date" style="font-family:monospace;" data-timestamp="'+iTimestamp+'">'+sDate+'</span> </li>');
//		}
//	break;
//	default:  for (i=0;i<num;i++) mEl.append('<li>'+getPassword(6)+'</li>');
//}
//}
		/////////////////////////////////////////////////////
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

	return init;
})());