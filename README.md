<img src="http://tinysort.sjeiti.com/style/logo.svg" width="32" alt="TinySort" style="vertical-align:middle;" /> TinySort
=======

TinySort is a small and simple jQuery plugin that will sort any nodetype by its text- or attribute value, or by that of one of its children.

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

The options object can have the following settings:

### options

selector
String
XXXXXXXXXXXXXXXX

order
String
'asc'
The order of the sorting method. Possible values are 'asc', 'desc' and 'rand'.

attr
String
null
Order by attribute value (ie title, href, class)

data
String
null
Use the data attribute for sorting.

place
String
'org'
Determines the placement of the ordered elements in respect to the unordered elements. Possible values 'start', 'end', 'first' or 'org'.

useVal
Boolean
false
Use element value instead of text.

cases
Boolean
false
A case sensitive sort (orders [aB,aa,ab,bb])

forceStrings
Boolean
false
If false the string '2' will sort with the value 2, not the string '2'.

ignoreDashes
Boolean
false
Ignores dashes when looking for numerals.

sortFunction
function
null
Override the default sort function.