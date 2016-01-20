var Zocci = require('zocci');

var store = new Zocci('./access.json');
store.set('foo', { 'bar': 'baz' });

console.log(store.get('foo')); // '{ 'bar': 'baz' }'

store.access('foo')['bar'] = 'quux'

console.log(store.get('foo')); // '{ 'bar': 'quux' }'