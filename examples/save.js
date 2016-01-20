var fs = require('fs');
var Zocci = require('zocci');

var store = new Zocci('./save.json');
store.set('foo', { 'bar': 'baz' });
store.access('foo')['bar'] = 'quux';

store.save(function(err) {
    if (!err) {
        console.log('All good!');
        console.log(JSON.parse(fs.readFileSync('./save.json', { encoding: 'utf8' }))['foo']['bar']); // 'quux'
        return;
    }
    
    console.log('Oh no! An error has occurred!');
});