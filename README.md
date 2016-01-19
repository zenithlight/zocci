# Zocci
Simple JSON storage

### Usage:
```js
var Zocci=require('zocci'), store=new Zocci('./test.json');

store.set('foo', {bar:'baz'});
store.get('foo');              // { bar: 'baz' }
store.get('foo.bar');          // 'baz'

store.set('foo.arr', [
  'zero', 'one', 'two'
]);
store.get('foo.arr.2');        // 'two'

store.set('one.two.three', 3);
store.get('one');              // { two: { three: 3 } }

store.access('foo').bar='test';
store.save(function(err) {
  // Saved
});

store.set('test1', 'test one');
store.set('test2', 'test two', function(err) {
  // Saved
});

store.find('test');            // ['test one', 'test two']
store.find('test', true);      // ['test1', 'test2']

store.remove('one');
store.remove('foo.bar', function(err) {
  // Saved
});

store.on('change', function(key, value) {
  if (value===null) {
    // key was removed
  } else {
    // key was set to value
  }
});
```


### Change delimiter:
```js
var Zocci=require('zocci'), store=new Zocci('./test.json', ':');

store.set('foo', {bar:'baz'});
store.get('foo:bar');          // 'baz'

store.set('one:two:three', 3);
store.get('one');              // { two: { three: 3 } }
```


### subSelector:
```js
var Zocci=require('zocci'), config=new Zocci('./config.json', ':'), hostConfig;

config.set('httpPort', 80);
config.set('hosts', {
  'example.com':{port:3001},
  'example.org':{port:3002, https:{enabled:false}}
});

hostConfig=config.subSelector('hosts');

hostConfig('example.com').get('port');    // 3001
hostConfig('example.com').get();          // { port: 3001 }
hostConfig('example.com').remove('port');

hostConfig('example.org').set('https:enabled', true);
// equivalent to
config.set('hosts:example.org:https:enabled', true);
```


## License

#### MIT

