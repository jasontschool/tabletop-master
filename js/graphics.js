var Graphics = function(game){
        var canvas = document.createElement("canvas");
        canvas.id = "boardCanvas";

        var self = this;

        var func = function(){ self.onCanvasClick( event ); };

        canvas.width = game.board.width;
        canvas.height = game.board.height;
        canvas.style.border = "1px solid";
        //canvas.addEventListener('click',this.onCanvasClick, false);
        canvas.addEventListener('click',func, false);
        document.body.appendChild(canvas);

        this.boardLocs = game.board.boardLocs;

        this.game = game;

        this.ctx = document.getElementById("boardCanvas").getContext('2d');
        this.ctx._images = {};
        for(loc in this.boardLocs){
                this.updateBoardloc(loc);
        }
        
        this.statusBar = new BoardLoc({size:4, color:"blue",name:"statusBar", x:5, y:5, width:game.board.width-10, height:80, text:"Player 0, please take your turn"});
        var playerScores = "";
        for (var i in game.players) {
            var player = game.players[i];
            playerScores += player.name + ": " + player.score + "\n";
        }
        playerScores = playerScores.substring(0, playerScores.length - 1);
        this.playerBox = new BoardLoc({name: "playerBox", x:game.board.width-200, y:100, width:190, height:game.board.height-80, text:playerScores});
        this.addBoardLoc(this.statusBar);
        this.addBoardLoc(this.playerBox);
};

Graphics.prototype.onCanvasClick = function(ev){
    //console.log(game);

    var x = ev.clientX - document.getElementById("boardCanvas").offsetLeft;
    var y = ev.clientY - document.getElementById("boardCanvas").offsetTop;
    //console.log("clicked the canvas at: " + x + "," + y);

    //http://forums.whirlpool.net.au/archive/495300
    var hscroll = (document.all ? document.scrollLeft : window.pageXOffset);
    var vscroll = (document.all ? document.scrollTop : window.pageYOffset);
    x = x+hscroll;
    y = y+vscroll;
    //console.log("compensating for scroll: " + x + "," + y);

    for(loc in this.boardLocs){
        //console.log(this.boardLocs);
        var boardLoc = this.boardLocs[loc];
        var minX = boardLoc.x;
        var minY = boardLoc.y;
        var maxX = boardLoc.x + boardLoc.width;
        var maxY = boardLoc.y + boardLoc.height;

        if((x >= minX && x <= maxX) && (y >= minY && y <= maxY) ){
                //console.log("clicked a BoardLoc!");
                var action = boardLoc.event;
                this.game.board.mostRecentlyClicked = boardLoc;
                if( !(action === undefined || action == "_noEvent" || action == "_noevent")){ //!(undefined) && !=_noevent) originally
                        //console.log("running Event: " + action);
                        //console.log(boardLoc);
                        //boardLoc.event();
                        this.game.takeAction(action, boardLoc);
                        return; //only trigger one boardLoc.
                }
        }
    }

}

Graphics.prototype.updateBoardLoc = function(loc){


    this.ctx.clearRect(loc.x,loc.y,loc.width,loc.height);


    if(loc.color === undefined){
        this.ctx.strokeStyle = "black";
    } else{ this.ctx.strokeStyle = loc.color; }

    if(loc.size === undefined){
        this.ctx.lineWidth = 1;
    } else{ this.ctx.lineWidth = loc.size; }

    this.ctx.strokeRect(loc.x,loc.y,loc.width,loc.height);
    this.ctx.font="16px Arial";
    if (loc.text !== undefined) {
        var text = loc.text.toString();
        var textArr = text.split("\n");
        if (loc.name == "statusBar") {
            textArr = textArr.splice(-4); //only display last four lines.
        }
        var vOffset = loc.y + 15;
        var x = loc.x + 5;
        var lineWidth = 16;
        for (var i in textArr) {
            //this.ctx.fillText(loc.text,loc.x+5,loc.y+15);   
            this.ctx.fillText(textArr[i], x, vOffset + i*lineWidth);
        }
    }
    if (loc.image != undefined) { 
        var im = new Image();
        var ctx = this.ctx;
        im.src = loc.image;
        im.onload = function() {
            ctx.drawImage(im, loc.x, loc.y, loc.width, loc.height);
        }
        this.ctx._images[loc.name] = im;
    }
        
}
//Drawing a canvas??: http://www.w3schools.com/tags/canvas_drawimage.asp

Graphics.prototype.removeBoardLoc = function(loc){
    var size = loc.size;
    if(loc.size === undefined){ size = 1;}

    this.ctx.clearRect(loc.x-0.5-size/2,loc.y-0.5-size/2,loc.width+size+1,loc.height+size+1);
    delete this.boardLocs[loc.name];//.name];
    if (this.ctx._images[loc.name]) {
        this.ctx._images[loc.name].onload = function(){};
        delete this.ctx._images[loc.name];
    }
}

Graphics.prototype.addBoardLoc = function(loc){
    this.boardLocs[loc.name] = loc; //used to be [loc.name]
    this.updateBoardLoc(loc);
}