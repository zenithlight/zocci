/*!
 * zocci
 * Copyright(c) 2015-2016 Anatol Sommer <anatol@anatol.at>
 * MIT Licensed
 */

'use strict';

var fs=require('fs'), EE=require('events'), util=require('util'),
  defaults={jsonSpaces:2, delimiter:'.'};

function Zocci(path, opts) {
  this.path=path;
  this.data={};
  this._resave=[];
  if (typeof opts==='object') {
    this.opts=opts;
    opts.jsonSpaces=isDef(opts.jsonSpaces) ? opts.jsonSpaces : defaults.jsonSpaces;
    opts.delimiter=opts.delimiter || defaults.delimiter;
  } else if (typeof opts==='string') {
    this.opts={jsonSpaces:defaults.jsonSpaces, delimiter:opts};
  } else if (typeof opts==='number') {
    this.opts={jsonSpaces:opts, delimiter:defaults.delimiter};
  } else {
    this.opts=defaults;
  }
  if (!this.reload()) {
    this.save();
  }
}

util.inherits(Zocci, EE);

Zocci.prototype.reload=function() {
  var data;
  if (fs.existsSync(this.path)) {
    data=fs.readFileSync(this.path).toString();
    try {
      this.data=JSON.parse(data);
    } catch(err) {
      return false;
    }
    return true;
  }
};

Zocci.prototype.save=function(cb) {
  var self=this, tmp=this.path+tmpName(), spaces=this.opts.jsonSpaces;
  spaces=(typeof spaces==='number' ? spaces : null);
  if (this._saving) {
    this._resave.push(cb || true);
    return;
  }
  this._saving=true;
  fs.writeFile(tmp, JSON.stringify(this.data, null, spaces), function(err) {
    if (err) {
      saved(self);
      if (cb) {
        return cb(err);
      }
      throw err;
    }
    fs.rename(tmp, self.path, function(err) {
      if (typeof cb==='function') {
        cb(err);
      }
      saved(self);
    });
  });
};

Zocci.prototype.access=function(key, def) {
  var data=this.data, curKey;
  if (key) {
    key=key.split(this.opts.delimiter);
    while (data && key.length) {
      curKey=key.shift();
      data=data.hasOwnProperty(curKey) ? data[curKey] : null;
    }
  }
  return typeof data!=='undefined' ? data : (def || null);
};

Zocci.prototype.get=function(key, def) {
  return copy(this.access(key, def));
};

Zocci.prototype.set=function(key, val, cb) {
  var data=this.data, curKey;
  this.emit('change', key, val);
  key=key.split(this.opts.delimiter);
  while (key.length>1) {
    curKey=key.shift();
    if (!isDef(data[curKey])) {
      data[curKey]={};
    }
    data=data[curKey];
  }
  data[key[0]]=copy(val);
  this.save(cb);
};

Zocci.prototype.remove=function(key, cb) {
  var data=this.data, curKey=key;
  this.emit('change', key, null);
  key=key.split(this.opts.delimiter);
  while (data && key.length>1) {
    curKey=key.shift();
    data=data.hasOwnProperty(curKey) ? data[curKey] : null;
  }
  if (data && isDef(data[key[0]])) {
    delete data[key[0]];
  }
  this.save(cb);
};

Zocci.prototype.find=function(find, returnKeys) {
  var self=this, keys;
  keys=Object.keys(this.data).filter(function(key) {
    if (typeof find==='string') {
      return key.substr(0, find.length)===find;
    } else if (find && find instanceof RegExp) {
      return !!find.exec(key);
    }
  });
  if (returnKeys) {
    return keys;
  }
  return copy(keys.map(function(key) {
    return self.data[key];
  }));
};

Zocci.prototype.subSelector=function(subKey) {
  var self=this;
  return function(subVal) {
    var delimiter=self.opts.delimiter;
    return {
      get:function(key) {
        return self.get(subKey+delimiter+subVal+(key ? delimiter+key : ''));
      },
      set:function(key, val, cb) {
        self.set(subKey+delimiter+subVal+(key ? delimiter+key : ''), val, cb);
      }
    };
  };
};

function tmpName() {
  return '.'+Date.now().toString(36)+'-'+Math.random().toString(36).substr(2);
}

function isDef(check) {
  return typeof check!=='undefined' && check!==null;
}

function copy(data) {
  return isDef(data) ? JSON.parse(JSON.stringify(data)) : null;
}

function saved(self) {
  var cbs;
  self._saving=false;
  if (!self._resave.length) {
    return;
  }
  cbs=self._resave;
  self._resave=[];
  self.save(function(saved) {
    cbs.forEach(function(cb) {
      if (typeof cb==='function') {
        cb(saved);
      }
    });
  });
}

module.exports=Zocci;
