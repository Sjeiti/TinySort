/* global QUnit, zenLi, $ */
import {loadScript} from '../doc/js/util'

const {module,test,ok,/*assert,*/async} = QUnit
  ,aList = ['eek-','oif-','myr-','aar-','oac-','eax-']
  ,sJoin = aList.slice(0).sort().join('')

module('jquery plugin wrapper')

test('jquery plugin wrapper',()=>{
  const done = async()
  Promise.resolve()
      .then(loadScript.bind(null,'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'))
      .then(loadScript.bind(null,'/dist/jquery.tinysort.js'))
      .then(()=>{
        ok(!!$.fn.tinysort,'$.fn.tinysort exists')
        ok(!!$.fn.tsort,'tsort alias exists')
        ok((()=>{
          const aNodeList = zenLi('ul>li{a$}*6',{a: aList})
              ,$NodeList = $(aNodeList)
          return !!$NodeList.tsort
        })(),'tsort exists on selection')
        ok((()=>{
          const aNodeList = zenLi('ul>li{a$}*6',{a: aList})
              ,$NodeList = $(aNodeList)
              ,aSorted = $NodeList.tsort()
          return Array.from(aSorted).map(elm=>elm.textContent).join('')===sJoin
        })(),'basic sort')
        done()
      })
})