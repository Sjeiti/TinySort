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
				$.scrollTo&&$.scrollTo(location.hash,500,{axis: 'y',offset: -50});
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
			selector += '*'+iLen+'>span{a$}+span{b$}';
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
			selector = 'div#'+sId+'>span{a$}*'+iLen;
			oParse = {a:'s'};
		} else if (sId==='ximg'){
			selector = 'div#'+sId+'>img[src=style/logo.png title=a$ style=$b]*'+iLen;
			oParse = {a:'s',b:'s'};
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
		} else {
			selector += '{a$}*'+iLen;
			oParse = {a:'s'};
		}
		mExample = zen(selector,oParse).pop();
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
//	case 'greek':	mEl.append('<li>'+('Î¬Î»Î¿Î³Î¿,Î±Î½Î´ÏÎ±Ï‚,Î´Î¬ÏƒÎºÎ±Î»Î¿Ï‚,Î´ÎµÎ½Ï„ÏÎ¿,Î´Î®Î¼Î·Ï„ÏÎ±,ÎºÎ¬Ï„Ï‰,Î»ÏÎ¸Î·ÎºÎµ,Î»ÏÎ¾Î·,Î¼Ï€ÏÎ¿ÏƒÏ„Î¬,Ï€Î»Î­Î½Ï‰,Ï€Î»Ï…Î½Ï„Î®ÏÎ¹Î¿'.split(',').sort(function(){return Math.random()>.5?1:-1}).join('</li><li>'))+'</li>'); break;
//	case 'danish':	mEl.append('<li>'+('KÃ¸benhavn,Ã†ble,Ã˜resund,Ã…ben,Aarhus,Ã…se'.split(',').sort(function(){return Math.random()>.5?1:-1}).join('</li><li>'))+'</li>'); break;
//	case 'serb':	mEl.append('<li>'+('coga,Äega,Äovjek,dÅ¾ep,godina,gospodin,liljana,luÄ‘ak,ljubav,muÅ¡karac,muÅ¾,noÅ¾,njuÅ¡ka,zec'.split(',').sort(function(){return Math.random()>.5?1:-1}).join('</li><li>'))+'</li>'); break;
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


	return {init:init};
})(jQuery));