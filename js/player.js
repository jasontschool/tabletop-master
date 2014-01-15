var Player = function(params) {
	if (params === undefined) {params = {};}
	this.id = params.id;
	this.name = params.name;
	//this.myBox = new PlayerBox({id=id, owner = this});
	this.score = 0;
	this.hand = new Array();
}

Player.prototype.updateScore = function(n) {
	this.score += n;
}