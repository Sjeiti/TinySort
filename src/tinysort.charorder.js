/*global define, module*/
/**
 * TinySort CharOrder: a TinySort plugin to sort non-latin characters.
 * @summary TinySort CharOrder
 * @version 3.2.7
 * @requires tinysort
 * @license MIT/GPL
 * @author Ron Valstar (http://www.ronvalstar.nl/)
 * @copyright Ron Valstar <ron@ronvalstar.nl>
 * @namespace tinysort.charorder
 */
(function (root,factory) {
  typeof define==='function'&&define.amd?define(['tinysort'],factory):factory(root.tinysort)
}(window||module||{},tinysort=>{
  const fromCharCode = String.fromCharCode // minify placeholder
		,mathmn = Math.min // minify placeholder
		,nll = null // minify placeholder
		,fnIndexOf = Array.prototype.indexOf// minify placeholder
		,plugin = tinysort.plugin
		,loop = plugin.loop
		,allCharsList = Array.from(new Array(287),(o,i)=>fromCharCode(i+32).toLowerCase()).filter((o,i,a)=>a.indexOf(o)===i) // all latin chars 32-255
		,regexNonLatin = /[^a-zA-Z]/g
		//
  let charOrder // equals the input settings.charOrder so we can test any changes
		,orderedCharlist // similar to allCharsList but with the changed char order
		,replacementIndex = 0x2500 // doubles are replaced with Unicode char starting at 0x2500
		,replacements = {} // replacement object // todo: reset?

	// add to namespace
  tinysort.defaults.charOrder = charOrder // sets to undefined
  plugin(prepare,sort)

	/**
	 * Prepares the criterium within the tinysort sort function
	 * @memberof tinysort.charorder
	 * @private
	 * @param {criterium} criterium
	 */
  function prepare(criterium){
		// check charOrder (non latin chars)
		// charOrder only to check whether other vars are set
		// variables used on sort
		//		- criterium.charOrder to test
		//		- replacements
		//		- orderedCharlist to order doubles
		//
    if (criterium.charOrder!==charOrder) {
      charOrder = criterium.charOrder
      replacementIndex = 0x2500
      replacements = {}
      orderedCharlist = nll
      if (charOrder) {
        orderedCharlist = allCharsList.slice(0) // first set to entire 32-255 charlist
				// then loop through the charOrder rule
        for (let charListNotLatin = []
					,addReplacement = (nonLatin,replacement)=>charListNotLatin.push(replacement)&&(replacements[criterium.cases?nonLatin:nonLatin.toLowerCase()] = replacement)
					,lastLatinChar = 'z' // if oSettings.charOrder has no [a-z] characters are appended to z
					,l = charOrder.length
					,j,m // init
          ,i=0;i<l;i++
        ) { // loop through chars to set 'sOrderChar'
          const char = charOrder[i]
						,charCode = char.charCodeAt()
						,charIsLatin = charCode>96&&charCode<123 // 'a'.charCodeAt()===97 'z'.charCodeAt()===122
          if (!charIsLatin){
            if (char==='[') { // find replace chars: ë will sort similar to e
              const charsNotLatinNum = charListNotLatin.length
              const lastChar = charsNotLatinNum?charListNotLatin[charsNotLatinNum-1]:lastLatinChar
              let replaces = charOrder.substr(i+1).match(/[^\]]*/)[0]
              const doubles = replaces.match(/{[^}]*}/g) // find doubles: dž, ss, lj ...
              if (doubles) {
                for (j=0,m=doubles.length;j<m;j++) {
                  const sCode = doubles[j]
                  i += sCode.length // increment i because of .replace(...
                  replaces = replaces.replace(sCode,'')
                  addReplacement(sCode.replace(/[{}]/g,''),lastChar)
                }
              }
              for (j=0,m=replaces.length;j<m;j++) {
                addReplacement(replaces[j],lastChar)
              }
              i += replaces.length+1
            } else if (char==='{') { // find doubles: dž, ss, lj ...
              const doubleChars = charOrder.substr(i+1).match(/[^}]*/)[0]
              addReplacement(doubleChars,fromCharCode(replacementIndex++)) // replace the double with single Unicode 0x2500+
              i += doubleChars.length+1
            } else {
              charListNotLatin.push(char)
            }
          }
          if (charListNotLatin.length&&(charIsLatin||i===l-1)) {
						// first remove non latin chars
            loop(charListNotLatin,function(s){
              orderedCharlist.splice(fnIndexOf.call(orderedCharlist,s),1)
            })
						// then append chars to latin char
            const charListNotLatinCopy = charListNotLatin.slice(0)
            charListNotLatinCopy.splice(0,0,fnIndexOf.call(orderedCharlist,lastLatinChar)+1,0)
            Array.prototype.splice.apply(orderedCharlist,charListNotLatinCopy)
						//
            charListNotLatin.length = 0
          }
          if (charIsLatin) lastLatinChar = char
        }
      }
    }
		//'a[àâ]c[ç]e[éèêë]i[ïî]o[ôœ]u[ûù]'
  }

	/**
	 * The plugin sort function called from the tinysort sort function
	 * @memberof tinysort.charorder
	 * @private
	 * @param {criterium} criterium
	 * @param {Boolean} isNumeric
	 * @param {String|Number} a
	 * @param {String|Number} b
	 * @param {Number} sortReturn
	 * @returns {Number} A sorting number -1, 0 or 1
	 */
  function sort(criterium,isNumeric,a,b,sortReturn){
    if (a===b) {
      sortReturn = 0
    } else if (!isNumeric&&criterium.charOrder) {
			// replace chars (todo? first replace doubles?)
      for (const replace in replacements) {
        const replacement = replacements[replace]
        a = a.replace(replace,replacement)
        b = b.replace(replace,replacement)
      }
			// then test if either word has non latin chars
			// we're using the slower string.match because strangely regex.test sometimes fails
      if (a.match(regexNonLatin)!==nll||b.match(regexNonLatin)!==nll) {
        for (let k=0,l=mathmn(a.length,b.length);k<l;k++) {
          const iAchr = fnIndexOf.call(orderedCharlist,a[k])
						,iBchr = fnIndexOf.call(orderedCharlist,b[k])
          if (sortReturn=(iAchr<iBchr?-1:(iAchr>iBchr?1:0))) break // eslint-disable-line no-cond-assign
        }
      } else {
        sortReturn = a===b?0:a>b?1:-1
      }
    }
    return sortReturn
  }
}))