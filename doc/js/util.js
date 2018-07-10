import { expand } from '@emmetio/expand-abbreviation'

/**
 * Turn a title into a slug
 * @param {String} s A string
 * @returns {string}
 */
export function toSlug(s) {
  let str = s.toLowerCase()
    ,replace = {
      a: /[àáäâ]/g,
      e: /[èéëê]/g,
      i: /[ìíïî]/g,
      o: /[òóöô]/g,
      u: /[ùúüû]/g,
      n: /[ñ]/g,
      c: /[ç]/g,
      '-': /[^a-z0-9]|-+/g,
      '': /^-+|-+$/g
    }
  for (let replacement in replace) {
    str = str.replace(replace[replacement],replacement)
  }
  return str
}

/**
 * Small utility method for quickly creating elements.
 * @param {String} [type='div'] The element type
 * @param {String|Array} classes An optional string or list of classes to be added
 * @param {HTMLElement} parent An optional parent to add the element to
 * @param {Object} attributes An optional click event handler
 * @param {String} text An optional click event handler
 * @param {Function} click An optional click event handler
 * @returns {HTMLElement} Returns the newly created element
 */
export function createElement(type,classes,parent,attributes,text,click) {
  const mElement = document.createElement(type || 'div')
  if (attributes) for (let attr in attributes) mElement.setAttribute(attr,attributes[attr])
  if (classes) {
    const oClassList = mElement.classList,aArguments = typeof(classes)==='string'?classes.split(' '):classes
    oClassList.add.apply(oClassList,aArguments)
  }
  if (text) mElement.textContent = text
  click && mElement.addEventListener('click',click)
  parent && parent.appendChild(mElement)
  return mElement
}

/**
 * Set the innerHTML of a cached div
 * Helper method for getFragment and stringToElement
 * @param {string} str
 * @returns {HTMLElement}
 */
export function wrapHTMLString(str) {
  const div = document.createElement('div')
  div.innerHTML = str
  return div
}

/**
 * Get documentFragment from an HTML string
 * @param {string} str
 * @returns {DocumentFragment}
 */
export function getFragment(str) {
  const fragment = document.createDocumentFragment()
  Array.from(wrapHTMLString(str).childNodes).forEach(elm => fragment.appendChild(elm))
  return fragment
}

/**
 * Turn an HTML string into an element
 * @param {string} str
 * @returns {HTMLElement}
 */
export function stringToElement(str) {
  return wrapHTMLString(str.replace(/^\s*|\s*$/g, '')).childNodes[0]
}

/**
 * Formats a number to the appropriate filesize notation
 * @param {number} number The number to format
 * @param {number} round The number of decimals to round by
 * @returns {string} Filesize string result
 * @todo extend to generic formatter
 */
export function formatSize(number,round) {
  let i, size = number
  if (round===undefined) round = 0
  const aSizes = ['B','kB','MB','GB','TB','PB','EB','ZB','YB']
  for (i = 0; size>1024 && (aSizes.length>=(i + 2)); i++) size /= 1024
  const iMult = Math.pow(10,round)
  return (Math.round(size * iMult) / iMult) + aSizes[i]
}

/**
 * A simple function to use Emmet in a web environment
 * @property {Boolean} [firstChild=false] When set to true the result to the zen function is an HTMLElement when the length of the NodeList is one. Default is false.
 * @param {string} abbreviation The Emmet abbreviation to expand.
 * @param {Object} [content] An optional content object to replace strings from the result.
 * @returns {Array} The Emmet result in an Array.
 * @commnet const zen = s=>stringToElement(expand(s))
 */
export function zen(abbreviation,content) {
  let i
  let htmlString = expand(abbreviation)
  if (content!==undefined) {
    for (let key in content) {
      const value = content[key]
      if (value instanceof Array) {
        for (i = value.length; i>=0; i--) {
          htmlString = htmlString.replace(new RegExp(key + (i + 1),'g'),value[i])
        }
      } else {
        htmlString = htmlString.replace(new RegExp(key,'g'),value)
      }
    }
  }
  return stringToElement(htmlString)
}

/**
 * Remove al element children
 * @param {HTMLElement} elm
 * @returns {HTMLElement}
 */
export function clearElement(elm){
  while (elm.firstChild) elm.removeChild(elm.firstChild)
  return elm
}

/**
 * Load a Javascript file
 * @param {string} src
 * @returns {Promise<any>}
 */
export function loadScript(src) {
  return new Promise((resolve,reject)=>{
    const script = document.createElement('script')
    script.src = src
    script.addEventListener('load',resolve)
    script.addEventListener('error',reject)
    document.body.appendChild(script)
  })
}