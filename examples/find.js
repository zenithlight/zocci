var Zocci = require('zocci');

var store = new Zocci('./find.json');
store.set('foo', 'bar');
store.set('foofoo', 'baz');
store.set('xyzzy', 'quux');

console.log(store.find('foo')); // ['bar', 'baz']
console.log(store.find('foo', true)); // ['foo', 'foofoo']
console.log(store.find(/FOO/i)); // ['bar', 'baz']