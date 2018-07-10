/* global QUnit, zenLi, eachElement */
import tinysort from '../src/tinysort'

const {module,test,ok,/*assert,async*/} = QUnit
  ,aList = ['eek-','oif-','myr-','aar-','oac-','eax-']
  ,sJoin = aList.slice(0).sort().join('')

module('es6 import')

test('es6 import',()=>{
  ok( (()=>{
    const aSorted = tinysort(zenLi('ul>li{a$}*6',{a:aList}))
      ,sSorted = eachElement(aSorted,elm=>elm.textContent)
    return sSorted===sJoin
  })(),'tinysort(nodeList);')
})