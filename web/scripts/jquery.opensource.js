
(function(obj,fns){
	var p = obj.prototype;
	for (var s in fns) if (!obj[s]) p[s] = fns[s];
})(Number,{
    secondsToMinutesString: function(f){
        return (''+parseInt(f/60)).pad(2,0,true)+':'+(''+parseInt(f)%60).pad(2,0,true);
    }
	,formatSize: function(round) {
		var i, size = this;
		if (round===undefined) round = 0;
		var aSizes = ['B','kB','MB','GB','TB','PB','EB','ZB','YB'];
		for (i=0; size>1024&&(aSizes.length>=(i+2));i++) size /= 1024;
		return Math.round(size,round)+aSizes[i];
	}
});

if (OPENSOURCE===undefined) {
var OPENSOURCE = (function($){
	function init(project,fnc){
		$(function(){
			// set h1 name and version
			$('h1').text(project.id+' '+project.version);
			$('#footer>div').html(project.copyright.replace('Ron Valstar','<a href="http://www.sjeiti.com/">Ron Valstar</a>'));
			//
			// create menu
			var $Menu = $('<ul/>').appendTo('header>div>nav');
			$('<li><a href="#"></a></li>').appendTo($Menu).click(function(){$(document).scrollTop(0)});
//			$('<li><a href="#">'+project.id+'</a></li>').appendTo($Menu).click(function(){$(document).scrollTop(0)});
			var $Li,$SubMenu;
			$('body h2,body h3').each(function(i,el){
				var sNode = el.nodeName.toLowerCase();
				var $Elm = $(el);
				var sTitle = $Elm.attr('title')||$Elm.text();
				var sId = sTitle.replace(/[^a-z0-9]/gi,'');
				$('<a id="'+sId+'" class="hiddenAnchor"/>').prependTo($Elm);
				var bH2 = sNode=='h2';
				var $H = $('<li><a href="#'+sId+'">'+sTitle+'</a></li>').appendTo(bH2?$Menu:$SubMenu);
				if (bH2) {
					$Li = $H;
					$SubMenu = $('<ul></ul>');
				}
				if ($SubMenu&&$SubMenu.find('li').length) $SubMenu.appendTo($Li);
			});
			//
			// set latest zip
			$('a.download[href*=".zip"]').each(function(i,el){
				var $A = $(el);
				$A.attr('href',$A.attr('href').replace(/\d+\.\d+\.\d+/g,project.version));
			});
			//
			// calculate filesizes
			var oSizeLib = {};
			$('.filesize').each(function(i,el){
				var $Size = $(el);
				var sFile = $Size.data('file')||$Size.parents('[href]:first').attr('href');
				function setSizes(load){
					$.each(load.targets,function(i,$El){
						setSize($El,load.size);
					});
				}
				function setSize($El,size){
					$El.text(size.formatSize());
				}
				var oLoad = oSizeLib[sFile]||null;
				if (oLoad&&oLoad.loaded) { // size was calculated
					setSize($El,oLoad.size);
				} else if (oLoad) { // file is loading
					oLoad.targets.push($Size);
				} else { // new file
					oLoad = {loaded:false,targets:[$Size]};
					oSizeLib[sFile] = oLoad;
					$.get(sFile,function(data){
						oLoad.loaded = true;
						oLoad.size = data.length;
						setSizes(oLoad);
					});
				}
			});
			//
			// footer
			var $Footer = $('footer');
			$Footer.html($Footer.html().replace(/-[0-9]{4}/g,'-'+(new Date()).getFullYear()));
			//
			// pre // todo: make it so
			var oKeys = [];
			$(window).keydown(function(e){
				oKeys[e.keyCode] = true;
				var CTRL = oKeys[17];

                var txt = '';
				if (window.getSelection) txt = window.getSelection();
				else if (document.getSelection) txt = document.getSelection();
				else if (document.selection) txt = document.selection.createRange().text;

				if (CTRL&&e.keyCode===65) {
					return false;
				}
			}).keyup(function(e){
				oKeys[e.keyCode] = false;
			});
			//
			// add flattr node
			$('<span class="flattrBox"><a class="FlattrButton" href="http://'+project.id+'.sjeiti.com/"></a></span>').appendTo('#intro>div');
			// flattr code
			var s = document.createElement('script'), t = document.getElementsByTagName('script')[0];
			s.type = 'text/javascript';
			s.async = true;
			s.src = 'http://api.flattr.com/js/0.6/load.js?mode=auto';
			t.parentNode.insertBefore(s, t);
			//
			// init function
			fnc();
		});
	}
	return {
		init:init
	};
})(jQuery);
}