
;(function($) {
	// private vars
	// character specific ordering is off by default for speed
	var sCharOrder							// equals the input oSettings.charOrder so we can test any changes
		,aAllChars = []						// all latin chars 32-255
		,aOrderChar							// similar to sAllChars but with the changed char order
		,bDoubles							// boolean indicating double-non-latin chars, ie: lj, dž, Aa, ch, ss etc...
		,iReplace = 0x2500					// doubles are replaced with Unicode char starting at 0x2500
		,oReplace = {}						// replacement object
		,rxNotLatin							// regular expression to test for non-latin chars

		,frCrCd = String.fromCharCode		// minify placeholder
		,mathmn = Math.min					// minify placeholder
		,nll = null							// minify placeholder

		,oSettings
		,iAsc
	;
	// create basic latin string chars 32-255
	for (var i=32,s=frCrCd(i),len=255;i<len;i++,s=frCrCd(i).toLowerCase()) { // using lowerCase instead of upperCase so _ will sort before
		if (aAllChars.indexOf(s)===-1) aAllChars.push(s);
//		console.log(s,aAllChars.indexOf(s)); // log
	}
	aAllChars.sort();
//	console.log('aAllChars',aAllChars); // log

	$.tinysort.defaults.charOrder = sCharOrder;

//	$.fn.extend({});
	$.tinysort.prepare.push(function(settings){
		console.log('charoder prepare',settings); // log
		oSettings = settings;
		iAsc = oSettings.order=='asc'?1:-1;
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

	});
	$.tinysort.sort.push(function(bNumeric,sA,sB,iReturn){
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
		console.log('charorder',sA,sB,iReturn,aOrderChar,aAllChars); // log
		return iReturn;
	});
})(jQuery);
