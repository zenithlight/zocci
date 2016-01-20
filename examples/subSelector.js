var Zocci = require('zocci');

var store = new Zocci('./subSelector.json');
store.set('foo', { 'bar': { 'baz': 'quux' } });

var subStore = store.subSelector('foo');
subStore('bar').set('baz', 'xyzzy');

console.log(store.get('foo')['bar']); // { 'baz': 'xyzzy' }