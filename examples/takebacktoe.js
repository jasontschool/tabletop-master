var endCond = function() {
    //check rows for data
    var row = new Array();

    row[0] = this.board.boardLocGrids["grid"][0][0].data;
    row[1] = this.board.boardLocGrids["grid"][1][0].data;
    row[2] = this.board.boardLocGrids["grid"][2][0].data;
    row[3] = this.board.boardLocGrids["grid"][3][0].data;

    row.sort(function(a,b){return a - b});

    if (((row[0] == row[2]) || (row[1] == row[3])) && (!(row[0] == 0 && row[1] == 0))) {
        return true;
    }

    row[0] = this.board.boardLocGrids["grid"][0][2].data;
    row[1] = this.board.boardLocGrids["grid"][1][2].data;
    row[2] = this.board.boardLocGrids["grid"][2][2].data;
    row[3] = this.board.boardLocGrids["grid"][3][2].data;

    row.sort(function(a,b){return a - b});

    if (((row[0] == row[2]) || (row[1] == row[3])) && (!(row[0] == 0 && row[1] == 0))) {
        return true;
    }   

    return false;
}

var winningPlayer = function() {
    var row = new Array();
    var result = new Array();

    row[0] = this.board.boardLocGrids["grid"][0][0].data;
    row[1] = this.board.boardLocGrids["grid"][1][0].data;
    row[2]= this.board.boardLocGrids["grid"][2][0].data;
    row[3] = this.board.boardLocGrids["grid"][3][0].data;

    row.sort(function(a,b){return a - b});

    if ((row[0] == row[2]) || (row[1] == row[3])) {
        result.push(this.players[0]);
        return result;
    }

    row[0] = this.board.boardLocGrids["grid"][0][2].data;
    row[1] = this.board.boardLocGrids["grid"][1][2].data;
    row[2] = this.board.boardLocGrids["grid"][2][2].data;
    row[3] = this.board.boardLocGrids["grid"][3][2].data;

    row.sort(function(a,b){return a - b});

    if ((row[0] == row[2]) || (row[1] == row[3])) {
        result.push(this.players[1]);
        return result;
    }   
    console.log("error!");
    return 2;
}

var turnStart = function() {
    this.board.diceVal = this.board.die.roll()
    this.board.currentSelected = 0;
    this.board.updateBoardLoc({name:"die", text:this.board.diceVal});
    this.updateStatusMessage(this.currentPlayer.name + " please select a stack to move " + this.board.diceVal + " from.");
    this.board.updateBoardLocGrid({name:"grid", event:"firstPick", color:"black", size:1});
}

var firstPick = function() {
	if (this.board.currentSelected != this.board.mostRecentlyClicked) {
        this.board.updateBoardLocGrid({name:"grid", event:"firstPick", color:"black", size:1});
    }
    this.appendToStatusMessage(this.currentPlayer.name + " please select a stack to move " + this.board.diceVal +" to or cancel.");
	this.board.currentSelected = this.board.mostRecentlyClicked;
    var currSel = this.board.currentSelected;
    if (currSel.data < this.board.diceVal) {
        this.appendToStatusMessage("Not enough tokens at that location");
        this.board.currentSelected = 0;
    } else {
        var possib = this.board.adjacent(currSel);
        console.log(possib);
        for (var temp in possib) {
            var loc = possib[temp];
            this.board.highlight(loc.name, "green");
            this.board.updateBoardLoc({name:loc.name, event:"secondPick"});
        }
        this.board.highlight(currSel.name, "blue");
    }
}

var secondPick = function() {
    var moveTo = this.board.mostRecentlyClicked;
    var moveFrom = this.board.currentSelected;
    console.log("moveto data" + moveTo.data);
    moveTo.data += this.board.diceVal;
    console.log("moveto data after" + moveTo.data);
    moveFrom.data -= this.board.diceVal;
    this.board.updateBoardLoc({name:moveTo.name, text:moveTo.data});
    this.board.updateBoardLoc({name:moveFrom.name, text:moveFrom.data});   
    this.checkEnd();
    this.nextPlayer();    
    this.takeAction("turnStart");
    
}

var cancel = function() {
    this.board.currentSelected = 0;
    this.board.updateBoardLocGrid({name:"grid", event:"firstPick", color:"black", size:1});
    this.graphics.statusBar.text = "Player" + this.currentPlayer + " please select a stack to move " + this.board.diceVal + " from.";
}

var initialize = function() {
    this.currentSelected = undefined;
    this.currentPlayer = this.players[0]  
    this.board.createBoardLocGrid({x:300, y: 300, columns:4, rows:3, width:100, height: 100, text:0, data:0, name:"grid", event:"firstPick"});
    for (var i = 0; i < 4; i++) {
        this.board.boardLocGrids["grid"][i][1].data = 10;
        this.board.boardLocGrids["grid"][i][1].text = 10;
    }
    this.board.die = new Dice({});
    this.board.createBoardLoc({x:100, y: 400, width:50,  height: 20, name: "dietext", text:"die"});
    this.board.createBoardLoc({x:200, y: 325, width:60,  height: 20, name: "player0text", text:"Player0"});
    this.board.createBoardLoc({x:200, y: 525, width:60,  height: 20, name: "player1text", text:"Player1"});
    this.board.createBoardLoc({x:100, y: 425, width:50,  height: 50, name: "die"});
    this.board.createBoardLoc({x:100, y: 200, width:75,  height: 50, name: "cancel", event:"cancel", text:"cancel"});
    this.takeAction("turnStart");
}

var takeBackToeParams = {
    end: endCond,
    winner: winningPlayer,
    actionLibrary: {firstPick:firstPick, secondPick:secondPick, cancel:cancel, turnStart:turnStart},
    numPlayers: 2,
    init: initialize
};