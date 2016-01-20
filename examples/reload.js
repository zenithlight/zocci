var fs = require('fs');
var Zocci = require('zocci');

var store = new Zocci('./reload.json');
store.set('foo', 'bar');

console.log(store.get('foo')); // 'bar'

fs.writeFileSync('./reload.json', JSON.stringify({'foo': 'quux'}));

store.reload();

console.log(store.get('foo')); // 'quux'