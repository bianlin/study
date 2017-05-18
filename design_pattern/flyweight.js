// # 12.4　文件上传的例子

// ## 12.4.2　享元模式重构文件上传

var Upload = function (uploadType) {
	this.uploadType = uploadType;
};

// 12.4.4　工厂进行对象实例化
var UploadFactory = (function () {
	var createFlyWeightObjs = {};
	
	return {
		create: function (uploadType) {
			if (createFlyWeightObjs[uploadType]) {
				return createFlyWeightObjs[uploadType];
			}
			return createFlyWeightObjs[uploadType] = new Upload(uploadType);
		}
	};
});

//2.4.5　管理器封装外部状态
var uploadManager = (function () {
	var uploadDatabase = {};
	return {
		add: function (id, uploadType, fileName, fileSize) {
			var flyWeightObj = UploadFactory.create(uploadType);
			var dom = document.createElement('div');
			dom.innerHTML = 
				'<span>文件名称:'+ fileName +', 文件大小: '+ fileSize +'</span>' +
				'<button class="delFile">删除</button>';
			dom.querySelector('.delFile').onclick = function () {
				flyWeightObj.delFile(id);
			}
			document.body.appendChild(dom);
			uploadDatabase[id] = {
				fileName: fileName,
				fileSize: fileSize,
				dom: dom
			};
			return flyWeightObj;
		},
		setExternalState: function (id, flyWeightObj) {
			var uploadData = uploadDatabase[id];
			for (var i in uploadData) {
				flyWeightObj[i] = uploadData[i];
			}
		}
	};
});

var id = 0;
window.startUpload = function (uploadType, files) {
	for (var i = 0, file; file = files[i++]) {
		var uploadObj = uploadManager.add(++id, uploadType, file.fileName, file.fileSize);
	}
}

startUpload( 'plugin', [
	{
		fileName: '1.txt',
		fileSize: 1000
	},
	{
		fileName: '2.html',
		fileSize: 3000
	},
	{
		fileName: '3.txt',
		fileSize: 5000
	}
]);

startUpload( 'flash', [
	{
		fileName: '4.txt',
		fileSize: 1000
	},
	{
		fileName: '5.html',
		fileSize: 3000
	},
	{
		fileName: '6.txt',
		fileSize: 5000
	}
]);


// 12.7　对象池
var toolTipFactory = (function () {
	var toolTipPool = [];
	return {
		create: function () {
			if (toolTipPool.length === 0) {
				var div = document.createElement('div');
				document.body.appendChild(div);
				return div;
			} else {
				return toolTipPool.shift();
			}
		},
		recover: function (tooltipDom) {
			return toolTipPool.push(tooltipDom);
		}
	};
})();

var ary = [];
for (var i = 0, str; str = ['A', 'B'][i++];) {
	var toolTip = toolTipFactory.create();
	toolTip.innerHTML = str;
	ary.push(toolTip);
}

for(var i = 0, toolTip; toolTip = ary[i++];) {
	toolTipFactory.recover(toolTip);
}

for(var i = 0, str; str = ['A', 'B', 'C', 'D', 'E', 'F'][i++];) {
	var toolTip = toolTipFactory.create();
	toolTip.innerHTML = str;
}


// 12.7.2　通用对象池实现

var objectPoolFactory = function (createObjFn) {
	var objectPool = [];
	return {
		create: function () {
			var obj = objectPool.length === 0 ?
				createObjFn.apply(this, arguments) :
				objectPool.shift();
			return obj;
		},
		recover: function (obj) {
			objectPool.push(obj);
		}
	}
};

var iframeFactory = objectPoolFactory(function () {
	var iframe = document.createElement('iframe');
	document.body.appendChild(iframe);
	
	iframe.onload = function () {
		iframe.onload = null;
		iframeFactory.recover(iframe);
	}
	return iframe;
});

var  iframe1 = iframeFactory.create();
iframe1.src = 'http://baidu.com';

var iframe2 = iframeFactory.create();
iframe2.src = 'http://qq.com';

setTimeout(function () {
	var iframe3 = iframeFactory.create();
	iframe3.src = 'http://163.com';
}, 3000);
























