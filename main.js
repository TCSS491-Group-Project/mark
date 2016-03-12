function Circle3d(game, x, y, radius) {
    this.radius = radius;
    this.circle = false;
    this.boundingcircle = new BoundingCircle(x, y, radius);
    Entity.call(this, game, x, y);
};

Circle3d.prototype = new Entity();
Circle3d.prototype.constructor = Circle3d;

Circle3d.prototype.collide = function(rect) {
    var x = Math.abs(this.x - (rect.x + (rect.width/2)));
    var y = Math.abs(this.y - (rect.y + (rect.height/2)));

    //console.log(x); console.log(this.x + this.radius);
    if(x > ((rect.width/2) + this.radius)) {
        //console.log("1");
        return false;
    };

    if(y > ((rect.height/2) + this.radius)) { 
        //console.log("2");
        return false;
    };

    if(x <= (rect.width/2)) {
        //console.log("3"); 
        return true;
    };
    if(y <= (rect.height/2)) {
        //console.log("4"); 
        return true;
    };

    var sqx = (x - (rect.width/2)); var sqy = (y - (rect.height/2));
    var corner = (sqx *sqx) + (sqy *sqy);

    return (corner <= ((this.radius)*(this.radius)));
    
    //return x;

};

//var temp = 0;

Circle3d.prototype.update = function () {
	if(this.game.screenOff) return;
    Entity.prototype.update.call(this);


    var speedIncreament = 2;
    var MaxSpeed = 8;
    var padding = 9;


    var ballRotationSpeed = 0.10;

    if(this.game.walkRight){

    	if(!this.game.screenOff){
	        this.game.tx += speedIncreament;
	        if(this.game.tx > MaxSpeed){
	            this.game.tx = MaxSpeed;
	        }
    	}

        //rotate ball right
        var xAxis = new THREE.Vector3(0,1,0);
        
        var x = ballRotationSpeed;       

        //create a new bounding circle with padding so that the maze will be able to move
        this.boundingcircle = new BoundingCircle(this.x + padding, this.y, this.radius);
        var playCoinSound = false;
        var playShockSound = false;
        for (var i = 0; i < this.game.mazePieces.length; i++) {
            var pf = this.game.mazePieces[i];

            if (this.boundingcircle.collide(pf.boundingbox)) { 
                if(!pf.trap && !pf.exit) {
                	this.game.tx = 0;
                    x = 0;
                } else if(pf.isCoin){
                	this.game.totCoins++;
                	pf.isCoin = false;
                	pf.removeFromWorld = true;
                	playCoinSound = true;
//                	pf.coinSnd.play();
                	
                } else if(pf.exit) {
                    this.game.tx = 0;
                    this.game.ty = 0;
                	this.game.level += 1;
                    this.game.screenOff = true;
                    if(this.game.muteSoundfx) (ASSET_MANAGER.getAudioAsset("./song/exitSnd.wav")).play(); 
                	nextLevel(++(this.game.mazeSize), this.game);
                    
                }
            } 
            //this.collide(pf.boundingbox);
            //console.log(this.collide(pf.boundingbox));
        
        };
        
                //update the position of the 3d ball
        rotateAroundWorldAxis(mesh, xAxis, x);

    } else if(this.game.walkLeft){

        //move the maze
    	if(!this.game.screenOff) {
	        this.game.tx -= speedIncreament;
	        if(this.game.tx < -(MaxSpeed)){
	            this.game.tx = -(MaxSpeed);
	        }
    	}

        //rotate ball left
        var xAxis = new THREE.Vector3(0,1,0);
        var x = - (ballRotationSpeed);     

        //create a new bounding circle with padding so that the maze will be able to move
        this.boundingcircle = new BoundingCircle(this.x - padding, this.y, this.radius);

        for (var i = 0; i < this.game.mazePieces.length; i++) {
            var pf = this.game.mazePieces[i];

            
            if (this.boundingcircle.collide(pf.boundingbox)) { 
            	if(!pf.trap) {
            		this.game.tx = 0;
                    x = 0; 
            	} else if(pf.isCoin){
            		this.game.totCoins++;
                	pf.isCoin = false;
                	pf.removeFromWorld = true;
                	playCoinSound = true;
//                	pf.coinSnd.play();
                } 
            } 
        
        };

        //update the position of the 3d ball
        rotateAroundWorldAxis(mesh, xAxis, x);
    }
    if(this.game.goUp){

        //move the maze
    	if(!this.game.screenOff){
	        this.game.ty -= speedIncreament;
	        if(this.game.ty < - (MaxSpeed)){
	            this.game.ty = - (MaxSpeed);
	        }
    	}

        //rotateball up
        var xAxis = new THREE.Vector3(1,0,0);
        y = - (ballRotationSpeed);
        

        //create a new bounding circle with padding so that the maze will be able to move
        this.boundingcircle = new BoundingCircle(this.x, this.y - padding, this.radius);

        for (var i = 0; i < this.game.mazePieces.length; i++) {
            var pf = this.game.mazePieces[i];
            //console.log("coin: " + pf.isCoin);

            if (this.boundingcircle.collide(pf.boundingbox)) { 

                if(!pf.trap) {
                    this.game.ty = 0;
                    y = 0;
                } else if(pf.isCoin){
                    this.game.totCoins++;
                    pf.isCoin = false;
                    pf.removeFromWorld = true;
                    playCoinSound = true;
//                    pf.coinSnd.play();
                } 

            } 
            //console.log(this.collide(pf.boundingbox));
        
        };

        //update ball
        rotateAroundWorldAxis(mesh, xAxis, y);
    } else if(this.game.goDown){

        //move the maze
    	if(!this.game.screenOff) {
	        this.game.ty += speedIncreament;
	        if(this.game.ty > MaxSpeed){
	            this.game.ty = MaxSpeed;
	        }
    	}

        //rotateball down
        var xAxis = new THREE.Vector3(1,0,0);
        var y = ballRotationSpeed;  

        //create a new bounding circle with padding so that the maze will be able to move
        this.boundingcircle = new BoundingCircle(this.x, this.y + padding, this.radius);

        for (var i = 0; i < this.game.mazePieces.length; i++) {
            var pf = this.game.mazePieces[i];

            
            if (this.boundingcircle.collide(pf.boundingbox)) { 
            	if(!pf.trap) {
            		this.game.ty = 0; 
                    y = 0;
            	} else if(pf.isCoin){
            		this.game.totCoins++;
                	pf.isCoin = false;
                	pf.removeFromWorld = true;
                	playCoinSound = true;
//                	pf.coinSnd.play();
                } 
            } 
        };

        //update 3d ball
        rotateAroundWorldAxis(mesh, xAxis, y);
    } 

    if(this.game.payPath && this.game.totCoins >= 7){ //TODO coins to cash
    	this.game.totCoins -= 7;
        //reset the enities color back to transparent
        for(var i = 0; i < this.game.entities.length; i++) {
            var temp = this.game.entities[i];
            if(temp instanceof(testMazePath)) {
                //console.log("column " + temp.row + "row " + temp.column);
                temp.color = 1;
            }
        }

        var pf = this.game.mazePieces[0];
        var r, c;

        if(pf.x >= 175){
            c = 1;
        } else {
            c = Math.floor((185 + 175 - (pf.x)) / 175);
        }
        if(pf.y >= 265){
            r = 0;
        } else {
            r = Math.floor((265 + 175 - pf.y) / 175);
        }
        
        
        //solve the path in respect to where you are
        pathSolver(this.game, r, c);
        var done = 0;
        var start = null;
        for(var t = 0; t < this.game.entities.length && !done; t++){
            var cp = this.game.entities[t];
            if(cp instanceof(testMazePath) && cp.row === r && cp.column ===c){
            	start = cp;
            	done = true;
            	cp.visited = true;
            }
        }
        done = false;
        start.color = 1;
        while(done !== this.game.entities.length) {
        	var tempDone = false;
        	for(var i = 0; i < this.game.entities.length && !tempDone; i++) {
        		var cp = this.game.entities[i];
        		if(cp instanceof(testMazePath) && cp.row === r - 1 && cp.column ===c && cp.color === 0 && !cp.visited){
        			//North
        			cp.color = 0;
        			r = r - 1;
        			tempDone = true;
        			cp.visited = true;
        		} else if(cp instanceof(testMazePath) && cp.row === r + 1 && cp.column ===c && cp.color === 0 && !cp.visited){
        			//South
        			cp.color = 2;
        			 r = r + 1;
        			tempDone = true;
        			cp.visited = true;
        		} else if(cp instanceof(testMazePath) && cp.row === r && cp.column === c - 1 && cp.color === 0 && !cp.visited){
        			// East
        			cp.color = 3;
        			 c = c - 1;
        			tempDone = true;
        			cp.visited = true;
        		} else if(cp instanceof(testMazePath) && cp.row === r && cp.column === c + 1 && cp.color === 0 && !cp.visited){
        			// West
        			cp.color = 4;
        			 c = c + 1;
        			 tempDone = true;
        			 cp.visited = true;
        		} 
        		
        	}
        	done++;
        }
//        
//        for(var t = 0; t < game.entities.length; t++){
//            var cp = game.entities[t];
//            if(cp instanceof(testMazePath) && cp.row === r && cp.column ===c){
//        console.log("r " + r + " c " + c);
//        console.log("x " + pf.x + " y " + pf.y);
        
        this.game.payPath = false;
    } else if(this.game.payPath) {
    	this.game.payPath = false;
    }
    
    if(this.game.disableTrap && this.game.totCoins >= 2){
//    	console.log("disable trap");
    	this.game.totCoins -= 2;
    	this.game.trapTime = 15;
    	this.game.startTrapTime = true;
    	this.game.stopTraps = true;
    	this.game.disableTrap = false; // TODO timer trap
    } else if(this.game.disableTrap) {
    	this.game.disableTrap = false;
    }
    if(playCoinSound && this.game.muteSoundfx) {
    	this.game.coinSnd.play();
    	playCoinSound = false;
    	this.game.coinSnd.currentTime  = 0;
    }
    
    //remove the ball from being stuck
    var nudge = document.getElementById("nudge");
    var that = this;
    nudge.onclick = function() {

        for (var i = 0; i < that.game.mazePieces.length; i++) {
            var pf = that.game.mazePieces[i];
            if(that.boundingcircle.collide(pf.boundingbox) && !(pf instanceof(Coin)) && !pf.isTrap && !pf.desactivated){
               
                //console.log("Maze " + pf.y);
            	// console.log("Mz x: " + pf.x + " Mz width: " + pf.width);
            	// console.log("Cir x: " + that.x + " Cir radius: " + that.radius);
                if(pf.x < that.x) {//stuck at left
                     console.log("stuck right");
                    for(var i = 0; i < that.game.entities.length; i++) {
                        var temp = that.game.entities[i];

                        if(!(temp instanceof(Circle3d))) {
                            temp.x -= 30;
                        }
                    }
                } else if( pf.x > that.x) {//stuck at right
                     console.log("stuck left");
                    for(var i = 0; i < that.game.entities.length; i++) {
                        var temp = that.game.entities[i];

                        if(!(temp instanceof(Circle3d))) {
                            temp.x += 30;
                        }
                    }
                } 
                if(pf.y < that.y){//stuck up
                     console.log("stuck up");
                    for(var i = 0; i < that.game.entities.length; i++) {
                        var temp = that.game.entities[i];

                        if(!(temp instanceof(Circle3d))) {
                            temp.y -= 30;
                        }
                    }
                } else if(pf.y  > that.y ){//stuck down
                    console.log("stuck down");
                    for(var i = 0; i < that.game.entities.length; i++) {
                        var temp = that.game.entities[i];

                        if(!(temp instanceof(Circle3d))) {
                            temp.y += 30;
                        }
                    }
                }
            }
        };
    };

    //console.log(this.game.timer);
};

Circle3d.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.strokeStyle = "transparent";
    ctx.fillStyle = "transparent";
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

    if (this.circle) {
        ctx.beginPath();
        //ctx.fillStyle = "green";
        ctx.arc(this.boundingcircle.x, this.boundingcircle.y, this.boundingcircle.radius, 0, Math.PI * 2, false);
        //ctx.fill();
        ctx.stroke();
    }
    if(this.game.stopTraps) {
    	ctx.beginPath();
        ctx.fillStyle = "gold";
        ctx.arc(this.x, this.y, this.radius + 20, 0, Math.PI * 2, false);
        ctx.fill();
//        ctx.stroke();
    }

    //render the 3d
    render();
};




// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

//ASSET_MANAGER.queueDownload("./img/ninja.png");
ASSET_MANAGER.queueDownload("./img/coin.png");
ASSET_MANAGER.queueDownload("./img/bricks.jpg");
ASSET_MANAGER.queueDownload("./img/trap2.png"); // pre-download of .png images.
ASSET_MANAGER.queueDownload("./img/trap1.png");
ASSET_MANAGER.queueDownload("./img/trap1.png");
ASSET_MANAGER.queueDownload("./img/trapDisable.png");
ASSET_MANAGER.queueDownload("./img/trapDisableHorizontal.png");
ASSET_MANAGER.queueDownload("./img/exitFlag.png");
ASSET_MANAGER.queueDownload("./img/ninja.png");
ASSET_MANAGER.queueDownload("./img/up.png");
ASSET_MANAGER.queueDownload("./img/down.png");
ASSET_MANAGER.queueDownload("./img/left.png");
ASSET_MANAGER.queueDownload("./img/right.png");
ASSET_MANAGER.queueDownload("./img/StartBG.png");


//song queue
ASSET_MANAGER.queueAudioDownload("./song/bgsound.mp3");
ASSET_MANAGER.queueAudioDownload("./song/Coin.wav");
ASSET_MANAGER.queueAudioDownload("./song/shock.wav");
ASSET_MANAGER.queueAudioDownload("./song/exitSnd.wav");
ASSET_MANAGER.queueAudioDownload("./song/ninja1.wav");

ASSET_MANAGER.downloadAll(function () {
	var  canvas = document.getElementById('gameWorld');
//	canvas.focus();
	var ctx = canvas.getContext('2d');
	ctx.drawImage(ASSET_MANAGER.getAsset("./img/StartBG.png"), 0, 0, 800, 800);

});

function startGameNormal() {
	console.log("starting up da sheild");
	var  canvas = document.getElementById('gameWorld');
	canvas.focus();
	var   ctx = canvas.getContext('2d');
    
    var gameEngine = new GameEngine();
    var timer = new Timer();
    gameEngine.timer = timer;
    
    gameEngine.mazeSize = 3;
    gameEngine.level = 1;
    gameEngine.totCoins = 0;
    gameEngine.numTraps = 0;
    gameEngine.numCoins = 3;
    gameEngine.numNinjas = 0;
    gameEngine.easyGame = false;
    gameEngine.screenOff = false;
    gameEngine.showSolution = false;
    gameEngine.stopTraps = false;
    gameEngine.coinSnd = ASSET_MANAGER.getAudioAsset("./song/Coin.wav");
    gameEngine.shockSnd = ASSET_MANAGER.getAudioAsset("./song/shock.wav");
    gameEngine.musicSnd = ASSET_MANAGER.getAudioAsset("./song/bgsound.mp3"); 
    gameEngine.musicSnd.loop = true;
    gameEngine.musicSnd.play();
//    gameEngine.musicSnd.play();
    gameEngine.muteMusic = false;
    gameEngine.muteSoundfx = false;
//    gameEngine.coinSnd.playbackRate = 1;

    //instantiate the 3d ball
    init();
    
    var myMaze = new Maze(gameEngine.mazeSize, gameEngine.mazeSize, gameEngine, !gameEngine.easyGame);
    var myMazeC = new Maze(gameEngine.mazeSize, gameEngine.mazeSize, gameEngine, false);
    var myMazeW = new Maze(gameEngine.mazeSize, gameEngine.mazeSize, gameEngine, false);
//    myMaze.printMaze();

    //make the myMaze a game entity variable
    gameEngine.myMaze = myMaze.maze;
   
//    var ms = new solveMaze(myMaze.maze, myMazeC.maze, myMazeW.maze);
//    console.log(ms.traverse(0, 1));
//    printMaze(myMazeW.maze);


    var mazePieces = createMazePieces(gameEngine, myMaze, myMazeC.maze);
    gameEngine.mazePieces  = mazePieces;


    
//    var ninja = new Ninja(gameEngine); Dont need



    var circle3d = new Circle3d(gameEngine, 399.5, 399, 40);
    gameEngine.addEntity(circle3d);
    gameEngine.circle3d = circle3d;



    var gamelabel = new gameLabel(gameEngine);
    gameEngine.addEntity(gamelabel);
    gameEngine.gameLabel = gamelabel;
//    gameEngine.addEntity(shade);
    //gameEngine.addEntity(ninja);
    
    gameEngine.init(ctx);
    var button = document.getElementById('normalStart');
    button.remove(); easyStart
    var otherbutton = document.getElementById('easyStart');
    otherbutton.remove();
    gameEngine.start();
};

function easyGameNormal() {
	console.log("starting up da sheild");
	var  canvas = document.getElementById('gameWorld');
	canvas.focus();
	var   ctx = canvas.getContext('2d');
    
    var gameEngine = new GameEngine();
    var timer = new Timer();
    gameEngine.timer = timer;
    
    gameEngine.mazeSize = 3;
    gameEngine.level = 1;
    gameEngine.totCoins = 0;
    gameEngine.numTraps = 0;
    gameEngine.numCoins = 0;
    gameEngine.numNinjas = 0;
    gameEngine.easyGame = true;
    gameEngine.screenOff = false;
    gameEngine.showSolution = false;
    gameEngine.stopTraps = false;
    gameEngine.coinSnd = ASSET_MANAGER.getAudioAsset("./song/Coin.wav");
    gameEngine.shockSnd = ASSET_MANAGER.getAudioAsset("./song/shock.wav");
    gameEngine.musicSnd = ASSET_MANAGER.getAudioAsset("./song/bgsound.mp3"); 
    gameEngine.musicSnd.loop = true;
    gameEngine.musicSnd.play();
//    gameEngine.musicSnd.play();
    gameEngine.muteMusic = false;
    gameEngine.muteSoundfx = false;
//    gameEngine.coinSnd.playbackRate = 1;

    //instantiate the 3d ball
    init();
    
    var myMaze = new Maze(gameEngine.mazeSize, gameEngine.mazeSize, gameEngine, !gameEngine.easyGame);
    var myMazeC = new Maze(gameEngine.mazeSize, gameEngine.mazeSize, gameEngine, false);
    var myMazeW = new Maze(gameEngine.mazeSize, gameEngine.mazeSize, gameEngine, false);
//    myMaze.printMaze();

    //make the myMaze a game entity variable
    gameEngine.myMaze = myMaze.maze;
   
//    var ms = new solveMaze(myMaze.maze, myMazeC.maze, myMazeW.maze);
//    console.log(ms.traverse(0, 1));
//    printMaze(myMazeW.maze);


    var mazePieces = createMazePieces(gameEngine, myMaze, myMazeC.maze);
    gameEngine.mazePieces  = mazePieces;


    
//    var ninja = new Ninja(gameEngine); Dont need



    var circle3d = new Circle3d(gameEngine, 399.5, 399, 40);
    gameEngine.addEntity(circle3d);
    gameEngine.circle3d = circle3d;



    var gamelabel = new gameLabel(gameEngine);
    gameEngine.addEntity(gamelabel);
    gameEngine.gameLabel = gamelabel;
//    gameEngine.addEntity(shade);
    //gameEngine.addEntity(ninja);
    
    gameEngine.init(ctx);
    var button = document.getElementById('normalStart');
    button.remove(); easyStart
    var otherbutton = document.getElementById('easyStart');
    otherbutton.remove();
    gameEngine.start();
};

function nextLevel(mazeSize, game) {
//	var so = false;
	game.continueTrapTime = false;
	game.stopTraps = false;
	game.trapTime = 0;
	if(!game.easyGame) {
		game.numNinjas = Math.floor(game.level / 2) + 1;
		game.numCoins += 2;
		game.numTraps += 2;
	}

    
    //remove the enities
	for(var i = 0; i < game.entities.length; i++) {
		var temp = game.entities[i];
		if(!temp instanceof(Circle3d) || temp instanceof(Coin) || temp instanceof(gameLabel) 
			|| temp instanceof(VisibilityCircle) || temp instanceof(testMazePath)) {
			temp.removeFromWorld = true;
		}

	}
	
	
	for (var i = 0; i < game.mazePieces.length; i++) {
		game.mazePieces[i].removeFromWorld = true;
	}
	
	
	var myMaze = new Maze(mazeSize, mazeSize, game, true);

	var myMazeC = new Maze(mazeSize, mazeSize, game, false);
    var myMazeW = new Maze(mazeSize, mazeSize, game, false);

//    myMaze.printMaze();

    //make the maze we are solving a game variable
    game.myMaze = myMaze.maze;

   
//    var ms = new solveMaze(myMaze.maze, myMazeC.maze, myMazeW.maze);
//    console.log(ms.traverse(0, 1));
//    printMaze(myMazeC.maze);


    var mazePieces = createMazePieces(game, myMaze, myMazeC.maze);

    game.mazePieces  = mazePieces;

    var gamelabel = new gameLabel(game);
    gamelabel.nextLevelLabel = true;
    game.addEntity(gamelabel);

    game.gameLabel = gamelabel;

    var timer = new Timer();
    game.timer = timer;
}
