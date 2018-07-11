/*global require, process*/
/**
 * node task/serve dist 8383
 */

const marked = require('marked')
const utils = require('./util/utils.js')
const {read,save} = utils
const target = process.argv[2]||'distdoc'
// const port = process.argv[3]||8183
const pathJs = 'src/tinysort.js'
const pathReadme = 'README.md'
const template = 'doc/index.html'
const targetDoc = `${target}/index.html`

Promise.all([
  read(template)
  ,read(pathReadme)
	,read(pathJs).then(contents => require('jsdoc-api').explain({ source: contents }))
])
.then(([template,readme,jsdoc])=>{
  // adjust readme
  const options = jsdoc.filter(elm=>elm.kind==='typedef'&&elm.name==='options').pop()
  const markdownList = options.properties.map(prop=>`**options.${prop.name}** (${prop.type.names.pop()}=${prop.defaultvalue})
${prop.description}

`).join('')
  const readmeAdjusted = readme.replace(/(###\soptions[^*]*)([\s\S]*)(##\sexamples)/gm,`$1${markdownList}
$3`)
  save(pathReadme,readmeAdjusted)
  //
  // save html
  save(targetDoc,template.replace(/<!--body-->/,marked(readmeAdjusted)))
})