// # 策略模式 strategy

// 策略模式的定义是：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。

// 1. 最初的代码实现
var calculateBonus = function(performanceLevel, salary) {
  if (performanceLevel === 'S') return salary * 4;
  if (performanceLevel === 'A') return salary * 3;
  if (performanceLevel === 'B') return salary * 2;
};

calculateBonus('B', 20000);
calculateBonus('B', 6000);

// 2. 使用组合函数重构代码
var performanceS = function(salary) {
  return salary * 4;
};

var performanceA = function(salary) {
  return salary * 3;
};

var performanceB = function(salary) {
  return salary * 2;
};

var calculateBonus = function(performanceLevel, salary) {
  if (performanceLevel === 'S') return performanceS(salary);
  if (performanceLevel === 'A') return performanceA(salary);
  if (performanceLevel === 'B') return performanceB(salary);
};

// 3. 使用策略模式重构代码
// 一个基于策略模式的程序至少由两部分组成。
// 第一个部分是一组策略类，策略类封装了具体的算法，并负责具体的计算过程。 
// 第二个部分是环境类Context，Context接受客户的请求，随后把请求委托给某一个策略类。要做到这点，说明Context中要维持对某个策略对象的引用。
var performanceS = function(salary) {};
performanceS.prototype.calculate = function(salary) {
  return salary * 4;
}
var performanceA = function(salary) {};
performanceA.prototype.calculate = function(salary) {
  return salary * 3;
}
var performanceB = function(salary) {};
performanceB.prototype.calculate = function(salary) {
  return salary * 2;
}

var Bonus = function() {
  this.salary = null;
  this.strategy = null;
};
Bonus.prototype.setSalary = function(salary) {
  this.salary = salary;
};
Bonus.prototype.setStrategy = function(strategy) {
  this.strategy = strategy;
};
Bonus.prototype.getBonus = function() {
  return this.strategy.calculate(this.salary);
};

var bonus = new Bonus();

bonus.setSalary(10000);
bonus.setStrategy(new performanceS());
console.log(bonus.getBonus());

bonus.setStrategy(new performanceA());
console.log(bonus.getBonus());


// # JavaScript版本的策略模式
var strategies = {
  "S": function( salary ){
    return salary * 4;
  },
  "A": function( salary ){
    return salary * 3;
  },
  "B": function( salary ){
    return salary * 2;
  }
};

var calculateBonus = function( level, salary ){
    return strategies[ level ]( salary );
};

console.log( calculateBonus( 'S', 20000 ) );
console.log( calculateBonus( 'A', 10000 ) );


// 使用策略模式实现缓动动画
// 5.4.3　让小球运动起来
var tween = {
  linear: function( t, b, c, d ){
      return c*t/d + b;
  },
  easeIn: function( t, b, c, d ){
      return c * ( t /= d ) * t + b;
  },
  strongEaseIn: function(t, b, c, d){
      return c * ( t /= d ) * t * t * t * t + b;
  },
  strongEaseOut: function(t, b, c, d){
      return c * ( ( t = t / d - 1) * t * t * t * t + 1 ) + b;
  },
  sineaseIn: function( t, b, c, d ){
      return c * ( t /= d) * t * t + b;
  },
  sineaseOut: function(t,b,c,d){
      return c * ( ( t = t / d - 1) * t * t + 1 ) + b;
  }
};

var Animate = function(dom) {
  this.dom = dom;                   // 进行运动的dom节点
  this.startTime = 0;               // 动画开始时间
  this.startPos = 0;                // 动画开始时，dom节点的位置，即dom的初始位置
  this.endPos = 0;                  // 动画结束时，dom节点的位置，即dom的目标位置
  this.propertyName = null;         // dom节点需要被改变的css属性名
  this.easing = null;               // 缓动算法
  this.duration = null;             // 动画持续时间
};

Animate.prototype.start = function(propertyName, endPos, duration, easing) {
  this.startTime = +new Date;
  this.startPos = this.dom.getBoundingClientRect()[propertyName];
  this.propertyName = propertyName;
  this.endPos = endPos;
  this.duration = duration;
  this.easing = tween[easing];

  var self = this;
  var timeId = setInterval(function() {
    if (self.step() === false) {
      clearInterval(timeId);
    }
  }, 19);
};

Animate.prototype.step = function() {
  var t = +new Date;
  if (t >= this.startTime + this.duration) {
    this.update(this.endPos);
    return false;
  }

  var pos = this.easing(t - this.startTime, this.startPos, 
    this.endPos - this.startPos, this.duration);
  this.update(pos);
};

Animate.prototype.update = function(pos) {
  this.dom.style[this.propertyName] = pos + 'px';
};



// # 5.6　表单校验
// * 用户名不能为空。
// * 密码长度不能少于6位。
// * 手机号码必须符合格式。

// 5.6.1　表单校验的第一个版本

var registerForm = document.getElementById( 'registerForm' );
registerForm.onsubmit = function(){
    if ( registerForm.userName.value === '' ){
        alert ( '用户名不能为空' );
        return false;
    }

    if ( registerForm.password.value.length < 6 ){
        alert ( '密码长度不能少于6位' );
        return false;
    }
    if ( !/(^1[3|5|8][0-9]{9}$)/.test( registerForm.phoneNumber.value ) ){
        alert ( '手机号码格式不正确' );
        return false;
    }
}


// 5.6.2　用策略模式重构表单校验

var strategies = {
  isNonEmpty: function(value, errorMsg) {
    if (value === '') {
      return errorMsg;
    }
  },
  minLength: function(value, length, errorMsg) {
    if (value.length < length) {
      return errorMsg;
    }
  },
  isMobile: function(value, errorMsg) {
    if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
      return errorMsg;
    }
  },
};

// Validator
var Validator = function() {
  this.cache = [];
};

Validator.prototype.add = function(dom, rule, errorMsg) {
  var ary = rule.split(':');
  this.cache.push(function() {
    var strategy = ary.shift();
    ary.unshift(dom.value);
    ary.push(errorMsg);
    return strategies[strategy].apply(dom, ary);
  });
}

Validator.prototype.start = function() {
  for(var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
    var msg = validatorFunc();
    if (msg) {
      return msg;
    }
  }
};
var registerForm = document.getElementById( 'registerForm' );

var validataFunc = function() {
  var validator = new Validator();
  // 添加一些校验规则
  validator.add(registerForm.userName, 'isNonEmpty', '用户名不能为空');
  validator.add(registerForm.password, 'minLength:6', '密码长度不能少于6位');
  validator.add(registerForm.phoneNumber, 'isMobile', '手机号码格式不正确');

  var errorMsg = validator.start();
  return errorMsg;
};


registerForm.onsubmit = function() {
  var errorMsg = validataFunc();
  if (errorMsg) {
    alert(errorMsg);
    return false;
  }
};