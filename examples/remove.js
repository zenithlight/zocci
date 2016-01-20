var Zocci = require('zocci');

var store = new Zocci('./remove.json');
store.set('foo', 'bar');

console.log(store.get('foo')); // 'bar'

store.remove('foo');

console.log(store.get('foo')); // null