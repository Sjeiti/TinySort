<img src="http://tinysort.sjeiti.com/styles/logo.svg" width="32" alt="TinySort" style="vertical-align:middle;" /> TinySort
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

**nodeList** (NodeList,Array.<HTMLElement>,String)
The nodelist or array of elements to be sorted. If a string is passed it should be a valid CSS selector.

**options** (Object)
A list of options.

**options.selector** (String)
A CSS selector to select the element to sort to.

**options.order** (String='asc')
The order of the sorting method. Possible values are 'asc', 'desc' and 'rand'.

**options.attr** (String)
Order by attribute value (ie title, href, class)

**options.data** (String)
Use the data attribute for sorting.

**options.place** (String='org')
Determines the placement of the ordered elements in respect to the unordered elements. Possible values 'start', 'end', 'first', 'last' or 'org'.

**options.useVal** (Boolean)
Use element value instead of text.

**options.cases** (Boolean)
A case sensitive sort (orders [aB,aa,ab,bb])

**options.natural** (Boolean)
Use natural sort order.

**options.forceStrings** (Boolean)
If false the string '2' will sort with the value 2, not the string '2'.

**options.ignoreDashes** (Boolean)
Ignores dashes when looking for numerals.

**options.sortFunction** (function)
Override the default sort function. The parameters are of a type {elementObject}.

**options.useFlex** (Boolean=true)
If one parent and display flex, ordering is done by CSS (instead of DOM)

**options.emptyEnd** (Boolean=true)
Sort empty values to the end instead of the start



