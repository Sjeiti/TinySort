/*globals QUnit*/
import {zen,loadScript} from '../doc/js/util'
import './test-api'
import './test-regression'
import './test-charorder'
import './test-jquerywrapper'
import './test-import'

QUnit.config.hidepassed = true
QUnit.config.autostart = false

// global test methods
Object.assign(window,{
  zenLi: function(){return zen.apply(zen,arguments).querySelectorAll('li')}
  ,eachElement: (nodeList,fn)=>{
    if (fn===undefined) fn = elm=>elm.textContent
    return nodeList.map(fn).join('')
  }
  ,zen
})

// load scripts (not import because load should work as well)
Promise.all([
  'dist/tinysort.js'
	,'dist/tinysort.charorder.js'
].map(loadScript)).then(QUnit.start.bind(QUnit))
