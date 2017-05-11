// # 8.4　自定义事件

var salesOffices = {};
salesOffices.clientList = {};
salesOffices.listen = function(key, fn) {
  if (!this.clientList[key]) {
    this.clientList[key] = [];
  }
  this.clientList[key].push(fn);
};
salesOffices.trigger = function() {
  var key = Array.prototype.shift.call(arguments);
  var fns = this.clientList[key];
  if (!fns || fns.listen === 0) {
    return false;
  }
  for (var i = 0, fn; fn = fns[i++];) {
    fn.apply(this, arguments);
  }
};

salesOffices.listen('squareMeter88', function(price) {
  console.log('价格=' + price);
});

salesOffices.listen('squareMeter110', function(price) {
  console.log('价格=' + price);
});

salesOffices.trigger('squareMeter88', 2000000);
salesOffices.trigger('squareMeter110', 3000000);

// # 8.5　发布－订阅模式的通用实现

var event = {
  clientList: [],
  listen: function(key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = [];
    }
    this.clientList[key].push(fn);
  },
  trigger: function() {
    var key = Array.prototype.shift.call(arguments);
    var fns = this.clientList[key];
    if (!fns || fns.listen === 0) {
      return false;
    }
    for (var i = 0, fn; fn = fns[i++];) {
      fn.apply(this, arguments);
    }
  },
};

var installEvent = function(obj) {
  for (var i in event) {
    obj[i] = event[i];
  }
}

var salesOffices = {};
installEvent( salesOffices );

salesOffices.listen( 'squareMeter88', function( price ){    // 小明订阅消息
    console.log( '价格= ' + price );
});

salesOffices.listen( 'squareMeter100', function( price ){     // 小红订阅消息
    console.log( '价格= ' + price );
});

salesOffices.trigger( 'squareMeter88', 2000000 );    // 输出：2000000
salesOffices.trigger( 'squareMeter100', 3000000 );  

// # 8.6　取消订阅的事件

event.remove = function(key, fn) {
  var fns = this.clientList[key];
  if (!fns) return false;
  if (!fn) {
    fns && (fns.length = 0);
  } else {
    for (var l = fns.length - 1; l >= 0; l--) {
      var _fn = fns[l];
      if (_fn === fn) {
        fns.splice(l, 1);
      }
    }
  }
};




// # 8.7　真实的例子——网站登录

$.ajax( 'http:// xxx.com?login', function(data){    // 登录成功
    login.trigger( 'loginSucc', data);    // 发布登录成功的消息
});

var header = (function() {
  login.listen('loginSucc', function(data) {
    header.setAvatar(data.avatar);
  });

  return {
    setAvatar: function(data) {
      console.log('设置header模块的头像');
    }
  }
})();

var nav = (function() {
  login.listen('loginSucc', function(data) {
    nav.setAvatar(data.avatar);
  });
  return {
    setAvatar: function(avatar) {
      console.log( '设置nav模块的头像' );
    },
  };
})();

var address = (function() {
  login.listen('loginSucc', function(obj) {
    address.refresh(obj);
  });

  return {
    refresh: function(avatar) {
      console.log('刷新收货地址列表');
    }
  }
})();



// # 8.8　全局的发布－订阅对象


// # 8.8　全局的发布－订阅对象
var Event = (function() {
  var clientList = {},
    listen,
    trigger,
    remove;

  listen = function(key, fn) {
    if (!clientList[key]) {
      clientList[key] = [];
    }
    clientList[key].push(fn);
  };

  trigger = function() {
    var key = Array.prototype.shift.call(arguments),
      fns = clientList[key];
    if (!fns || fns.length === 0) {
      return false;
    }
    for (var i = 0, fn; fn = fns[i++];) {
      fn.apply(this, arguments);
    }
  };

  remove = function(key, fn) {
    var fns = clientList[key];
    if (!fns) return false;
    if (!fn) {
      fns && (fns.length = 0);
    } else {
      for (var l = fns.length - 1; l >= 0; l--) {
        var _fn = fns[l];
        if (_fn === fn) {
          fns.splice(l, 1);
        }
      }
    }
  };

  return {
    listen: listen,
    trigger: trigger,
    remove: remove,
  };
})();

Event.listen('squareMeter88', function(price) {
  console.log('价格=' + price);
});

Event.trigger('squareMeter88', 2000000);


// # 8.9　模块间通信

// # 8.11　全局事件的命名冲突
var Event = (function() {
  var global = this,
    Event,
    _default = 'default';

  Event = function() {
    var _listen,
      _trigger,
      _remove,
      _slice = Array.prototype.slice,
      _shift = Array.prototype.shift,
      _unshift = Array.prototype.unshift,
      namespaceCache = {},
      _create,
      find,
      each = function(ary, fn) {
        var ret;
        for( var i = 0, l = ary.length; i < l; i++) {
          var n = ary[i];
          ret = fn.call(n, i, n);
        }
        return ret;
      };

    _listen = function(key, fn, cache) {
      if (!cache[key]) {
        cache[key] = [];
      }
      cache[key].push(fn);
    };
    _remove = function(key, cache, fn) {
      if (cache[key]) {
        if (fn) {
          for (var i = cache[key].length; i >= 0; i--) {
            if (cache[key][i] === fn) {
              cache[key].splice(i, 1);
            }
          }
        } else {
          cache[key] = [];
        }
      }
    };
    _trigger = function() {
      var cache = _shift.call(arguments),
        key = _shift.call(arguments),
        args = arguments,
        _self = this,
        stack = cache[key];

      if (!stack || !stack.length) return;
      
      return each(stack, function() {
        return this.apply(_self, args);
      });
    };
    _create = function(namespace) {
      var namespace = namespace || _default;
      var cache = {},
        offlineStack = [], // 离线事件
        ret = {
          listen: function(key, fn, last) {
            _listen(key, fn, cache);
            if (offlineStack === null) return;
            if (last === 'last') {
              offlineStack.length && offlineStack.pop();
            } else {
              each(offlineStack, function() {
                this();
              });
            }
            offlineStack = null;
          },
          remove: function(key, fn) {
            _remove( key, cache ,fn);
          },
          trigger: function() {
            var fn, args, _self = this;
            _unshift.call(arguments, cache);
            args = arguments;
            fn = function() {
              return _trigger.apply(_self, args);
            };
            if (offlineStack) {
              return offlineStack.push(fn);
            }
            return fn();
          },
        };
      return namespace ?
        (namespaceCache[namespace] ?
        namespaceCache[namespace] :
        namespaceCache[ namespace ] = ret) :
        ret;
    };

    return {
      create: _create,
      one: function() {},
      remove: function() {},
      listen: function() {},
      trigger: function() {},
    };
  };

  return Event;
})();