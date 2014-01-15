var GameDriver = function(){};

GameDriver.prototype.PlayerClass = Player;
GameDriver.prototype.BoardClass = Board;
GameDriver.prototype.GraphicsClass = Graphics;


/*createAndPlay takes in a set of parameters:
end: a function that is called to check if the game has reached its end state
winner: a function that is called to select and return the ids of the winning player(s)
actionLibrary: a dict of all possible actions (as functions), referenced by name {movePiece:function(p, x, y), attackPiece:function(p)}
numPlayers: number of players in the game
init: a function of how to initialize the game

*/
GameDriver.createAndPlay = function(params, game) {
	var g = GameDriver.createGame(params, game);
	document.addEventListener("DOMContentLoaded", (function(){g._setupAndPlay();}), false);
	return g;
}

GameDriver.createGame = function(params, game) {
	if (game === undefined) {
		console.log("Using default GameDriver");
		var game = GameDriver;
	}
	var G = function() {};
	G.prototype = new game;
	//console.log("game: " + game);
	//console.log("G: " + G);
	//console.log("G.prototype: " + G.prototype);
	G.prototype.constructor = G;
	var g = new G();
	var i;
	for (i in params) {
		//console.log("i: " + i);
		g[i] = params[i]
	}
	//console.log(g.init);
	return g;
}

GameDriver.prototype._setupAndPlay = function() {
	//console.log("RUNNING _setupAndPlay!");
	this.board = this.generateBoard();
	this.players = this.generatePlayers();
	//this.generateComponents();
	this.graphics = new Graphics(this);

	this.init();
}

GameDriver.prototype.actionLibrary = new Array();
GameDriver.prototype.players = new Array();
GameDriver.prototype.currentPlayer = new Player();

GameDriver.prototype.nextPlayer = function() {
	var currid = (this.currentPlayer.id + 1) % this.numPlayers;
	this.currentPlayer = this.players[currid];
	this.appendToStatusMessage("Player " + currid + ", please take your turn");
}

GameDriver.prototype.generateBoard = function() {
	return new this.BoardClass(this);
} 

GameDriver.prototype.makeStartButton = function(event) {
	//alert("Click OK to start the game!");
	this.takeAction(event);
}

GameDriver.prototype.generatePlayers = function() {
	// takes in dictionary of {id : player} and creates new Player objects for each of these.
	var playerlist = new Array();
	for (var id = 0; id < this.numPlayers; id++) {
		var playerName = "Player" + id;
		playerlist.push(new this.PlayerClass({id : id, name : playerName}))
	}
	//console.log("players are" + playerlist[0].name);
	return playerlist;
}

GameDriver.prototype.takeAction = function(action, params) {
	//console.log("taking action " + action);
	if (typeof(action) == "function") {
		this._temp = action;
	} else {
		this._temp = this.actionLibrary[action];
	}
	if (params === undefined) {
		return this._temp();
	} else {
		return this._temp(params);
	}
}

GameDriver.prototype.checkEnd = function() {
	ended = this.end();
	if (ended) {
		//report winners
		var winners = this.winner()
		for (var temp in winners) {
			console.log(temp);
			console.log(winners);
			var player = winners[temp];
			this.appendToStatusMessage(player.name + " has won with " + player.score + " points!");
		}
		alert("The game has ended");
	}
}

GameDriver.prototype.updateStatusMessage = function(str) {
	this.graphics.statusBar.text = str;
	this.graphics.updateBoardLoc(this.graphics.statusBar);
}
GameDriver.prototype.getStatusMessage = function() {
	return this.graphics.statusBar.text;
}
//Appends with a newline.
//
GameDriver.prototype.appendToStatusMessage = function(str) {
	var temp = this.graphics.statusBar.text;
	if (temp != "") {
		temp += "\n";
	}
	str = temp + str;
	this.updateStatusMessage(str);
}

GameDriver.prototype.updateScore = function() {
    var playerScores = "";
    for (var i in this.players) {
        var player = this.players[i];
        playerScores += player.name + ": " + player.score + "\n";
    }
    playerScores = playerScores.substring(0, playerScores.length - 1);
    var temp = this.graphics.playerBox
    temp.text = playerScores;
    this.graphics.updateBoardLoc(temp);
}