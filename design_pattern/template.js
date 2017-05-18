// # 11.2　第一个例子——Coffee or Tea
// ## 11.2.3　分离出共同点
var Beverage = function () {};
Beverage.prototype.boilWater = function () {
  console.log('把水煮沸');
};
Beverage.prototype.brew = function () {
  throw new Error('子类必须重写brew方法');
};
Beverage.prototype.pourInCup = function () {
  throw new Error('子类必须重写pourInCup方法');
};
Beverage.prototype.addCondiments = function () {
  throw new Error('子类必须重写addCondiments方法');
};

Beverage.prototype.init = function () {
  this.boilWater();
  this.brew();
  this.pourInCup();
  this.addCondiments();
};

var Coffee = function () {};
Coffee.prototype = new Beverage();
Coffee.prototype.brew = function () {
  console.log('用沸水冲泡咖啡');
};
Coffee.prototype.pourInCup = function () {
  console.log('把咖啡倒进杯子');
};
Coffee.prototype.addCondiments = function () {
  console.log('加糖和牛奶');
};

var coffee = new Coffee();
coffee.init();

var Tea = function () {};
Tea.prototype = new Beverage();
Tea.prototype.brew = function () {
  console.log('用沸水浸泡茶叶');
};
Tea.prototype.pourInCup = function () {
  console.log('把茶倒进杯子');
};
Tea.prototype.addCondiments = function () {
  console.log('加柠檬');
};

var tea = new Tea();
tea.init();


// 
var Beverage = function (param) {

  var boilWater = function () {
    console.log('把水煮沸');
  };

  var brew = param.brew || function () {
    throw new Error('必须传递brew方法');
  };

  var pourInCup = param.pourInCup || function () {
    throw new Error('必须传递pourInCup方法');
  };

  var addCondiments = param.addCondiments || function () {
    throw new Error('必须传递addCondiments方法');
  };

  var F = function () {};

  F.prototype.init = function () {
    boilWater();
    brew();
    pourInCup();
    addCondiments();
  };

  return F;
};

var Coffee = Beverage({
  brew: function () {
    console.log('用沸水冲泡咖啡');
  },
  pourInCup: function () {
    console.log('把咖啡倒进杯子'); 
  },
  addCondiments: function () {
    console.log('加糖和牛奶');
  }
});

var Tea = Beverage({
  brew: function () {
    console.log('用沸水浸泡茶叶');
  },
  pourInCup: function () {
    console.log('把茶倒进杯子');
  },
  addCondiments: function () {
    console.log('加柠檬');
  }
});


var coffee = new Coffee();
coffee.init();

var tea = new Tea();
tea.init();