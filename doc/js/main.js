import {zen,getFragment,toSlug,formatSize,createElement,clearElement} from './util'

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
  clearElement(navbarNav).appendChild(list[0])
  // while (navbarNav.firstChild) navbarNav.removeChild(navbarNav.firstChild)
  // navbarNav.querySelector('.nav.navbar-nav').appendChild(list[0])
  // document.querySelector('.nav.navbar-nav').appendChild(list[0]) // insane behavior: var reference is gone
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

//##############################################################################
//##############################################################################
//##############################################################################
//##############################################################################

/**
 * Sort the example
 * @param {string} code
 */
function doSort(code) {
  eval(code)
}

/**
 * Reset the example
 * @param {HTMLElement} parent
 * @param {string} selector
 */
function reset(parent,selector) {
  let zenSelector = selector, parseObj
  const idSelector = selector.match(/(#\w+)/).pop()
  const idName = idSelector.substr(1)
  Object.entries({
    'ul#xattr>li*8>span.a${b$}': {a: 't',b: 's'}
    ,'ul#xret>li*8>span.a${b$}': {a: 't',b: 's'}
    ,'ul#xsub>li*8>span{a$ }+span{b$}': {a: 's',b: 's'}
    ,'ul#xval>li*8>span{a$}+{ }+a[href=#b$ title=c$]{d$}': {a: 's',b: 's',c: 's',d: 's'}
    ,'ul#xdta>li*8>span{a$}+a[href=# data-foo=b$]{c$}': {a: 's',b: 's',c: 's'}
    ,'ul#xnat>li{a$}*8': {a: getList(8,'sf',4)}
    ,'ul#xinp>li*8>input[value=a$]': {a: 's'}
    ,'ul#xnum>li*8': {a: 'n'}
    ,'ul#xmix>li*8': {a: getList(8,'si',4)}
    ,'ul#xmul>li*8>span.name{a$}+span.date[data-timestamp=b$]{b$}': {a: getList(8,'s ',4), b: 'i'}
    ,'div#xany>span{a$ }*8': {a: 's'}
    ,'div#ximg>img[src=style/logo.svg width=30 title=a$]*8': {a: 's'}
  }).forEach(([key,value])=>{
    if (key.includes(idSelector)) {
      zenSelector = key
      parseObj = value
    }
  })
  if (!parseObj) {
    if (['greek','serb','danish'].includes(idName)) {
      const languageWords = {
        greek: 'άλογο,ανδρας,δάσκαλος,δεντρο,δήμητρα,κάτω,λύθηκε,λύξη,μπροστά,πλένω,πλυντήριο',
        serb: 'άλογο,ανδρας,δάσκαλος,δεντρο,δήμητρα,κάτω,λύθηκε,λύξη,μπροστά,πλένω,πλυντήριο',
        danish: 'København,Æble,Øresund,Åben,Aarhus,Åse,druenzin,evisk,håndkommertepokker,imagen,mærk,vestegnendenne,vidste,væmme'
      }[idName].split(',').sort(()=>Math.random()<0.5?1:-1)
      zenSelector += '{a$}*8'
      parseObj = {a: languageWords.slice(0,8)}
    } else {
      zenSelector += '{a$}*8'
      parseObj = {a: 's'}
    }
  }
  //
  const len = parseInt((zenSelector.match(/\*(\d+)/)||[8]).pop(),10)
  for (let s in parseObj) {
    const parseValue = parseObj[s]
    typeof parseValue==='string' && (parseObj[s] = getList(len,parseValue))
  }
  //
  const exampleElement = zen(zenSelector,parseObj)
  if (idName==='ximg') {
    Array.from(exampleElement.querySelectorAll('img')).forEach(img=>img.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16))
  }
  clearElement(parent).appendChild(exampleElement)
}

/**
 * Return a random list with types
 * @param {number} len
 * @param {string} type
 * @param {number} max
 * @returns {Array}
 */
function getList(len,type,max) {
  const result = []
  const randMax = 1E3
  for (let i = 0, l=len||8; i<l; i++) {
    const types = type.split('')
    types.forEach(function (s,n) {
      if (s==='s') {
        const lorem = 'a et at in mi ac id eu ut non dis cum sem dui nam sed est nec sit mus vel leo urna duis quam cras nibh enim quis arcu orci diam nisi nisl nunc elit odio amet eget ante erat eros ipsum morbi nulla neque vitae purus felis justo massa donec metus risus curae dolor etiam fusce lorem augue magna proin mauris nullam rutrum mattis libero tellus cursus lectus varius auctor sociis ornare magnis turpis tortor semper dictum primis ligula mollis luctus congue montes vivamus aliquam integer quisque feugiat viverra sodales gravida laoreet pretium natoque iaculis euismod posuere blandit egestas dapibus cubilia pulvinar bibendum faucibus lobortis ultrices interdum maecenas accumsan vehicula nascetur molestie sagittis eleifend facilisi suscipit volutpat venenatis fringilla elementum tristique penatibus porttitor imperdiet curabitur malesuada vulputate ultricies convallis ridiculus tincidunt fermentum dignissim facilisis phasellus consequat adipiscing parturient vestibulum condimentum ullamcorper scelerisque suspendisse consectetur pellentesque'.split(' ')
        if (max) lorem.length = max
        lorem.sort(()=>Math.random()<0.5?1:-1)
        types[n] = lorem.pop()
      } else if (s==='n') {
        const fRnd = Math.random() * randMax
        types[n] = brnd()?roundDec(fRnd):fRnd << 0
      } else if (s==='i') {
        types[n] = roundDec(Math.random() * randMax)
      } else if (s==='f') {
        types[n] = 0.01 * (Math.random() * randMax * 100 << 0)
      } else if (s==='t') {
        types[n] = brnd()?'':'striked'
      }
    })
    result.push(types.join(''))
  }
  return result
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