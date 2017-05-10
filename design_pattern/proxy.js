// 虚拟代理实现图片预加载
var myImage = (function() {
  var imgNode = document.createElement('img');
  document.body.appendChild(imgNode);

  return {
    setSrc: function(src) {
      imgNode.src = src;
    },
  };
})();

var proxyImage = (function() {
  var img = new Image;
  img.onload = function() {
    myImage.setSrc(this.src);
  };
  return {
    setSrc: function(src) {
      myImage.setSrc('file://');
      img.src = src;
    },
  };
})();

proxyImage.setSrc( 'http://imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg' );


// 不用代理的预加载图片函数实现
var MyImage = (function(){
    var imgNode = document.createElement( 'img' );
    document.body.appendChild( imgNode );
    var img = new Image;

    img.onload = function(){
        imgNode.src = img.src;
    };

    return {
        setSrc: function( src ){
            imgNode.src = 'file:// /C:/Users/svenzeng/Desktop/loading.gif';
            img.src = src;
        }
    }
})();

MyImage.setSrc( 'http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg' );

// 单一职责原则指的是，就一个类（通常也包括对象和函数等）而言，应该仅有一个引起它变化的原因。
// 如果一个对象承担了多项职责，就意味着这个对象将变得巨大，引起它变化的原因可能会有多个。
// 面向对象设计鼓励将行为分布到细粒度的对象之中，如果一个对象承担的职责过多，等于把这些职责耦合到了一起，这种耦合会导致脆弱和低内聚的设计。
// 当变化发生时，设计可能会遭到意外的破坏。

// 职责被定义为“引起变化的原因”。

// 代理和本体接口的一致性

// 虚拟代理合并HTTP请求
// 假设我们在做一个文件同步的功能，当我们选中一个checkbox的时候，它对应的文件就会被同步到另外一台备用服务器上面

/*
<body>
    <input type="checkbox" id="1"></input>1
    <input type="checkbox" id="2"></input>2
    <input type="checkbox" id="3"></input>3
    <input type="checkbox" id="4"></input>4
    <input type="checkbox" id="5"></input>5
    <input type="checkbox" id="6"></input>6
    <input type="checkbox" id="7"></input>7
    <input type="checkbox" id="8"></input>8
    <input type="checkbox" id="9"></input>9
</body>
*/
var synchronousFile = function( id ){
     console.log( '开始同步文件，id为: ' + id );
};

var checkbox = document.getElementsByTagName( 'input' );

for ( var i = 0, c; c = checkbox[ i++ ]; ){
    c.onclick = function(){
        if ( this.checked === true ){
            synchronousFile( this.id );
        }
    }
};


// 解决方案是，我们可以通过一个代理函数proxySynchronousFile来收集一段时间之内的请求，最后一次性发送给服务器。
// 比如我们等待2秒之后才把这2秒之内需要同步的文件ID打包发给服务器，
// 如果不是对实时性要求非常高的系统，2秒的延迟不会带来太大副作用，却能大大减轻服务器的压力。

var synchronousFile = function(id) {
  console.log('开始同步文件, id为：' + id);
};

var proxySynchronousFile = (function() {
  var cache = [];
  var timer;

  return function(id) {
    cache.push(id);
    if (timer) return;

    timer = setTimeout(function() {
      synchronousFile(cache.join(','));
      clearTimeout(timer);
      timer = null;
      cache.length = 0;
    }, 2000);
  };
})();

var checkbox = document.getElementsByTagName('input');
for(var i = 0, c; c = checkbox[i++];) {
  c.onclick = function() {
    if (this.checked === true) {
      proxySynchronousFile(this.id);
    }
  }
};



// 虚拟代理在惰性加载中的应用
var miniConsole = (function() {
  var cache = [];
  var handle = function(ev) {
    if (ev.keyCode === 113) {
      var script = document.createElement('script');
      script.onload = function() {
        for (var i = 0, fn; fn = cache[i++];) {
          fn();
        }
      };
      script.src = 'miniConsole.js';
      document.getElementsByTagName('head')[0].appendChild(script);
      // 只加载一次miniConsole.js
      document.body.removeEventListener('keydown', handle);
    }
  };
  document.body.addEventListener('keydown', handle, false);
  return {
    log: function() {
      var args = arguments;
      cache.push(function() {
        return miniConsole.log.apply(miniConsole, args);
      });
    },
  }
})();

miniConsole.log(11);

// miniConsole.js code
miniConsole = {
  log: function() {
    // 真正代码
    console.log(Array.prototype.join.call(arguments));
  }
}


// 缓存代理
var mult = function() {
  console.log('开始计算乘积');
  var a = 1;
  for (var i = 0, l = arguments.length; i < l; i++) {
    a = a * arguments[i];
  }
  return a;
}

var proxyMult = (function() {
  var cache = {};
  return function() {
    var args = Array.prototype.join.call(arguments, ',');
    console.log('cache', cache);
    if (args in cache) {
      return cache[args];
    }
    return cache[args] = mult.apply(this, arguments);
  };
})(



// 缓存代理用于ajax异步请求数据


// 用高阶函数动态创建代理

