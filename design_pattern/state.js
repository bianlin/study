// 状态模式


var Light = function () {
	this.state = 'off';
	this.button = null;
};

Light.prototype.init = function () {
	var button = document.createElement('button'),
		self = this;
	
	button.innerHTML = '灯关了';
	this.button = document.body.appendChild(button);
	this.button.onclick = function () {
		self.buttonWasPressed();
	}
};

Light.prototype.buttonWasPressed = function () {
	if (this.state === 'off') {
		console.log('开灯');
		this.button.innerHTML = '灯开了';
		this.state = 'on';
	} else if (this.state === 'on') {
		console.log('关灯');
		this.button.innerHTML = '灯关了';
		this.state = 'off';
	}
};

//var light = new Light();
//light.init();

// # 16.1.2　状态模式改进电灯程序

// OffLightState
var OffLightState = function (light) {
	this.light = light;
};
OffLightState.prototype.buttonWasPressed = function () {
	this.light.button.innerHTML = '弱光';
	this.light.setState(this.light.weakLightState);
};

// WeakLightState
var WeakLightState = function (light) {
	this.light = light;
};
WeakLightState.prototype.buttonWasPressed = function () {
	this.light.button.innerHTML = '强光';
	this.light.setState(this.light.strongLightState);
};

// StrongLightState
var StrongLightState = function (light) {
	this.light = light;
};
StrongLightState.prototype.buttonWasPressed = function () {
	this.light.button.innerHTML = '超强光';
	this.light.setState(this.light.superStrongLightState);
};

// SuperStrongLightState
var SuperStrongLightState = function (light) {
	this.light = light;
};
SuperStrongLightState.prototype.buttonWasPressed = function () {
	this.light.button.innerHTML = '关灯';
	this.light.setState(this.light.offLightState);
};



var Light = function () {
	this.offLightState = new OffLightState(this);
	this.weakLightState = new WeakLightState(this);
	this.strongLightState = new StrongLightState(this);
	this.superStrongLightState = new SuperStrongLightState(this);
	this.button = null;
};

Light.prototype.setState = function (newState) {
	this.currState = newState;
};

Light.prototype.init = function () {
	var button = document.createElement('button'),
		self = this;
	
	button.innerHTML = '关灯';
	this.button = document.body.appendChild(button);
	
	this.currState = this.offLightState;
	
	this.button.onclick = function () {
		self.currState.buttonWasPressed();
	}
};

//var light = new Light();
//light.init();

// 16.5　另一个状态模式示例——文件上传
// 16.5.4　状态模式重构文件上传程序
//window.external = {
//	upload: function (state) {
//		console.log(state);
//	}
//};

var plugin = (function () {
	var plugin = document.createElement('embed');
	plugin.style.display = 'none';
	plugin.type = 'application/txftn-webkit';
	plugin.sign = function () {
		console.log('开始文件扫描');
	};
	plugin.pause = function () {
		console.log('暂停文件上传');
	};
	plugin.uploading = function () {
		console.log('开始文件上传');
	};
	plugin.del = function () {
		console.log('删除文件上传');
	};
	plugin.done = function () {
		console.log('文件上传完成');
	};
	document.body.appendChild(plugin);
	return plugin;
})();

var Upload = function (fileName) {
	this.plugin = plugin;
	this.fileName = fileName;
	this.button1 = null;
	this.button2 = null;
	this.signState = new SignState(this);
	this.uploadingState = new uploadingState(this);
	this.pauseState = new pauseState(this);
	this.delState = new delState(this);
	this.doneState = new doneState(this);
	this.errorState = new ErrorState(this);
	this.currState = this.signState;
};

Upload.prototype.init = function () {
	var that = this;
	this.dom = document.createElement('div');
	this.dom.innerHTML =
		'<span>文件名称：'+this.fileName+'</span>\
		<button data-action="button1">扫描中</button>\
		<button data-action="button2">删除</button>';
	document.body.appendChild(this.dom);
	this.button1 = this.dom.querySelector('[data-action="button1"]');
	this.button2 = this.dom.querySelector('[data-action="button2"]');
	this.bindEvent();
};

Upload.prototype.bindEvent = function () {
	var self = this;
	this.button1.onclick = function () {
		self.currState.clickHandler1();
	}
	this.button2.onclick = function () {
		self.currState.clickHandler2();
	}
};

Upload.prototype.sign = function () {
	this.plugin.sign();
	this.currState = this.signState;
};
Upload.prototype.uploading = function () {
	this.button1.innerHTML = '正在上传，点击暂停';
	this.plugin.uploading();
	this.currState = this.uploadingState;
};
Upload.prototype.pause = function () {
	this.button1.innerHTML = '已暂停，点击继续上传';
	this.plugin.pause();
	this.currState = this.pauseState;
};
Upload.prototype.done = function () {
	this.button1.innerHTML = '上传完成';
	this.plugin.done();
	this.currState = this.doneState;
};
Upload.prototype.error = function () {
	this.button1.innerHTML = '上传失败';
	this.currState = this.errorState;
};
Upload.prototype.del = function () {
	this.plugin.del();
	this.dom.parentNode.removeChild(this.dom);
};
var StateFactory = (function () {
	var State = function () {};
	State.prototype.clickHandler1 = function () {
		throw new Error('子类必须重写父类的clickHandler1方法');
	};
	State.prototype.clickHandler2 = function () {
		throw new Error('子类必须重写父类的clickHandler2方法');
	};
	return function (param) {
		var F = function (uploadObj) {
			this.uploadObj = uploadObj;
		};
		F.prototype = new State();
		for (var i in param) {
			F.prototype[i] = param[i];
		}
		return F;
	}
})();

var SignState = StateFactory({
	clickHandler1: function () {
		console.log('扫描中，点击无效...');
	},
	clickHandler2: function () {
		console.log('文件正在扫描中，不能删除');
	}
});

var UploadingState = StateFactory({
	clickHandler1: function () {
		this.uploadObj.pause();
	},
	clickHandler2: function () {
		console.log('文件正在上传中，不能删除');
	}
});

var PauseState = StateFactory({
	clickHandler1: function () {
		this.uploadObj.uploading();
	},
	clickHandler2: function () {
		this.uploadObj.del();
	}
});

var DoneState = StateFactory({
	clickHandler1: function () {
		console.log('文件已完成上传，点击无效');
	},
	clickHandler2: function () {
		this.uploadObj.del();
	}
});

var ErrorState = StateFactory({
	clickHandler1: function () {
		console.log('文件上传失败，点击无效');
	},
	clickHandler2: function () {
		this.uploadObj.del();
	}
});

//var uploadObj = new Upload('JavaScript设计模式与开发实践');
//uploadObj.init();
//
//window.external.upload = function (state) {
//	uploadObj[state]();
//};
//
//window.external.upload('sign');
//setTimeout(function () {
//	window.external.upload('uploading');
//}, 1000);
//setTimeout(function () {
//	window.external.upload('done');
//}, 5000);


// # 16.9　JavaScript版本的状态机
var Light = function () {
	this.currState = FSM.off;
	this.button = null;
};
Light.prototype.init = function () {
	var button = document.createElement('button'),
		self = this;
	button.innerHTML = '已关灯';
	this.button = document.body.appendChild(button);
	this.button.onclick = function () {
		self.currState.buttonWasPressed.call(self);
	};
}
var FSM = {
	off: {
		buttonWasPressed: function () {
			console.log('开灯');
			this.button.innerHTML = '下一次按我是关灯';
			this.currState = FSM.on;
		}
	},
	on: {
		buttonWasPressed: function () {
			console.log('关灯');
			this.button.innerHTML = '下一次按我是开灯';
			this.currState = FSM.off;
		}
	},
};

//var light = new Light();
//light.init();

// 另外一种方法
var delegate = function (client, delegation) {
	return {
		buttonWasPressed: function () {
			return delegation.buttonWasPressed.apply(client, arguments);
		}
	};
};
var FSM = {
	off: {
		buttonWasPressed: function () {
			console.log('开灯');
			this.button.innerHTML = '下一次按我是关灯';
			this.currState = this.onState;
		}
	},
	on: {
		buttonWasPressed: function () {
			console.log('关灯');
			this.button.innerHTML = '下一次按我是开灯';
			this.currState = this.offState;
		}
	},
};
var Light = function () {
	this.offState = delegate(this, FSM.off);
	this.onState = delegate(this, FSM.on);
	this.currState = this.offState;
	this.button = null;
};
Light.prototype.init = function () {
	var button = document.createElement('button'),
		self = this;
	button.innerHTML = '已关灯';
	this.button = document.body.appendChild(button);
	this.button.onclick = function () {
		self.currState.buttonWasPressed.call(self);
	};
};
//var light = new Light();
//light.init();

// 16.10　表驱动的有限状态机
var fsm = StateMachine.create({
	initial: 'off',
	events: [
		{ name: 'buttonWasPressed', from: 'off', to: 'on' },
		{ name: 'buttonWasPressed', from: 'on', to: 'off' }
	],
	callbacks: {
		onbuttonWasPressed: function (event, from, to) {
			console.log(arguments);
		}
	},
	error: function (eventName, from, to, args, errorCode, errorMessage) {
		console.log(arguments);
	},
});

button.onclick = function () {
	fsm.onbuttonWasPressed();
}

//# 16.11　实际项目中的其他状态机





















