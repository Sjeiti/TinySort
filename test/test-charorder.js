/* global QUnit, zenLi, eachElement, tinysort */

import {loadScript} from '../doc/js/util'

const {module,test,ok,/*assert,*/async} = QUnit
  ,aLangSR = ['džep','luđak','čovjek','gospodin','muškarac','ljubav','coga','zec','čega','liljana','godina','nož','njuška']
  ,aLangDA = ['Åben','Æble','Åse','København','Aarhus','Øresund']
  ,aLangFR = ['Ésdf','ésdf','zsdf','Zsdf','Asdf','asdf']

module('charorder plugin')
test('non latin characters plugin', function() {
  ok((()=>{
    const aSorted = tinysort(zenLi('ul>li{a$}*'+aLangSR.length,{a:aLangSR}),{charOrder:'cčćd{dž}đl{lj}n{nj}sšzž'})
      ,sSorted = eachElement(aSorted,elm=>' '+elm.textContent)
    return sSorted==' coga čega čovjek džep godina gospodin liljana luđak ljubav muškarac nož njuška zec'
  })(),'tinysort(nodeList,{charOrder:\'cčćd{dž}đl{lj}n{nj}sšzž\'}); // Serbo-Croatian')
  ok((()=>{
    const aSorted = tinysort(zenLi('ul>li{a$}*'+aLangDA.length,{a:aLangDA}),{charOrder:'æøå[{Aa}]'})
      ,sSorted = eachElement(aSorted,elm=>' '+elm.textContent)
    return sSorted==' København Æble Øresund Åben Aarhus Åse'
  })(),'tinysort(nodeList,{charOrder:\'æøå[{Aa}]\'}); // Danisch')

  ok((()=>{
    const aSorted = tinysort(zenLi('ul>li{a$}*'+aLangFR.length,{a:aLangFR}),{charOrder:'a[àâ]c[ç]e[éèêë]i[ïî]o[ôœ]u[ûù]'})
      ,sSorted = eachElement(aSorted,elm=>' '+elm.textContent)
    return sSorted===' Asdf asdf Ésdf ésdf zsdf Zsdf'
  })(),'tst')

  //console.log('',eachElement(zenLi('ul>li{a$}*'+aLangDA.length,{a:aLangDA}),function(elm){ return ' '+elm.textContent; })); // log
  /*ok((()=>{
    const aSorted = tinysort(zenLi('ul>li{a$}*'+aLangDA.length,{a:aLangDA}),{charOrder:'æøå[{Aa}]'})
      ,sSorted = eachElement(aSorted,function(elm){ return ' '+elm.textContent; });
    return sSorted==' København Æble Øresund Åben Aarhus Åse';
  })(),'tinysort(nodeList,{charOrder:\'a[àâ]c[ç]e[éèêë]i[ïî]o[ôœ]u[ûù]\'}); // French');*/
})

// test('charorder AMD', ()=>{
//   const done = async()
//   /*global requirejs, require*/
//   loadScript('https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.15/require.min.js')
//       .then(()=>{
//         console.log('requirejs',!!requirejs,!!require) // todo: remove log
//         require.config({baseUrl: 'dist'})
//         requirejs(['tinysort','tinysort.charorder'],sort=>{
//           ok(!!sort.defaults.hasOwnProperty('charOrder'),'test AMD functionality with RequireJS')
//           done()
//         })
//       })
// })