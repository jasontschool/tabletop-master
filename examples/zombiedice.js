//condition for game being over
var endCond = function() {
	ended = false;
	for(var temp in this.players) {
		var player = this.players[temp];
		ended = ended || (player.score >= 13);
	}
	return ended;
}

//list of winning players
var winningPlayer = function() {
	winner = this.players[0];
	for (var temp in this.players) {
		if (this.players[temp].score > winner.score) {
			winner = this.players[temp];
		}
	}
	result = new Array();
	result.push(winner);
	return result;
}

//list of possible actions a player may take
var start = function() {
	this.currentPlayer = this.players[0];
	//this.statusUpdate(this.currentPlayer.name + "please take an action");
	this.board.createBoardLoc({x:200, y: 100, width:40, height: 35, name: "roll", text: "roll", event: "roll"});
	this.board.createBoardLoc({x:250, y: 100, width:40, height: 35, name: "stop", text: "stop", event: "stop"});
	this.board.createBoardLoc({x:100, y: 300, width:50,  height: 50, name: "die0"});
	this.board.createBoardLoc({x:200, y: 300, width:50,  height: 50, name: "die1"});
	this.board.createBoardLoc({x:300, y: 300, width:50,  height: 50, name: "die2"});
	this.board.createBoardLoc({x:500, y: 300, width:200, height: 50, name: "subtotals", text:"shotguns: " + this.board.shotguns + " \r\r\n brains: " + this.board.brains});

	this.takeAction("roll");
}

var roll = function() {
	var i = 0;
	for (die in this.board.dicebag) {
		value = this.board.dicebag[die].roll()
		this.board.updateBoardLoc({name:"die"+i, text:value})
		if (value < 3) {
			this.board.shotguns++;
		} else {
			this.board.brains++;
		}
		i++;
	}
	this.board.updateBoardLoc({name:"subtotals", text:"subtotals", text:"shotguns: " + this.board.shotguns + " brains: " + this.board.brains});
	
	if (this.board.shotguns > 2) {
		this.board.brains = 0;
		this.appendToStatusMessage(this.currentPlayer.name + " shotgun'd out and gained no brains!");
		this.takeAction("stop");
	}

}

var stop = function() {
	this.currentPlayer.updateScore(this.board.brains);
	this.updateScore();
	this.checkEnd();
	this.board.brains = 0;
	this.board.shotguns = 0;
	this.nextPlayer(); //include status update, include player change
	this.takeAction("roll");
}

var initialize = function() {
	var dice = new Array();
	dice[0] = new Dice({});
	dice[1] = new Dice({});
	dice[2] = new Dice({});
	this.board.dicebag = dice;
	this.board.shotguns = 0;
	this.board.brains = 0;

	this.makeStartButton("start");
}

var zombieDiceParams = {
	end: endCond,
	winner: winningPlayer,
	actionLibrary: {endCond:endCond, start:start, roll:roll, stop:stop},
	numPlayers: 3,
	init: initialize
};