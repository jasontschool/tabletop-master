/*
    Hand class. This is simply a subclass of deck, 
    as most of the options are the same.
*/
var Hand = function(){
    this.cards = new Array();
    //
}
Hand.prototype = new Deck({cards:"Varies by hand"});

Hand.prototype.constructor = Hand;
Hand.prototype.drawFromDeck = function(deck) {
    var card = deck.draw();
    if (card) {this.place(card);}
    return card;
}
Hand.prototype.drawManyFromDeck = function(deck, n) {
    var results = new Array();
    for (var i = 0; i < n; i ++) {
        var card = this.drawFromDeck(deck);
        if (card) {results.push(card);}
        else {return results;} //no more cards.
    }
    return results;
}
Hand.prototype.display = function(params) {
    if (this._displayParams === undefined) {
        this._displayParams = {};
    }
    if (params === undefined) {
        params = this._displayParams;
    } else {
        for (var i in params) {
            this._displayParams[i] = params[i];
        }
    }
    var board = this._displayParams.board;
    if (this.displayLocs) {
        for (var i in this.displayLocs) {
            board.removeBoardLoc(this.displayLocs[i]);
        }
    } 
    this.displayLocs = new Array()

    var coords = this._displayParams.coords || {};
    coords.align = this._displayParams.align || "bottom";
    this._render(coords, board, this._displayParams.hidden, this._displayParams.fun);
    //var horizontal
}
//CARD PACK CREDIT: http://www.ironstarmedia.co.uk/2010/01/free-game-assets-08-playing-card-pack/
Hand.prototype._render = function(coords, board, hidden, fun) {
    var spacing = 5;
    if (coords.topLeft === undefined || coords.bottomRight === undefined
        || coords.topLeft.x === undefined || coords.topLeft.y === undefined
        || coords.bottomRight.x === undefined || coords.bottomRight.y === undefined) {
        var topLeft = { x:spacing, 
                        y:board.height - 110};
        var bottomRight = { x:board.width - spacing - 200,//200 for playerBox
                            y:board.height - 10};
                            
        if (coords.align == "top") {
            topLeft.y = 100;
            bottomRight.y = 200;
        }
        coords.topLeft = topLeft;
        coords.bottomRight = bottomRight;
    } 

    var numCards = this.size();
    var heightFactor = 1.4 //height as a multiple of width

    var totalWidth = coords.bottomRight.x - coords.topLeft.x;
    var totalHeight = coords.bottomRight.y - coords.topLeft.y;
    //console.log("Dimensions: " + totalWidth + ", " + totalHeight);
    var cardWidth = ((totalWidth + spacing) / (numCards)) - spacing;
    var cardHeight = totalHeight;
    cardWidth = Math.floor(Math.min(cardWidth, 80)); //maximum width
    cardHeight = cardWidth * heightFactor;
    if (cardHeight > totalHeight) {
        cardHeight = totalHeight;
        cardWidth = Math.floor(cardHeight / heightFactor)
    }
    //console.log("CardWidth: " + cardWidth);
    var x = coords.topLeft.x;
    var y = coords.topLeft.y;
    for (var i in this.cards) {
        var card = this.cards[i];
        var text = hidden ? "???": card.toString();
        var cardFunction = "_noevent"; 
        if (fun && fun != "_noevent") {
            cardFunction = function(card){
                return function(boardLoc) {
                    return board.game.takeAction(fun,card);
                };
            }(card)
        }
        var img = "images/Cards/";
        if (hidden) {
            img += "back.png";
        } else {
            img += card.suit;
            if (card.rank < 10) {img += "0";}
            img += card.rank + ".png";
            img = img.toLowerCase();
        }
        var bloc = board.createBoardLoc({
            x:x, y:y, width:cardWidth, height:cardHeight,
            name:card.toString(),text:text,
            event:cardFunction,data:card,
            image:img
        })
        card.boardLoc = bloc;
        x += cardWidth + spacing;
        this.displayLocs.push(bloc);
    }
}