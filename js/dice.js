/*
    The dice class.
    By default, standard 6-sided die are used.
*/

//params should be a dictionary.
var Dice = function(params) {
    if (params === undefined) {params = {};}
    this.sides = params.sides || 6;
    //console.log("creating" + this.sides + "sided die");
}

Dice.prototype.roll = function() {
    return Math.ceil(Math.random() * this.sides)
}
Dice.prototype.rollMany = function(n) {
    var results = new Array();
    for (var i = 0; i < n; i++) {
        results[i] = this.roll();
    }
    return results;
}