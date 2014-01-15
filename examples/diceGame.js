var roll = function() {
	this.board.value = this.board.die.roll();
	this.board.updateBoardLoc({name:"die", text:this.board.value});
	this.players[0].score++;
    this.updateScore(); 
	this.checkEnd(); }

var start = function() {
	this.board.createBoardLoc({x:400, y: 200, width:40, height: 35, name: "roll", text: "roll", event: "roll"});
	this.board.createBoardLoc({x:400, y: 500, width:50,  height: 50, name: "die"});
	this.takeAction("roll"); }

var diceGameParams = {
	end: function(){ return this.board.value == 6;},
	winner: function(){ return 0;},
	actionLibrary: {start:start, roll:roll},
	numPlayers: 1,
	init: function(){ this.board.die = new Dice({sides:20}); this.takeAction("start");} };