import { expand } from '@emmetio/expand-abbreviation'

const zen = s=>stringToElement(expand(s))

initFirstPararaph()
initTinySort()
initTableOfContents()
initMenuEvents()
initPreCode()

function initTinySort(){
  const fileNames = ['tinysort','tinysort.charorder','jquery.tinysort']
      .map(name=>[`${name}.js`,`${name}.min.js`])
      .reduce((acc,arr)=>(acc.push(...arr),acc),[])
  const fileLocations = fileNames
      .map(file=>`./dist/${file}`)
  Promise.all(fileLocations.map(fetchAsText))
      .then((files)=>{
        setVersion(files[0].match(/\d+\.\d+\.\d+/).pop())
        setDownloads(fileNames,files)
        setCDN(fileNames.slice(0,4))
      })
}

function initFirstPararaph(){
  const firstP = document.querySelector('.firstparagraph')
  const firstPLeftCol = firstP.querySelector('.col-sm-9')
  const main = document.getElementById('main')
  const firstH2 = main.querySelector('h2')
  const mainChildren = Array.from(main.children)
  mainChildren.slice(0,mainChildren.indexOf(firstH2)).forEach(elm=>firstPLeftCol.appendChild(elm))
}

function setCDN(fileNames){
  fetch('http://api.cdnjs.com/libraries?search=tinysort')
      .then(response=>response.json())
      .then(data=>{
        const {latest} = data.results[0]
        const latestVersion = latest.match(/\d+\.\d+\.\d+/).pop()
        const wrapCDN = document.querySelector('.wrap.wrap-cdn')
        Array.from(wrapCDN.querySelectorAll('input')).forEach(input=>wrapCDN.removeChild(input))
        wrapCDN.appendChild(getFragment(fileNames.map(fileName=>`<input value="https://cdnjs.cloudflare.com/ajax/libs/tinysort/${latestVersion}/${fileName}" class="btn btn-sm btn-cdn">`).join('')))
      })
}

function setDownloads(fileNames,files){
  document.querySelector('.wrap.wrap-download').innerHTML = fileNames
      .map((fileName,i)=>`<a download="${fileName}" href="dist/${fileName}" class="btn btn-sm btn-download filesize" data-filesize="${formatSize(files[i].length)}">${fileName}</a>`).join('')
}

/**
 * Fetch a resource as text
 * @param {string} file
 * @returns {Promise<string>}
 */
function fetchAsText(file){
  return fetch(file).then(response=>response.text())
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
          if (anchorLast) {
            anchorLast.classList.add('dropdown-toggle')
            anchorLast.setAttribute('data-toggle','dropdown')
            createElement('b','caret',anchorLast)
            anchorLast.removeAttribute('href') // otherwise dropdown doesn't work
          }
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
  Array.from(document.querySelectorAll('pre code.language-javascript')).forEach(code=>{
    const pre = code.parentNode
    const exampleCode = code.textContent
    const matchCall = exampleCode.match(/(tinysort\(')([^']*)/)
    const sSelector = matchCall&&matchCall.pop()
    //
    code.setAttribute('data-language','javascript')
    //
    if (sSelector) {
      const div = zen('div>(menu[type=toolbar]>button.sort{sort}+{ or }+button.reset{reset})+div.example')
        ,preParent = pre.parentNode
        ,preNext = pre.nextSibling
        ,fnReset = reset.bind(null,div.querySelector('.example'),sSelector)
      div.querySelector('.sort').addEventListener('click',doSort.bind(null,exampleCode))
      div.querySelector('.reset').addEventListener('click',fnReset)
      fnReset()
      //
      if (preNext) preParent.insertBefore(div,preNext)
      else preParent.appendChild(div)
    }
  })
  // table example
  initTableSort()
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

/**
 * Set the innerHTML of a cached div
 * Helper method for getFragment and stringToElement
 * @param {string} str
 * @returns {HTMLElement}
 */
function wrapHTMLString(str) {
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

//##############################################################################
//##############################################################################

function doSort(code) {
  console.log('doSort',code) // todo: remove log
  /*jshint evil:true*/
  eval(code)
  /*jshint evil:false*/
}

function reset(parent,selector) {
  console.log('reset',parent,selector) // todo: remove log
  const matchId = selector.match(/#(\w+)/)
  const matchedId = matchId && matchId.pop()
  console.log('\tmatchedId',matchedId) // todo: remove log
  let oParse = {}
  const iLen = 8
  const l = getList.bind(null,iLen)
  let mExample
  if (matchedId==='xattr' || matchedId==='xret') {
    selector += '*' + iLen + '>span.a${b$}'
    oParse = {a: 't',b: 's'}
  } else if (matchedId==='xsub') {
    selector += '*' + iLen + '>span{a$ }+span{b$}'
    oParse = {a: 's',b: 's'}
  } else if (matchedId==='xval') {
    selector += '*' + iLen + '>span{a$}+{ }+a[href=#b$ title=c$]{d$}'
    oParse = {a: 's',b: 's',c: 's',d: 's'}
  } else if (matchedId==='xdta') {
    selector += '*' + iLen + '>span{a$}+a[href=# data-foo=b$]{c$}'
    oParse = {a: 's',b: 's',c: 's'}
  } else if (matchedId==='xnat') {
    selector += '{a$}*' + iLen
    oParse = {a: 'sf'}
  } else if (matchedId==='xinp') {
    selector += '*' + iLen + '>input[value=a$]'
    oParse = {a: 's'}
  } else if (matchedId==='xany') {
    selector = 'div#' + matchedId + '>span{a$ }*' + iLen
    oParse = {a: 's'}
  } else if (matchedId==='ximg') {
    selector = 'div#' + matchedId + '>img[src=style/logo.svg width=30 title=a$]*' + iLen
    oParse = {a: 's'}
  } else if (matchedId==='xnum') {
    selector += '{a$}*' + iLen
    oParse = {a: 'n'}
  } else if (matchedId==='xmix') {
    selector += '{a$}*' + iLen
    oParse = {a: l('si',4)}
  } else if (matchedId==='xmul') {
    selector += '*' + iLen + '>span.name{a$}+span.date[data-timestamp=b$]{b$}'
    oParse = {a: l('s ',4),b: 'i'}
  } else if (['greek','serb','danish'].indexOf(matchedId)!== -1) {
    var aLang = {
      greek: 'άλογο,ανδρας,δάσκαλος,δεντρο,δήμητρα,κάτω,λύθηκε,λύξη,μπροστά,πλένω,πλυντήριο',
      serb: 'άλογο,ανδρας,δάσκαλος,δεντρο,δήμητρα,κάτω,λύθηκε,λύξη,μπροστά,πλένω,πλυντήριο',
      danish: 'København,Æble,Øresund,Åben,Aarhus,Åse,druenzin,evisk,håndkommertepokker,imagen,mærk,vestegnendenne,vidste,væmme'
    }[matchedId].split(',').sort(function () {
      return Math.random()<0.5?1:-1
    })
    aLang.length = iLen
    selector += '{a$}*' + iLen
    oParse = {a: aLang}
  } else {
    selector += '{a$}*' + iLen
    oParse = {a: 's'}
  }
  for (var s in oParse) {
    var sVal = oParse[s]
    if (typeof sVal==='string') oParse[s] = l(sVal)
  }
  mExample = zen(selector,oParse)
  if (matchedId==='ximg') {
    Array.from(mExample.querySelectorAll('img')).forEach(img=>img.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16))
  }
  while (parent.firstChild) parent.removeChild(parent.firstChild)
  parent.appendChild(mExample)
}

function getList(len,type,max) {
  var iNum = 1E3,iLen = len || 8,a = []
  for (var i = 0; i<iLen; i++) {
    var aType = type.split('')
    aType.forEach(function (s,n) {
      if (s==='s') {
        var aLorem = 'a et at in mi ac id eu ut non dis cum sem dui nam sed est nec sit mus vel leo urna duis quam cras nibh enim quis arcu orci diam nisi nisl nunc elit odio amet eget ante erat eros ipsum morbi nulla neque vitae purus felis justo massa donec metus risus curae dolor etiam fusce lorem augue magna proin mauris nullam rutrum mattis libero tellus cursus lectus varius auctor sociis ornare magnis turpis tortor semper dictum primis ligula mollis luctus congue montes vivamus aliquam integer quisque feugiat viverra sodales gravida laoreet pretium natoque iaculis euismod posuere blandit egestas dapibus cubilia pulvinar bibendum faucibus lobortis ultrices interdum maecenas accumsan vehicula nascetur molestie sagittis eleifend facilisi suscipit volutpat venenatis fringilla elementum tristique penatibus porttitor imperdiet curabitur malesuada vulputate ultricies convallis ridiculus tincidunt fermentum dignissim facilisis phasellus consequat adipiscing parturient vestibulum condimentum ullamcorper scelerisque suspendisse consectetur pellentesque'.split(' ')
        if (max) aLorem.length = max
        aLorem.sort(function () {
          return brnd()?1:-1
        })
        aType[n] = aLorem.pop()
      } else if (s==='n') {
        var fRnd = Math.random() * iNum
        aType[n] = brnd()?roundDec(fRnd):fRnd << 0
      } else if (s==='i') {
        aType[n] = roundDec(Math.random() * iNum)
      } else if (s==='f') {
        aType[n] = 0.01 * (Math.random() * iNum * 100 << 0)
      } else if (s==='t') {
        aType[n] = brnd()?'':'striked'
      }
    })
    a.push(aType.join(''))
  }
  return a
}

function brnd() {
  return Math.random()<0.5
}

function roundDec(f) {
  return Math.round((f + 0.00001) * 100) / 100
}

function initTableSort() {
  var mTable = document.getElementById('xtable'),mTHead = mTable.querySelector('thead'),
    amTh = mTHead.querySelectorAll('th'),mTBody = mTable.querySelector('tbody'),
    mPre;mTHead.addEventListener('click',handleTheadClick.bind(null,amTh,mTBody))
  mTBody.addEventListener('click',handleTbodyClick)
  for (var i = 0; i<5; i++) addTableRow(amTh,mTBody)
  //
  mPre = mTable.parentNode
  while (mPre.nodeName!=='PRE') mPre = mPre.previousSibling
  /*jshint evil:true*/
  eval(mPre.textContent)
  /*jshint evil:false*/

}

function handleTheadClick(amth,body,e) {
  if (e.target.textContent==='add row') addTableRow(amth,body)
}

function handleTbodyClick(e) {
  var mTr = e.target
  if (mTr.nodeName==='COMMAND') {
    while (mTr.nodeName!=='TR') mTr = mTr.parentNode
    mTr.parentNode.removeChild(mTr)
  }
}

function addTableRow(amth,body) {
  var mTr = document.createElement('tr')
  for (var i = 0,l = amth.length; i<l; i++) {
    var sTh = amth[i].textContent,mTd = document.createElement('td'),
      sType = {word: 's',int: 'i',float: 'f',mixed: 'si'}[sTh]
    if (sTh==='add row') {
      var mCommand = document.createElement('command')
      mCommand.textContent = 'x'
      mTd.appendChild(mCommand)
    } else {
      mTd.textContent = getList(1,sType).pop()
    }
    mTr.appendChild(mTd)
  }
  body.appendChild(mTr)
}