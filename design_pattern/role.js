var order = function (orderType, pay, stock) {
	if (orderType === 1) {
		if (pay === true) {
			console.log('500元定金预购，得到100优惠券');
		} else {
			if (stock > 0) {
				console.log('普通购买，无优惠券');
			} else {
				console.log('手机库存不足');
			}
		}
	} else if (orderType === 2) {
		if (pay === true) {
			console.log('200元定金预购，得到50优惠券');
		} else {
			if (stock > 0) {
				console.log('普通购买，无优惠券');
			} else {
				console.log('手机库存不足');
			}
		}
	} else if (orderType === 3) {
		if (stock > 0) {
			console.log('普通购买，无优惠券');
		} else {
			console.log('手机库存不足');
		}
	}
};

//order(1, true, 500);

//13.3　用职责链模式重构代码
var order500 = function (orderType, pay, stock) {
	if (orderType === 1 && pay === true) {
		console.log('500元定金预购, 得到100优惠券');
	} else {
		order200(orderType, pay, stock);
	}
};

var order200 = function (orderType, pay, stock) {
	if (orderType === 2 && pay === true) {
		console.log('200元定金预购, 得到50优惠券');
	} else {
		orderNormal(orderType, pay, stock);
	}
};

var orderNormal = function (orderType, pay, stock) {
	if (stock > 0) {
		console.log('普通购买，无优惠券');
	} else {
		console.log('手机库存不足');
	}
};


//order500( 1 , true, 500);    // 输出：500元定金预购, 得到100优惠券
//order500( 1, false, 500 );   // 输出：普通购买, 无优惠券
//order500( 2, true, 500 );    // 输出：200元定金预购, 得到50优惠券
//order500( 3, false, 500 );   // 输出：普通购买, 无优惠券
//order500( 3, false, 0 );     // 输出：手机库存不足

// 13.4　灵活可拆分的职责链节点

var order500 = function (orderType, pay, stock) {
	if (orderType === 1 && pay === true) {
		console.log('500元定金预购, 得到100优惠券');
	} else {
		return 'nextSuccessor';
	}
};

var order200 = function (orderType, pay, stock) {
	if (orderType === 2 && pay === true) {
		console.log('200元定金预购, 得到50优惠券');
	} else {
		return 'nextSuccessor';
	}
};

var orderNormal = function (orderType, pay, stock) {
	if (stock > 0) {
		console.log('普通购买，无优惠券');
	} else {
		console.log('手机库存不足');
	}
};

var Chain = function (fn) {
	this.fn = fn;
	this.successor = null;
};

Chain.prototype.setNextSuccessor = function (successor) {
	return this.successor = successor;
};

Chain.prototype.passRequest = function (successor) {
	var ret = this.fn.apply(this, arguments);
	if (ret == 'nextSuccessor') {
		return this.successor && this.successor.passRequest.apply(this.successor, arguments);
	}
	return ret;
};


//var chainOrder500 = new Chain( order500 );
//var chainOrder200 = new Chain( order200 );
//var chainOrderNormal = new Chain( orderNormal );
//
//chainOrder500.setNextSuccessor( chainOrder200 );
//chainOrder200.setNextSuccessor( chainOrderNormal );
//
//chainOrder500.passRequest( 1, true, 500 );    // 输出：500元定金预购，得到100优惠券
//chainOrder500.passRequest( 2, true, 500 );    // 输出：200元定金预购，得到50优惠券
//chainOrder500.passRequest( 3, true, 500 );    // 输出：普通购买，无优惠券
//chainOrder500.passRequest( 1, false, 0 );     // 输出：手机库存不足


//# 13.5　异步的职责链

Chain.prototype.next = function (successor) {
	return this.successor && this.successor.passRequest.apply(this.successor, arguments);
};


//var fn1 = new Chain(function(){
//	console.log( 1 );
//	return 'nextSuccessor';
//});
//
//var fn2 = new Chain(function(){
//	console.log( 2 );
//	var self = this;
//	setTimeout(function(){
//		self.next();
//	}, 1000 );
//});
//
//var fn3 = new Chain(function(){
//	console.log( 3 );
//});
//
//fn1.setNextSuccessor( fn2 ).setNextSuccessor( fn3 );
//fn1.passRequest();

// 13.7　用AOP实现职责链

Function.prototype.after = function (fn) {
	var self = this;
	return function () {
		var ret = self.apply(this, arguments);
		if (ret === 'nextSuccessor') {
			return fn.apply(this, arguments);
		}
		return ret;
	}
}

//var order = order500yuan.after(order200yuan).after(orderNormal);

//order( 1, true, 500 );    // 输出：500元定金预购，得到100优惠券
//order( 2, true, 500 );    // 输出：200元定金预购，得到50优惠券
//order( 1, false, 500 );   // 输出：普通购买，无优惠券

//# 13.8　用职责链模式获取文件上传对象
var getActiveUploadObj = function(){
	try{
		return new ActiveXObject("TXFTNActiveX.FTNUpload");    // IE上传控件
	}catch(e){
		return 'nextSuccessor' ;
	}
};

var getFlashUploadObj = function(){
	if ( supportFlash() ){
		var str = '<object type="application/x-shockwave-flash"></object>';
		return $( str ).appendTo( $('body') );
	}
	return 'nextSuccessor' ;
};

var getFormUpladObj = function(){
	return $( '<form><input name="file" type="file"/></form>' ).appendTo( $('body') );
};

var getUploadObj = getActiveUploadObj.after( getFlashUploadObj ).after( getFormUpladObj );

console.log(  getUploadObj()  );














