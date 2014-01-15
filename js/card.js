/*
    Basic card class.
*/

var Card = function(params) {
    if (params === undefined) {params = {};}
    this.rank = params.rank || 1
    this.suit = params.suit || "S"
}

/* May be removed soon. */
Card.prototype.compareTo = function(card) {
    if (this.rank < card.rank) {
        return -1;
    } else if (this.rank == card.rank) {
        return 0;
    } else {
        return 1;
    }
}

Card.prototype.isFaceCard = function () {
    return this.rank == 11 || this.rank == 12 || this.rank == 13;
}

Card.prototype.rankValue = function() {
    switch(this.rank) {
        case 1:
            return "A";
        case 11:
            return "J";
        case 12:
            return "Q";
        case 13:
            return "K";
        default:
            return this.rank.toString();
    }
}

Card.prototype.toString = function() {
    return this.rankValue() + this.suit;
}
Card.prototype.print = function() {
    console.log(this.toString());
}