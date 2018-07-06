initTinySort()
initTableOfContents()
initPreCode()
initMenuEvents()

function initTinySort(){
  Promise.all(['tinysort','tinysort.charorder','jquery.tinysort']
      .map(name=>`./dist/${name}.js`)
      .map(fetchAsText))
      .then(([tinysort,charorder,jquery])=>{
        setVersion(tinysort.match(/\d+\.\d+\.\d+/).pop())
        console.log('version',version) // todo: remove log
      })
}

/**
 * Fetch a resource as text
 * @param {string} s
 * @returns {Promise<string>}
 */
function fetchAsText(s){
  return fetch('./dist/tinysort.js')
      .then(response=>response.text())
}

/**
 * Set the version number to DOM elements
 * @param version
 */
function setVersion(version){
  document.title += ` v${version}`
  document.querySelector('h1').textContent += ` v${version}`
}

/**
 * Initialise table of contents
 */
function initTableOfContents(){
  let fragment = document.createDocumentFragment()
  const list = [fragment]
    ,navbar = document.querySelector('nav.navbar')
    ,navbarHeight = navbar.offsetHeight
  let headerNrLast
  Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).forEach(elm=>{
    let li
      ,headerNr = parseInt(elm.nodeName.match(/\d+/).pop(),10)
      ,wasH1 = false
    const ignore = headerNr===1
      ,text = elm.textContent
      ,slug = toSlug(text)
    if (headerNr===2) headerNr = 1
    //
    const anchor = createElement('div',null,null,{id:slug,style:'position:relative;top:-'+navbarHeight+'px'})
    elm.parentNode.insertBefore(anchor,elm)
    //
    if (headerNrLast!==undefined) {
      if (headerNr>headerNrLast) {
        const liLast = fragment.lastChild
        wasH1 = headerNrLast===1
        if (wasH1) {
          liLast.classList.add('dropdown')
          const anchorLast = liLast.querySelector('a')
          anchorLast.classList.add('dropdown-toggle')
          anchorLast.setAttribute('data-toggle','dropdown')
          createElement('b','caret',anchorLast)
          anchorLast.removeAttribute('href') // otherwise dropdown doesn't work
        }
        fragment = createElement('ul',wasH1?'dropdown-menu':null,liLast,{role:'menu'})
        list.push(fragment)
      } else if (headerNr<headerNrLast) {
        list.pop()
        fragment = list[list.length-1]
      }
    }
    headerNrLast = headerNr
    li = createElement('li',null,fragment)
    !ignore&&createElement('a',null,li,{href:'#'+slug},text)
  })
  const navbarNav = document.querySelector('.nav.navbar-nav')
  while (navbarNav.firstChild) navbarNav.removeChild(navbarNav.firstChild)
  navbarNav.appendChild(list[0])
}

/**
 * Add proper data-language to code elements
 */
function initPreCode(){
  Array.from(document.querySelectorAll('pre code.language-javascript')).forEach(code=>code.setAttribute('data-language','javascript'))
}

/**
 * Init events
 */
function initMenuEvents(){
  Array.from(document.querySelectorAll('.dropdown .dropdown-toggle')).forEach(elm=>{
    elm.addEventListener('click',e=>{
      const {target} = e
      const isOpen = target.getAttribute('aria-expanded')==='true'
      target.setAttribute('aria-expanded',!isOpen)
      target.parentNode.classList.toggle('open',!isOpen)
    })
  })
}

/**
 * Turn a title into a slug
 * @param {String} s A string
 * @returns {string}
 */
function toSlug(s) {
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
 * @name createElement
 * @param {String} [type='div'] The element type
 * @param {String|Array} classes An optional string or list of classes to be added
 * @param {HTMLElement} parent An optional parent to add the element to
 * @param {Object} attributes An optional click event handler
 * @param {String} text An optional click event handler
 * @param {Function} click An optional click event handler
 * @returns {HTMLElement} Returns the newly created element
 */
function createElement(type,classes,parent,attributes,text,click) {
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