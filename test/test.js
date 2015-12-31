var Zocci=require('..'), assert=require('assert'), fs=require('fs'),  path=require('path'),  html='', w, exit;

if (~process.argv.indexOf('html-cov')) {
  w=process.stdout.write;
  exit=process.exit;
  process.stdout.write=function(txt, enc, cb) {
    html+=txt;
    if (typeof cb==='function') cb();
    if (typeof enc==='function') enc();
  };

  process.on('exit', function() {
    process.stdout.write=w;
    html=html.split(path.normalize(__dirname+'/../')).join('');
    process.stdout.write(html);
  });
}

describe('Store', function() {
  var store;

  it('should create a new Zocci store', function() {
    store=new Zocci(__dirname+'/test-'+rnd()+'.json');
    assert(store);
  });
  it('should be empty', function() {
    assert.equal(store.find('').length, 0);
  });
  it('should set "port" (number)', function() {
    store.set('port', 80);
  });
  it('should get "port"', function() {
    assert.equal(store.get('port'), 80);
  });
  it('should set "names" (array)', function() {
    store.set('names', ['test0', 'test1']);
  });
  it('should get "names"', function() {
    assert.json_equal(store.get('names'), ['test0', 'test1']);
  });
  it('should get item in "names"', function() {
    assert.equal(store.get('names.1'), 'test1');
  });
  it('should set "path" (object)', function() {
    store.set('path', {base:'/', test:'/test'});
  });
  it('should get "path"', function() {
    assert.json_equal(store.get('path'), {base:'/', test:'/test'});
  });
  it('should get subkey of "path"', function() {
    assert.equal(store.get('path.test'), '/test');
  });
  it('should set subkey of "path"', function() {
    store.set('path.lib', {js:'/lib/js', css:'/lib/css'});
  });
  it('should get new subkey of "path"', function() {
    assert.json_equal(store.get('path.lib'), {js:'/lib/js', css:'/lib/css'});
  });
  it('should get new "path"', function() {
    assert.json_equal(store.get('path'), {
      base:'/', test:'/test', lib:{js:'/lib/js', css:'/lib/css'}
    });
  });
  it('should manipulate "path"', function() {
    store.access('path.lib').fonts='/lib/fonts';
    assert.json_equal(store.get('path.lib'), {
      js:'/lib/js', css:'/lib/css', fonts:'/lib/fonts'
    });
  });
  it('should remove subkey of "path"', function() {
    store.remove('path.lib', {js:'/lib/js', css:'/lib/css'});
    assert.json_equal(store.get('path'), {base:'/', test:'/test'});
  });
  it('should contain 3 items', function() {
    assert.equal(store.find('').length, 3);
  });
  it('should find 2 items starting with "p"', function() {
    assert.equal(store.find('p').length, 2);
  });
  it('should remove item', function() {
    store.remove('path');
    assert.equal(store.find('').length, 2);
  });
  it('should unlink store', function(done) {
    unlinkStore(store, done);
  });
});


describe('Options', function() {
  var store;

  it('should create a new Zocci store with "/" delimiter', function() {
    store=new Zocci(__dirname+'/test-'+rnd()+'.json', '/');
    assert(store);
  });
  it('should set "path" (object)', function() {
    store.set('path', {base:'/', test:'/test', lib:{js:'/lib/js', css:'/lib/css'}});
  });
  it('should get subkey of "path"', function() {
    assert.equal(store.get('path/test'), '/test');
  });
  it('should get deeper subkey of "path"', function() {
    assert.equal(store.get('path/lib/js'), '/lib/js');
  });
  it('should unlink store', function(done) {
    unlinkStore(store, done);
  });
});


assert.json_equal=function(ob1, ob2) {
  assert.equal(JSON.stringify(ob1), JSON.stringify(ob2));
};

function rnd() {
  return Math.random().toString(36).substr(-8);
}

function unlinkStore(store, done) {
  setTimeout(function() {
    fs.unlink(store.path, done);
  }, 30);
}
