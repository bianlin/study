// # 命令模式
// # 9.2　命令模式的例子——菜单程序

// 模拟传统面向对象语言的命令模式实现
/**
<body>
    <button id="button1">点击按钮1</button>
    <button id="button2">点击按钮2</button>
    <button id="button3">点击按钮3</button>
</body>

<script>
    var button1 = document.getElementById( 'button1' ),
    var button2 = document.getElementById( 'button2' ),
    var button3 = document.getElementById( 'button3' );
</script>
 */

var setCommand = function (button, command) {
  button.onclick = function () {
    command.execute();
  }
};

var MenuBar = {
  refresh: function () {
    console.log('刷新菜单目录');
  }
};

var SubMenu = {
  add: function () {
    console.log('增加子菜单');
  },
  del: function () {
    console.log('删除子菜单');
  }
};

var RefreshMenuBarCommand = function (receiver) {
  this.receiver = receiver;
};

RefreshMenuBarCommand.prototype.execute = function () {
  this.receiver.refresh();
};

var AddSubMenuCommand = function (receiver) {
  this.receiver = receiver;
};

AddSubMenuCommand.prototype.execute = function () {
  this.receiver.add();
};

var DelSubMenuCommand = function (receiver) {
  this.receiver = receiver;
};

DelSubMenuCommand.prototype.execute = function () {
  console.log('删除子菜单');
};

var refreshMenuBarCommand = new RefreshMenuBarCommand( MenuBar );
var addSubMenuCommand = new AddSubMenuCommand( SubMenu );
var delSubMenuCommand = new DelSubMenuCommand( SubMenu );

setCommand( button1, refreshMenuBarCommand );
setCommand( button2, addSubMenuCommand );
setCommand( button3, delSubMenuCommand );


// # 9.3　JavaScript中的命令模式
var bindClick = function(button, func) {
  button.onclick = func;
};
var MenuBar = {
  refresh: function() {
    console.log('刷新菜单界面');
  },
};
var SubMenu = {
  add: function(){
    console.log( '增加子菜单' );
  },
  del: function(){
    console.log( '删除子菜单' );
  }
};

bindClick( button1, MenuBar.refresh );
bindClick( button2, SubMenu.add );
bindClick( button3, SubMenu.del );