#TinySort

TinySort is a small and simple jQuery plugin that will sort any nodetype by it's text- or attribute value, or by that of one of it's children.
The examples below should help getting you on your way.

For those interested: there is a [unit/regression test here](test/unit).

If you find a bug, have a feature request or a code improvement you can [file them here](https://github.com/Sjeiti/TinySort/issues). Please [provide code examples](http://jsfiddle.net/) where applicable.</small>

##Download

###TinySort

source
minified
gzipped
full

#CharOrder plugin

source
minified
gzipped
full

## usage

The first (and only required) argument is a nodeList:

``` javascript
tinysort(nodeList);
```

The other arguments can be a query selector string...

``` javascript
tinysort(nodeList,'span.surname');
```

an options object...

``` javascript
tinysort(nodeList,{place:'end'});
```

both...

``` javascript
tinysort(nodeList,'img',{order:'desc',attr:'alt'});
```
or more if you want multiple sort criteria...

``` javascript
tinysort(nodeList,'span.surname',{order:'desc'},'span.name',{order:'desc'});</pre>
```
Change default settings globally like so:

``` javascript
tinysort.defaults.order = 'desc';
tinysort.defaults.attr = 'title';
```

TinySort has a number of settings:



## examples

### default sorting

The default sort is done by simply calling the 'tsort' function onto your selection.

``` javascript
tinysort(document.querySelectorAll('ul#xdflt>li'));
```

### sort on any node

TinySort works on any nodeType. The following is a div with spans.

``` javascript
tinysort(document.querySelectorAll('div#xany>span'),'',{order:'desc'});
```

### sorted numbers

TinySort also works on numbers.

``` javascript
tinysort(document.querySelectorAll('ul#xnum>li'));
```

### mixed literal and numeral

In a normal sort the order would be a1,a11,a2 while you'd really want it to be a1,a2,a11. TinySort corrects this:

``` javascript
tinysort(document.querySelectorAll('ul#xmix>li'));
```

### sorted by attribute value

Sort by attribute value by parsing the additional parameter 'attr=attributeName'. This will sort by attribute of, either the jquery selection, or of the sub-selection (if provided). In this case sort is by href on the anchor sub-selection.

``` javascript
tinysort(document.querySelectorAll('ul#xval>li'),'a',{attr:'href'});
```
Another example: images sorted by attribute title value.

``` javascript
tinysort(document.querySelectorAll('span#ximg>img'),{attr:'title'});
```

### sorted by sub-selection

You can provide an additional subselection by parsing a jquery sub-selection string into the tsort function. The returned array will be in the newly sorted order.

In this example the list elements are sorted to the text of the second span.

``` javascript
tinysort(document.querySelectorAll('ul#xsub>li'),'span:eq(1)');
```
The following example will only sort the non-striked elements.

``` javascript
tinysort(document.querySelectorAll('ul#xattr>li'),'span:not([class=striked])');
```

### return only sorted elements

By default, all the elements are returned, even the ones excluded by your sub-selection. By parsing the additional parameter 'returns=true' only the sorted elements are returned.
You can also adjust the placement of the sorted values by adding the 'place' attribute. In this case the original positions are maintained.

``` javascript
tinysort(document.querySelectorAll('ul#xret>li'),'span[class!=striked]',{returns:true,place:'org'}).css({color:'red'});
```

### multiple sort criteria

Sometimes multiple sorting criteria are required. For instance: you might want to sort a list of people first by surname then by name.

For multiple sorting rules you can just append the parameters. So tsort(selector,object) becomes tsort(selector1,object1,selector2,object2,selector3,object3...). You can also leave out either the selector or the object if it's not needed: tsort(selector1,selector2,object2,object3...). Keep in mind that tsort will look for selector-object pairs and if no applicable pair is formed it will use default values. In this example three arguments are two criteria: the first argument uses the default options object, the second argument uses the third argument as options object.

``` javascript
tinysort(document.querySelectorAll('ul#xmul>li'),'span.name','span.date',{data:'timestamp'});
```

### non-latin characters

A normal array sorts according to [Unicode](http://en.wikipedia.org/wiki/Unicode), which is wrong for most languages. For correct ordering you can use the charorder plugin to parse a rule with the 'charOrder' parameter. This is a string that consist of exceptions, not the entire alfabet. For characters that should sort equally use brackets. For characters that consist of multiple characters use curly braces. For example:

*   **cčć** sorts c č and ć in that order

*   **æøå** in absence of a latin character æ ø and å are sorted after z

*   **ι[ίϊΐ]** ί ϊ and ΐ are sorted equally to ι

*   **d{dž}** dž is sorted as one character after d

*   **å[{Aa}]** Aa is sorted as one character, equal to å, after z

Here some real examples:

``` javascript
tinysort(document.querySelectorAll('ul#greek>li'),{charOrder:'α[ά]βγδε[έ]ζη[ή]θι[ίϊΐ]κλμνξο[ό]πρστυ[ύϋΰ]φχψω[ώ]'});
tinysort(document.querySelectorAll('ul#danish>li'),{charOrder:'æøå[{Aa}]'});
tinysort(document.querySelectorAll('ul#serb>li'),{charOrder:'cčćd{dž}đl{lj}n{nj}sšzž'});
```

Here are some example languages:

<table class="props">
    <thead><tr>
        <th>Language</th>
        <th>charOrder</th>
    </tr></thead>
    <tfoot><tr>
        <td colspan="2">since only one of these is my native language please feel free to contact me if you think corrections are in order</td>
    </tr></tfoot>
    <tbody>
        <tr><td>Cyrilic</td><td>абвгдђежзијклљмнњопрстћуфхцчџш</td></tr>
        <tr><td>Czech</td><td>a[á]cčd[ď]e[éě]h{ch}i[í]n[ň]o[ó]rřsšt[ť]u[úů]y[ý]zž</td></tr>
        <tr><td>Danish and Norwegian</td><td>æøå[{Aa}]</td></tr>
        <tr><td>Dutch</td><td>a[áàâä]c[ç]e[éèêë]i[íìîï]o[óòôö]u[úùûü]</td></tr>
        <tr><td>French</td><td>a[àâ]c[ç]e[éèêë]i[ïî]o[ôœ]u[ûù]</td></tr>
        <tr><td>German</td><td>a[ä]o[ö]s{ss}u[ü]</td></tr>
        <tr><td>Greek</td><td>α[ά]βγδε[έ]ζη[ή]θι[ίϊΐ]κλμνξο[ό]πρστυ[ύϋΰ]φχψω[ώ]</td></tr>
        <tr><td>Icelandic</td><td>a[á]dðe[é]i[í]o[ó]u[ú]y[ý]zþæö</td></tr>
        <tr><td>Polish</td><td>aąbcćeęlłnńoósśuúzźż</td></tr>
        <tr><td>Serbo-Croatian</td><td>cčćd{dž}đl{lj}n{nj}sšzž</td></tr>
        <tr><td>Spanish</td><td>a[á]c{ch}e[é]i[í]l{ll}nño[ó]u[ú]y[ý]</td></tr>
        <tr><td>Swedish</td><td>åäö</td></tr>
    </tbody>
</table>

### sort [$.val()](http://api.jquery.com/val/)

The .val() method is primarily used to get the values of form elements. By parsing the useVal attribute you can also sort by this form element value. Everything is in the first line, I added some extra code to show the values it sorts on.

``` javascript
tinysort(document.querySelectorAll('ul#xinp>li'),'>input,>select',{useVal:true}).each(function(i,el){
var $Li = $(el);
$Li.find('span').text(' : '+$Li.find('>input,>select').filter(':eq(0)').val());
});
```

### sort [$.data()](http://api.jquery.com/data/)

Sort by data attribute by parsing the additional parameter 'data=dataName'.

``` javascript
tinysort(document.querySelectorAll('ul#xdta>li'),'a',{data:'foo'});
```

### sorted descending

Sort by ascending or descending order by parsing the additional 'order="desc"/"asc"' parameter.

``` javascript
tinysort(document.querySelectorAll('ul#xdesc>li'),'',{order:'desc'});
```

### randomize

TinySort can also order randomly (or is that a contradiction).

``` javascript
tinysort(document.querySelectorAll('ul#xrnd li'),{order:'rand'});
```

### parsing a custom sort function

Custom sort functions are similar to those you use with regular Javascript arrays with the exception that the parameters a and b are objects of a similar type. These objects contains three variables: a variable 'e' containing the jQuery object of the element passing through the sort, an integer 'n' containing the original order of the element, and a string 's' containing the string value we want to sort. The latter is not necessarily the text value of the node, should you parse the 'attr' property then 's' will contain the value of that property.

``` javascript
tinysort(document.querySelectorAll('ul#xcst li'),'',{sortFunction:function(a,b){
var iCalcA = parseInt(a.s)%16;
var iCalcB = parseInt(b.s)%16;
return iCalcA===iCalcB?0:(iCalcA>iCalcB?1:-1);
}});
```

### sorting tables

With a little extra code you can create a sortable table. The anchors in this table header call the function sortTable which basicly does this:

``` javascript
var aAsc = [];
function sortTable(e) {
var nr = $(e.currentTarget).index();
aAsc[nr] = aAsc[nr]=='asc'?'desc':'asc';
tinysort(document.querySelectorAll('#xtable>tbody>tr'),'td:eq('+nr+')[abbr]',{order:aAsc[nr]});
}
tinysort(document.querySelectorAll('#xtable').find('thead th:last').siblings().on('click',sortTable);
```

Note that the mixed column only sorts those rows of which the td's have the abbr attribute set, and because of the default place value the non-sorted elements always remain at the bottom

<table class="props xmpl" id="xtable">
    <thead>
        <tr>
            <th><a>word</a></th>
            <th><a>int</a></th>
            <th><a>float</a></th>
            <th><a>mixed</a></th>
            <th><a>mixed</a></th>
            <th><a>add row</a></th>
        </tr>
    </thead>
    <tbody><tr><td></td></tr></tbody>
</table>

### animated sorting

Tinysort has no built in animating features but it can quite easily be accomplished through regular js/jQuery.

``` javascript
var $Ul = tinysort(document.querySelectorAll('ul#xanim');
$Ul.css({position:'relative',height:$Ul.height(),display:'block'});
var iLnH;
var $Li = tinysort(document.querySelectorAll('ul#xanim>li');
$Li.each(function(i,el){
	var iY = $(el).position().top;
	$.data(el,'h',iY);
	if (i===1) iLnH = iY;
});
$Li,).each(function(i,el){
	var $El = $(el);
	var iFr = $.data(el,'h');
	var iTo = i*iLnH;
	$El.css({position:'absolute',top:iFr}).animate({top:iTo},500);
})
```