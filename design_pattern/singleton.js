// 在页面中创建唯一的div节点
var CreateDiv = (function() {
  
  var instance;

  var CreateDiv = function( html ) {
    if ( instance ) {
      return instance;
    }
    this.html = html;
    this.init();
    return instance = this;
  };

  CreateDiv.prototype.init = function() {
    var div = document.createElement('div');
    div.innerHTML = this.html;
    document.body.appendChild( div );
  };

  return CreateDiv;
})();

var a = new CreateDiv( 'sven1' );
var b = new CreateDiv( 'sven2' );

console.log(a === b);


// 用代理实现单例模式
var CreateDiv = function(html) {
  this.html = html;
  this.init();
};

CreateDiv.prototype.init = function() {
  var div = document.createElement('div');
  div.innerHTML = this.html;
  document.body.appendChild( div );
};

var ProxySingletonCreateDiv = (function() {
  var instance;
  return function(html) {
    if (!instance) {
      instance = new CreateDiv(html);
    }
    return instance;
  };
})();

var a = ProxySingletonCreateDiv('sven1');
var b = ProxySingletonCreateDiv('sven2');

console.log(a === b);



// js中的单例模式
// 单例模式核心：确保只有一个实例，并提供全局访问。
// 全局变量就是单例模式，全局变量容易造成冲突

// 1. 使用命名空间
var MyApp = {};
MyApp.namespace = function(name) {
  var parts = name.split('.');
  var current = MyApp;
  for(var i in parts) {
    if (!current[parts[i]]) {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
}

MyApp.namespace('event');
MyApp.namespace('dom.style');

console.log(MyApp);

// 2. 使用闭包封装私有变量
var usrt = (function() {
  var __name = 'sven';
  var __age = 29;
  return  {
    getUserInfo: function() {
      return __name + '-' + __age;
    }
  };
})();


// 惰性单例
var getSingle = function(fn) {
  var result;
  return function() {
    return result || (result = fn.apply(this, arguments));
  }
};

var createLoginLayer = function() {
  var div = document.createElement('div');
  div.innerHTML = '我是登录浮层';
  div.style.display = 'none';
  document.body.appendChild(div);
  return div;
}

var createSingleLoginLayer = getSingle( createLoginLayer );

document.getElementById('loginBtn').onclick = function() {
  var loginLayer = createLoginLayer();
  loginLayer.style.display = 'block';
};

var createSingleIframe = getSingle(function() {
  var iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  return iframe;
});

document.getElementById('loginBtn').onclick = function() {
  //
};