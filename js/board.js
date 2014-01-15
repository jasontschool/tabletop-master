var Board = function(game) {
	this.boardLocs = {};
	this.boardLocGrids = {};
	this.game = game;
	this.width = 1000;
	this.height = 800;
}

//boardLocs stores x, y, width, height, name, text, image, event
var BoardLoc = function(params) {
	this.x = params.x;
	this.y = params.y;
	this.width = params.width;
	this.height = params.height;
	this.name = params.name;
	this.text = params.text;
	this.image = params.image;
	this.event = params.event;
	this.size = params.size;
	this.color = params.color;
	this.data = params.data;

	this.i = params.i;
	this.j = params.j;
}

Board.prototype.createBoardLoc = function(params) {
	if (params === undefined) {params = {};}
	if (params.x === undefined || params.y === undefined || params.name === undefined) {
		console.log("error!");
	}
	if (params.text === undefined) {params.text = "";}
	if (params.event === undefined) {params.event = "_noevent";}
	if (params.i === undefined || params.j === undefined) {
		params.i = -1;
		params.j = -1;
	}

	//console.log("this.boardLocs" + this.boardLocs);
	this.boardLocs[params.name] = new BoardLoc(params);
	
	this.game.graphics.addBoardLoc(this.boardLocs[params.name]);
	return this.boardLocs[params.name]; //JT - NOW RETURNS THE BOARDLOC.
}

Board.prototype.updateBoardLoc = function(params) {
	if (params.name === undefined) {
		console.log("error!");
	}
	for(param in params) {
		if (!(param === undefined)) {
			this.boardLocs[params.name][param] = params[param];
		}
	}
	this.game.graphics.updateBoardLoc(this.boardLocs[params.name]);
}

Board.prototype.removeBoardLoc = function(loc) {
	this.game.graphics.removeBoardLoc(loc);
}

//takes in x, y, columns, rows, width, height, text, event, name) 

Board.prototype.createBoardLocGrid = function(params) {
	this.boardLocGrids[params.name] = new Array();
	this.boardLocGrids[params.name].columns = params.columns;
	this.boardLocGrids[params.name].rows = params.rows;	
	for (var i = 0; i < params.columns; i++) {
		this.boardLocGrids[params.name][i] = new Array();
		for(var j = 0; j < params.rows; j++) {
			xval = params.x + params.width * i;
			yval = params.y + params.height * j;
			nameval = params.name + i + j;
			this.createBoardLoc({x:xval, y:yval, width:params.width, height:params.height, text:params.text, event:params.event, name:nameval, data:params.data, i:i, j:j});
			this.boardLocGrids[params.name][i][j] = this.boardLocs[nameval];
		}
	}
}

Board.prototype.updateBoardLocGrid = function(params) {
	if (params.name === undefined) {
		console.log("error!");
	}
	var gridname = params.name
	for (var i = 0; i < this.boardLocGrids[gridname].columns; i++) {
		for(var j = 0; j < this.boardLocGrids[gridname].rows; j++) {
			params.name = gridname + i + j;
			this.updateBoardLoc(params);
		}
	}
}

//createBoardLoc(x, y, width, height, name, text, image, event)

Board.prototype.adjacent = function(loc) {
	var re = /([^\d])*/;
	var gridname = re.exec(loc.name)[0];
	var columns = this.boardLocGrids[gridname].length;
	var rows = this.boardLocGrids[gridname][0].length;
	//TODO: figure out i and j of loc
	var i = loc.i;
	var j = loc.j;

	var result = new Array();

	if (i-1>=0) {
		result.push(this.boardLocGrids[gridname][i-1][j]);
	}
	if (i+1<columns) {
		result.push(this.boardLocGrids[gridname][i+1][j]);
	}
	if (j-1>=0) {
		result.push(this.boardLocGrids[gridname][i][j-1]);
	}
	if (j+1<rows) {
		result.push(this.boardLocGrids[gridname][i][j+1]);
	}
	return result;
}

Board.prototype.highlight = function(name, color) {
	this.boardLocs[name].color = color;
	this.boardLocs[name].size = 5;
	this.game.graphics.updateBoardLoc(this.boardLocs[name]);
}