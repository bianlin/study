// 中介者模式
//# 14.2　中介者模式的例子——泡泡堂游戏
function Player (name) {
	this.name = name;
	this.enemy = null;
}

Player.prototype.win = function () {
	console.log(this.name + ' won ');
};

Player.prototype.lose = function () {
	console.log(this.name + ' lost ');
};

Player.prototype.die = function () {
	this.lose();
	this.enemy.win();
};

//var player1 = new Player('皮蛋');
//var player2 = new Player('小乖');
//
//player1.enemy = player2;
//player2.enemy = player1;
//
//player1.die();


// # 14.2.1　为游戏增加队伍
var players = [];

function Player (name, teamColor) {
	this.partners = [];
	this.enemies = [];
	this.state = 'live';
	this.name = name;
	this.teamColor = teamColor;
}

Player.prototype.win = function () {
	console.log(' winner: ' + this.name);
};

Player.prototype.lose = function () {
	console.log(' loser: ' + this.name);
};

Player.prototype.die = function () {
	var all_dead = true;
	this.state = 'dead';
	
	for (var i = 0, partner; partner = this.partners[i++];) {
		if (partner.state !== 'dead') {
			all_dead = false;
			break;
		}
	}
	
	if (all_dead === true) {
		this.lose();
		for (var i = 0, partner; partner = this.partners[i++];) {
			partner.lose();
		}
		for (var i = 0, enemy; enemy = this.enemies[i++];) {
			enemy.win();
		}
	}
};

var playerFactory = function (name, teamColor) {
	var newPlayer = new Player(name, teamColor);
	
	for (var i = 0, player; player = players[i++];) {
		if (player.teamColor === newPlayer.teamColor) {
			player.partners.push(newPlayer);
			newPlayer.partners.push(player);
		} else {
			player.enemies.push(newPlayer);
			newPlayer.enemies.push(player);
		}
	}
	players.push(newPlayer);
	return newPlayer;
}

//红队：
//var player1 = playerFactory( '皮蛋', 'red' ),
//	player2 = playerFactory( '小乖', 'red' ),
//	player3 = playerFactory( '宝宝', 'red' ),
//	player4 = playerFactory( '小强', 'red' );
//
//蓝队：
//var player5 = playerFactory( '黑妞', 'blue' ),
//	player6 = playerFactory( '葱头', 'blue' ),
//	player7 = playerFactory( '胖墩', 'blue' ),
//	player8 = playerFactory( '海盗', 'blue' );
//
//
//player1.die();
//player2.die();
//player4.die();
//player3.die();

//14.2.3　用中介者模式改造泡泡堂游戏

function Player(name, teamColor) {
	this.name = name;
	this.teamColor = teamColor;
	this.state = 'alive';
}

Player.prototype.win = function () {
	console.log( this.name + ' won ' );
};
Player.prototype.lose = function () {
	console.log( this.name + ' lost ' );
};
/*******************玩家死亡*****************/
Player.prototype.die = function () {
	this.state = 'dead';
	playerDirector.ReceiveMessage('playerDead', this);
};
/*******************移除玩家*****************/
Player.prototype.remove = function () {
	playerDirector.ReceiveMessage('removePlayer', this);
};
/*******************玩家换队*****************/
Player.prototype.changeTeam = function( color ){
	playerDirector.ReceiveMessage('changeTeam', this, color );   // 给中介者发送消息，玩家换队
};

var playerDirector = (function () {
	var players = {};
	var operations = {};
	/****************新增一个玩家***************************/
	operations.addPlayer = function (player) {
		var teamColor = player.teamColor;
		players[teamColor] = players[teamColor] || [];
		players[teamColor].push(player);
	};
	/****************移除一个玩家***************************/
	operations.removePlayer = function (player) {
		var teamColor = player.teamColor;
		var teamPlayers = players[teamColor];
		for (var i = teamPlayers.length - 1; i >= 0; i--) {
			if (teamPlayers[i] === player) {
				teamPlayers.splice(i, 1);
			}
		}
	};
	/****************玩家换队***************************/
	operations.changeTeam = function (player, newTeamColor) {
		operations.removePlayer(player);
		player.teamColor = newTeamColor;
		operations.addPlayer(player);
	};
	/****************玩家死亡***************************/
	operations.playerDead = function (player) {
		var teamColor = player.teamColor;
		var teamPlayers = players[teamColor];
		
		var all_dead = true;
		for (var i = 0, player; player = teamPlayers[i++];) {
			if (player.state !== 'dead') {
				all_dead = false;
				break;
			}
		}
		
		if (all_dead) {
			for (var i = 0, player; player = teamPlayers[i++];) {
				player.lose();
			}
			
			for (var color in players) {
				if (color !== teamColor) {
					var teamPlayers = players[color];
					for (var i = 0, player; player = teamPlayers[i++];) {
						player.win();
					}
				}
			}
		}
	};
	
	var ReceiveMessage = function () {
		var message = Array.prototype.shift.call(arguments);
		operations[message].apply(this, arguments);
	};
	
	return {
		ReceiveMessage: ReceiveMessage,
	};
})();


var playerFactory = function (name, teamColor) {
	var newPlayer = new Player(name, teamColor);
	playerDirector.ReceiveMessage('addPlayer', newPlayer);
	return newPlayer;
};

// 红队：
var player1 = playerFactory( '皮蛋', 'red' ),
	player2 = playerFactory( '小乖', 'red' ),
	player3 = playerFactory( '宝宝', 'red' ),
	player4 = playerFactory( '小强', 'red' );

// 蓝队：
var player5 = playerFactory( '黑妞', 'blue' ),
	player6 = playerFactory( '葱头', 'blue' ),
	player7 = playerFactory( '胖墩', 'blue' ),
	player8 = playerFactory( '海盗', 'blue' );

player1.die();
player2.die();
player3.die();
player4.die();















