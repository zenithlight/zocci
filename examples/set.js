var Zocci = require('zocci');

var store = new Zocci('./set.json');

console.log(store.get('foo')); // null

store.set('foo', 'bar');

console.log(store.get('foo')); // 'bar'