if (window.tinysort===undefined) window.tinysort = (function($){
	'use strict';
	var $Body
		,$List
		,$Output
		,sOutput = ''
		,oReturn = {
			add: add
			,log: log
		}
	;
	$(function(){
		$Body = $('body');
		$List = $('<ul></ul>').appendTo($Body);
		$Output = $('<pre></pre>').appendTo($Body);
	});
	function add(name,fn){
		console.log('add',name); // log
		$('<li><a href="#">'+name+'</a></li>').appendTo($List).click(fn);
	}
	function log(){
		_.each(arguments,function(s){
			sOutput += s+' ';
		});
		sOutput += "\n";
		$Output.text(sOutput);
		console.log.apply(console,arguments);
	}
	log.clear = function(){
		sOutput = '';
		$Output.text(sOutput);
	};
	return oReturn;
})(jQuery);