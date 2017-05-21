// 装饰者模式

var Plane = function () {}
Plane.prototype.fire = function () {
	console.log('发射普通子弹');
};
// 增加两个装饰类
var MissileDecorator = function (plane) {
	this.plane = plane;
};
MissileDecorator.prototype.fire = function () {
	this.plane.fire();
	console.log('发射导弹');
};
var AtomDecorator = function (plane) {
	this.plane = plane;
};
AtomDecorator.prototype.fire = function () {
	this.plane.fire();
	console.log('发射原子弹');
};

//var plane = new Plane();
//plane = new MissileDecorator( plane );
//plane = new AtomDecorator( plane );
//
//plane.fire();

// 15.3　回到JavaScript的装饰者
var plane = {
	fire: function () {
		console.log('发射普通子弹');
	}
};
var missileDecorator = function () {
	console.log('发射导弹');
};
var atomDecorator = function () {
	console.log('发射原子弹');
};

//var fire1 = plane.fire;
//plane.fire = function () {
//	fire1();
//	missileDecorator();
//};
//var fire2 = plane.fire;
//plane.fire = function () {
//	fire2();
//	atomDecorator();
//}
//plane.fire();

// 15.5　用AOP装饰函数
Function.prototype.before = function (beforefn) {
	var __self = this;
	return function () {
		beforefn.apply(this, arguments);
		return __self.apply(this, arguments);
	}
};

Function.prototype.after = function (afterfn) {
	var __self = this;
	return function () {
		var ret = __self.apply(this, arguments);
		afterfn.apply(this, arguments);
		return ret;
	}
};

// 15.6　AOP的应用实例
// 15.6.1　数据统计上报
var showLogin = function () {
	console.log('打开登录浮层');
}

var log = function () {
	console.log('上报标签为：xxxx')
}

showLogin = showLogin.after(log);

// 15.6.2　用AOP动态改变函数的参数
var func = function (param) {
	console.log('param', param);
};
func = func.before(function (param) {
	param.b = 'b';
});
func({ a: 'a' });






















