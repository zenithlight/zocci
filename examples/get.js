var Zocci = require('zocci');

var store = new Zocci('./get.json');
store.set('foo', 'bar');

console.log(store.get('foo')); // 'bar'