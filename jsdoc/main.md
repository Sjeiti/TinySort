#TinySort

TinySort is a small script that sorts HTMLElements. It sorts by text- or attribute value, or by that of one of it's children.
The examples below should help getting you on your way.

For those interested: there is a [unit/regression test here](test/unit).

If you find a bug, have a feature request or a code improvement you can [file them here](https://github.com/Sjeiti/TinySort/issues). Please [provide code examples](http://jsfiddle.net/) where applicable.</small>

<div class="alert alert-warning" role="alert"><p>TinySort used to be a jQuery plugin but was rewritten to remove the jQuery dependency. The original functionality is still there but some changes have been made, notably to the parameters.</p></div>

## usage

The first (and only required) argument is a [NodeList](https://developer.mozilla.org/en/docs/Web/API/NodeList), an array of HTMLElements or a string (which is converted to a NodeList using document.querySelectorAll).

``` javascript
tinysort(NodeList);
```

The other arguments can be an an options object.

``` javascript
tinysort(NodeList,{place:'end'});
```

If the option object only contains a `selector` you can suffice by using the selector string instead of the object.

``` javascript
tinysort(NodeList,'span.surname');
```

For multiple criteria you can just overload.

``` javascript
tinysort(NodeList,'span.surname','span.name',{data:'age'});
```

Default settings can be changed

``` javascript
tinysort.defaults.order = 'desc';
tinysort.defaults.attr = 'title';
```

The options object can have the following settings:

### options


## examples

### default sorting

The default sort simply sorts the textContent of each element

``` javascript
tinysort('ul#xdflt>li');
```

### sort on any node

TinySort works on any nodeType. The following is a div with spans.

``` javascript
tinysort('div#xany>span','',{order:'desc'});
```

### sorted numbers

TinySort also works on numbers.

``` javascript
tinysort('ul#xnum>li');
```

### mixed literal and numeral

In a normal sort the order would be a1,a11,a2 while you'd really want it to be a1,a2,a11. TinySort corrects this:

``` javascript
tinysort('ul#xmix>li');
```

### sorted by attribute value

Sort by attribute value by adding the 'attr' option. This will sort by attribute of, either the selection, or of the sub-selection (if provided). In this case sort is by href on the anchor sub-selection.

``` javascript
tinysort('ul#xval>li',{selector:'a',attr:'href'});
```

Another example: images sorted by attribute title value.

``` javascript
tinysort('div#ximg>img',{attr:'title'});
```

### sorted by sub-selection

You can provide an additional subselection by setting the `selector` option. If no other options are set you can also just pass the selector string instead of the options object.

In this example the list elements are sorted to the text of the second span.

``` javascript
tinysort('ul#xsub>li','span:nth-child(2)');
```

The following example will only sort the non-striked elements.

``` javascript
tinysort('ul#xattr>li','span:not([class=striked])');
```

### return only sorted elements

By default, all the elements are returned, even the ones excluded by your sub-selection. By parsing the additional parameter 'returns=true' only the sorted elements are returned.
You can also adjust the placement of the sorted values by adding the 'place' attribute. In this case the original positions are maintained.

``` javascript
var aSorted = tinysort('ul#xret>li','span:not([class=striked])',{returns:true,place:'org'});
aSorted.forEach(function(elm){
    elm.style.color = 'red';
});
```

### multiple sort criteria

Sometimes multiple sorting criteria are required. For instance: you might want to sort a list of people first by surname then by name.

For multiple sorting rules you can just overload the parameters. So tinysort(selector,options) becomes tsort(selector,options1,options2,options3...). Note that in the next example the second parameter `'span.name'` will be rewritten internally to `{selector:'span.name'}`.

``` javascript
tinysort('ul#xmul>li','span.name',{selector:'span.date',data:'timestamp'});
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
tinysort('ul#greek>li',{charOrder:'α[ά]βγδε[έ]ζη[ή]θι[ίϊΐ]κλμνξο[ό]πρστυ[ύϋΰ]φχψω[ώ]'});
```

``` javascript
tinysort('ul#danish>li',{charOrder:'æøå[{Aa}]'});
```

``` javascript
tinysort('ul#serb>li',{charOrder:'cčćd{dž}đl{lj}n{nj}sšzž'});
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

### sort by value (todo)

The value property is primarily used to get the values of form elements, but list-elements also have the value property. By setting the useVal option you can also sort by this form element value. Everything is in the first line, I added some extra code to show the values it sorts on.

``` javascript
tinysort('ul#xinp>li',{selector:'>input,>select',useVal:true}).forEach(function(elm){
    elm.querySelector('span').textContent = elm.querySelector('>input,>select').value;
});
```

### sort by data

Sort by data attribute by setting the `data` option.

``` javascript
tinysort('ul#xdta>li',{selector:'a',data:'foo'});
```

### sorted descending

Sort in ascending or descending order  by setting the `order` option to `asc` or `desc`.

``` javascript
tinysort('ul#xdesc>li',{order:'desc'});
```

### randomize

TinySort can also order randomly (or is that a contradiction).

``` javascript
tinysort('ul#xrnd>li',{order:'rand'});
```

### parsing a custom sort function (todo)

Custom sort functions are similar to those you use with regular Javascript arrays with the exception that the parameters a and b are objects of a similar type. These objects contains three variables: a variable 'e' containing the jQuery object of the element passing through the sort, an integer 'n' containing the original order of the element, and a string 's' containing the string value we want to sort. The latter is not necessarily the text value of the node, should you parse the 'attr' property then 's' will contain the value of that property.

``` javascript
tinysort('ul#xcst>li','',{sortFunction:function(a,b){
var iCalcA = parseInt(a.s)%16;
var iCalcB = parseInt(b.s)%16;
return iCalcA===iCalcB?0:(iCalcA>iCalcB?1:-1);
}});
```

### sorting tables (todo)

With a little extra code you can create a sortable table. The anchors in this table header call the function sortTable which basicly does this:

``` javascript
var aAsc = [];
function sortTable(e) {
var nr = $(e.currentTarget).index();
aAsc[nr] = aAsc[nr]=='asc'?'desc':'asc';
tinysort('#xtable>tbody>tr','td:eq('+nr+')[abbr]',{order:aAsc[nr]});
}
tinysort('#xtable'.find('thead th:last').siblings().on('click',sortTable);
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

### animated sorting (todo)

Tinysort has no built in animating features but it can quite easily be accomplished through regular js/jQuery.

``` javascript
var $Ul = tinysort('ul#xanim');
$Ul.css({position:'relative',height:$Ul.height(),display:'block'});
var iLnH;
var $Li = tinysort('ul#xanim>li');
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