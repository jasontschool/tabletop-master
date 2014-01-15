//condition for game being over
var endCond = function() {
    //deck.empty? and game.players.each(player.hand.empty?)
    var deck = this.deck;
    if (deck.isEmpty()) {
        return true;
    }
    for (var i in this.players) {
        var hand = this.players[i].hand;
        if (hand.isEmpty()) {
            return true;
        }   
    }
    return false;
}

//list of winning players
var winningPlayer = function() {
    var winners = new Array();
    var winner = this.players[0];
    for (var i in this.players) {
        var player = this.players[i];
        if (player.score > winner.score) {
            winner = player;
        }
    }
    winners[0] = winner;
    return winners;
}

//list of possible actions a player may take
var start = function() {
    console.log("Starting Go Fish");
}

var drawCard = function() {
    var card = this.currentPlayer.hand.drawFromDeck(this.deck);
    this.board.updateBoardLoc({name:"deckSize",text:"Remaining \ncards in \ndeck: \n\n" + this.deck.size()})
    return card;
}
var checkFour = function(card) {
    var currentHand = this.currentPlayer.hand;
    var held = currentHand.findByRank(card);
        if (held.length == 4) {
            currentHand.removeMany(held);
            this.currentPlayer.score++;
            this.updateScore();
            this.appendToStatusMessage("You got four of a kind!: " + card.rank);
        }
}
var initCheck = function(player) {
    var hand = player.hand;
    var temp = this.currentPlayer;
    this.currentPlayer = player;
    for (var i in hand.cards) {
        var card = hand.cards[i];
        var held = hand.findByRank(card);
        if (held.length == 4) {
            hand.removeMany(held);
            this.currentPlayer.score++;
            this.updateScore();
            this.appendToStatusMessage(player.name + " got four of a kind!: " + card.rank);
        }
    }


    this.currentPlayer = temp;
}
var renderHands = function() {
    for (var i in this.players) {
        var hand = this.players[i].hand;
        if (this.currentPlayer == this.players[i]) {
            hand.display({hidden:false,fun:guess});
        } else {
            hand.display({hidden:true,fun:"_noevent"});//should be hidden, turned off for debugging.
        }
    }
}
var switchPlayers = function() {
    alert("Your turn is complete. Click to end your turn, then switch players.");
    for (var i in this.players) {
        var hand = this.players[i].hand;
        hand.display({hidden:true});
    }
    this.updateStatusMessage("");
    alert("Click here to begin your turn.");
    this.nextPlayer();
}
var initialize = function() {
    //assume 2p for now.
    this.currentPlayer = this.players[0];
    if (this.players.length > 2) {alert("Sorry - we don't accept more than 2 players right now! Continuing with 2 players...");}
    var deck = new Deck();
    deck.shuffle();
    for (var i in this.players) {
        var p = this.players[i];
        p.hand = new Hand();
        p.hand.drawManyFromDeck(deck, 7);
        this.takeAction(initCheck, p);
    }
    this.players[0].hand.display({board:this.board,align:"bottom"});
    this.players[1].hand.display({board:this.board,align:"top"});
    this.takeAction(renderHands);
    
    this.deck = deck;
    this.board.createBoardLoc({x:650, y:350, width:100, height:140,name:"deckSize",text:"Remaining \ncards in \ndeck: \n\n" + deck.size()});

    this.makeStartButton("start");
}
var opponent = function() {
    if (this.currentPlayer == this.players[0]) {
        return this.players[1];
    } else {
        return this.players[0];
    }
}
var guess = function(card) { 
    //card.print();
    //console.log("GUESS!" + card.toString());
    var opponentHand = this.takeAction(opponent).hand;
    var currentHand = this.currentPlayer.hand;
    var matching = opponentHand.findByRank(card);
    if (matching.length > 0) {
        matching = opponentHand.removeMany(matching);
        this.takeAction(renderHands); //display needs to be called on every change.
        currentHand.placeMany(matching);
        this.takeAction(checkFour, card);
        this.appendToStatusMessage("CORRECT GUESS: " + card.toString());
    } else {
        var drawn = this.takeAction(drawCard);
        this.takeAction(renderHands);
        this.appendToStatusMessage("GO FISH ("+card.toString()+")! You drew a " + drawn.toString());
        this.takeAction(checkFour, drawn);
        if (card.rank == drawn.rank) {
            this.appendToStatusMessage("You get to continue!");
        } else {
            this.takeAction(switchPlayers);
        }
    }
    this.takeAction(renderHands);
    this.checkEnd();
}

var gofishParams = {
    end: endCond,
    winner: winningPlayer,
    actionLibrary: {start:start},
    numPlayers: 2,
    init: initialize
};
