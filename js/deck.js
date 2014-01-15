/*
    Basic Deck class.
*/

var Deck = function(params) {
    if (params === undefined) {params = {};}
    if (params.cards === undefined) {
        var cards = new Array();
        var suits = ["S", "H", "C", "D"]
        for (var i = 0; i < suits.length; i++) {
            for (var r = 1; r <= 13; r++) {
                cards.push(new Card({rank:r,suit:suits[i]}));
            }
        }
        this.cards = cards;
    } else {
        this.cards = params.cards;
     }
}
/* Credit: http://sedition.com/perl/javascript-fy.html */
Deck.prototype.shuffle = function() {
    var i = this.cards.length;
    if ( i == 0 ) return false;
    while ( --i ) {
        var j = Math.floor( Math.random() * ( i + 1 ) );
        var tempi = this.cards[i];
        var tempj = this.cards[j];
        this.cards[i] = tempj;
        this.cards[j] = tempi;
    }
}


Deck.prototype.isEmpty = function() {
    return this.cards.length == 0;
}   
Deck.prototype.empty = function() {
    return this.isEmpty();
}
Deck.prototype.size = function() {
    return this.cards.length;
}
Deck.prototype.contains = function(card) {
    var cardString = null;
    if (typeof(card) == "string") {
        cardString = card;
    } else {
        cardString = card.toString();
    }
    for (var i in this.cards) {
        if (cardString == this.cards[i].toString()) {
            return true;
        }
    }
    return false;
}
Deck.prototype.findByRank = function(card) {
    var results = new Array();
    for (var i in this.cards) {
        if (card.rank == this.cards[i].rank) {
            results.push(this.cards[i]);
        }
    }
    return results;
}
Deck.prototype.findBySuit = function(card) {
    var results = new Array();
    for (var i in this.cards) {
        if (card.suit == this.cards[i].suit) {
            results.push(this.cards[i]);
        }
    }
    return results;
}
Deck.prototype.draw = function() {
    return this.drawFromTop();
}
Deck.prototype.drawMany = function(n) {
    var result = new Array();
    for (var i = 0; i < n; i ++) {
        result[i] = this.draw();
    }
    return result;
}
Deck.prototype.drawFromTop = function() {
    return this.cards.pop();
}
Deck.prototype.drawFromBottom = function() {
    return this.cards.shift();
}
Deck.prototype.place = function(card) {
    this.placeAtTop(card);
}
Deck.prototype.placeMany = function(cards) {
    for (var i in cards) {
        this.place(cards[i]);
    }
}
Deck.prototype.placeAtTop = function(card) {
    this.cards.push(card);
}
Deck.prototype.placeAtBottom = function(card) {
    this.cards.unshift(card);
}
Deck.prototype.peek = function() {
    return this.peekTop();
}
Deck.prototype.peekTop = function() {
    return this.cards[this.cards.length-1];
}
Deck.prototype.peekBottom = function() {
    return this.cards[0];
}
Deck.prototype.remove = function(card) {
    var cardString = null;
    if (typeof(card) == "string") {
        cardString = card;
    } else {
        cardString = card.toString();
    }
    for (var i in this.cards) {
        if (cardString == this.cards[i].toString()) {
            var temp =  this.cards[i];
            this.cards.splice(i, 1);
            return temp;

        }
    }
}
Deck.prototype.removeMany = function(cards) {
    var results = new Array();
    for (var i in cards) {
        var temp = this.remove(cards[i]);
        if (temp) {
            results.push(temp);
        }
    }
    return results;
}

Deck.prototype.toString = function() {
    return this.cards.toString();
}
Deck.prototype.print = function() {
    console.log(this.toString());
}