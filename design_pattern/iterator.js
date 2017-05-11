// # 迭代器模式

// 实现自己的迭代器
var each = function (ary, callback) {
  for (var i = 0, l = ary.length; i < l; i++) {
    callback.call(ary[i], i, ary[i]);
  }
};

each([1, 2, 3], function (i, n) {
  console.log([i, n]);
});

// # 7.3　内部迭代器和外部迭代器
// ## 1. 内部迭代器
// 上面实现自己的迭代器就是内部迭代器
var compare = function (ary1, ary2) {
  if (ary1.length !== ary2.length) {
    throw new Error('ary1和ary2不相等');
  }
  each(ary1, function (i, n) {
    if (n !== ary2[i]) {
      throw new Error('ary1和ary2不相等');
    }
  });
  alert('ary1和ary2相等');
};

compare([1, 2, 3], [1, 2, 4]);

// ## 2. 外部迭代器
var Iterator = function (obj) {
  var current = 0;
  var next = function () {
    current += 1;
  };
  var isDone = function () {
    return current >= obj.length;
  };
  var getCurrItem = function () {
    return obj[current];
  };
  return {
    next: next,
    isDone: isDone,
    getCurrItem: getCurrItem,
    length: obj.length,
  };
};

var compare = function (iterator1, iterator2) {
  if (iterator1.length !== iterator2.length) {
    throw new Error('iterator1 和iterator2 不相等');
  }
  while (!iterator1.isDone() && !iterator2.isDone()) {
    if (iterator1.getCurrItem() !== iterator2.getCurrItem()) {
      throw new Error('iterator1 和iterator2 不相等');
    }
    iterator1.next();
    iterator2.next();
  }
  alert('iterator1和iterator2相等');
};

var iterator1 = Iterator([1, 2, 3]);
var iterator2 = Iterator([1, 2, 3]);

compare(iterator1, iterator2);



// # 7.4　迭代类数组对象和字面量对象
// jQuery封装的each
$.each = function (obj, callback) {
  var value,
    i = 0,
    length = obj.length,
    isArray = isArraylike(obj);

  if (isArray) { // 迭代类数组
    for (; i < length; i++) {
      value = callback.call(obj[i], i, obj[i]);

      if (value === false) {
        break;
      }
    }
  } else {
    for (i in obj) { // 迭代object对象
      value = callback.call(obj[i], i, obj[i]);
      if (value === false) {
        break;
      }
    }
  }
  return obj;
};

// # 7.5　倒序迭代器
var reverseEach = function(ary, callback) {
  for (var l = ary.length - 1; l >= 0; l--) {
    callback(l, ary[l]);
  }
};

reverseEach([0, 1, 2], function(i, n) {
  console.log(n);
});


// # 7.6　中止迭代器
var each = function(ary, callback) {
  for (var i = 0, l = ary.length; i < l; i++) {
    if (callback(i, ary[i]) === false) {
      break;
    }
  }
};

each([1, 2, 3, 4, 5], function(i, n) {
  if (n > 3) {
    return false;
  }
  console.log(n);
});


// # 7.7　迭代器模式的应用举例
var getActiveUploadObj = function() {
  try {
    return new ActiveXObject('TXFTNActiveX.FTNUpload');
  } catch (e) {
    return false;
  }
};

var getFlashUploadObj = function() {
  if (supportFlash()) {
    var str = '<object type="application/x-shockwave-flash"></object>';
    return $(str).appendTo($('body'));
  }
  return false;
};

var getFormUploadObj = function() {
  var str = '<input name="file" type="file" class="ui-file" />';
  return $(str).appendTo($('body'));
};

var iteratorUploadObj = function() {
  for (var i = 0, fn; fn = arguments[i++];) {
    var uploadObj = fn();
    if (uploadObj !== false) {
      return uploadObj;
    }
  }
};

var getWebkitUploadObj = function(){
    // 具体代码略
};
　
var getHtml5UploadObj = function(){
    // 具体代码略
};

var uploadObj = iteratorUploadObj(getActiveUploadObj, getFlashUploadObj, getFormUploadObj);