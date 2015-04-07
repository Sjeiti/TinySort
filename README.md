<img src="http://tinysort.sjeiti.com/style/logo.svg" width="32" alt="TinySort" style="vertical-align:middle;" /> TinySort
=======

TinySort is a small script that sorts HTMLElements. It sorts by text- or attribute value, or by that of one of it's children.

Documentation and examples are at [tinysort.sjeiti.com](http://tinysort.sjeiti.com).


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

### options

The options object can have the following settings:

**selector** (String)
<p>A CSS selector to select the element to sort to.</p>

**order** (String='asc')
<p>The order of the sorting method. Possible values are 'asc', 'desc' and 'rand'.</p>

**attr** (String)
<p>Order by attribute value (ie title, href, class)</p>

**data** (String)
<p>Use the data attribute for sorting.</p>

**place** (String='org')
<p>Determines the placement of the ordered elements in respect to the unordered elements. Possible values 'start', 'end', 'first' or 'org'.</p>

**useVal** (Boolean=false)
<p>Use element value instead of text.</p>

**cases** (Boolean=false)
<p>A case sensitive sort (orders [aB,aa,ab,bb])</p>

**forceStrings** (Boolean=false)
<p>If false the string '2' will sort with the value 2, not the string '2'.</p>

**ignoreDashes** (Boolean=false)
<p>Ignores dashes when looking for numerals.</p>

**sortFunction** (function)
<p>Override the default sort function. The parameters are of a type {elementObject}.</p>

**useFlex** (function=true)
<p>If one parent and display flex, ordering is done by CSS (instead of DOM)</p>

**emptyEnd** (function=true)
<p>Sort empty values to the end instead of the start</p>



