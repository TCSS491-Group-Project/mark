






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
    var padding = 8;


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
                } else if(pf.exit) {
                    this.game.tx = 0;
                    this.game.ty = 0;
                	this.game.level += 1;
                	this.game.numCoins += 1;
                	this.game.numTraps += 2;
                    this.game.screenOff = true;
                	nextLevel(++(this.game.mazeSize), this.game);
                    
                } else {
                	if(pf.trapFrame < 8) {
                		this.game.tx = 0;
                		this.game.ty = 0;
//                		pf.removeFromWorld = true;
                		if(this.game.totCoins !== 0) this.game.totCoins--;

                        //tell user they fall in the trap
                        this.game.gameLabel.trapLabel = true;
                		mazeTrapReset(this.game);
                		this.game.screenOff = true;
                		
                	}
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
                } else {
                	if(pf.trapFrame < 8) {
                		this.game.tx = 0;
                		this.game.ty = 0;
//                		pf.removeFromWorld = true;
                		if(this.game.totCoins !== 0) this.game.totCoins--;

                        //tell user they fall in the trap
                        this.game.gameLabel.trapLabel = true;
                		mazeTrapReset(this.game);
                		this.game.screenOff = true;
                		
                	}
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
                } else {
                	if(pf.trapFrame < 8) {
                		this.game.tx = 0;
                		this.game.ty = 0;
//                		pf.removeFromWorld = true;
                		if(this.game.totCoins !== 0) this.game.totCoins--;
                        //tell user they fall in the trap
                        this.game.gameLabel.trapLabel = true;
                        mazeTrapReset(this.game);
                        this.game.screenOff = true;
                    }
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
                } else {
                	if(pf.trapFrame < 8) {
                		this.game.tx = 0;
                		this.game.ty = 0;
//                		pf.removeFromWorld = true;
                		if(this.game.totCoins !== 0) this.game.totCoins--;

                        //tell user they fall in the trap
                        this.game.gameLabel.trapLabel = true;
                		mazeTrapReset(this.game);
                		this.game.screenOff = true;
                	}
                }
            } 
        };

        //update 3d ball
        rotateAroundWorldAxis(mesh, xAxis, y);
    } 

    if(this.game.payPath && this.game.totCoins >= 10){ //TODO coins to cash
    	this.game.totCoins -= 10;
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
        console.log("r " + r + " c " + c);
        console.log("x " + pf.x + " y " + pf.y);
        
        this.game.payPath = false;
    } else if(this.game.payPath) {
    	this.game.payPath = false;
    }

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
ASSET_MANAGER.queueDownload("./img/exitFlag.png");
ASSET_MANAGER.queueAudioDownload("./song/bgsound.mp3");


ASSET_MANAGER.downloadAll(function () {
	
    console.log("starting up da sheild");
    
	var  canvas = document.getElementById('gameWorld');
	canvas.focus();
	var   ctx = canvas.getContext('2d');
    
    var snd = ASSET_MANAGER.getAudioAsset("./song/bgsound.mp3");
    snd.play();
    
    
    var gameEngine = new GameEngine();
    gameEngine.mazeSize = 3;
    gameEngine.level = 1;
    gameEngine.totCoins = 0;
    gameEngine.numTraps = 0;
    gameEngine.numCoins = 3;
    gameEngine.screenOff = false;
    gameEngine.showSolution = false;

    //instantiate the 3d ball
    init();
    
    var myMaze = new Maze(gameEngine.mazeSize, gameEngine.mazeSize, gameEngine, true);
    var myMazeC = new Maze(gameEngine.mazeSize, gameEngine.mazeSize, gameEngine, false);
    var myMazeW = new Maze(gameEngine.mazeSize, gameEngine.mazeSize, gameEngine, false);
    myMaze.printMaze();

    //make the myMaze a game entity variable
    gameEngine.myMaze = myMaze.maze;
   
    var ms = new solveMaze(myMaze.maze, myMazeC.maze, myMazeW.maze);
    console.log(ms.traverse(0, 1));
    printMaze(myMazeW.maze);


    var mazePieces = createMazePieces(gameEngine, myMaze, myMazeC.maze);
    gameEngine.mazePieces  = mazePieces;


    var timer = new Timer();
    gameEngine.timer = timer;
//    var ninja = new Ninja(gameEngine); Dont need



    var circle3d = new Circle3d(gameEngine, 399.5, 399, 40);
    gameEngine.addEntity(circle3d);

    var gamelabel = new gameLabel(gameEngine);
    gameEngine.addEntity(gamelabel);
    gameEngine.gameLabel = gamelabel;
//    gameEngine.addEntity(shade);
    //gameEngine.addEntity(ninja);
    
    gameEngine.init(ctx);
    gameEngine.start();
});

function nextLevel(mazeSize, game) {
	var so = false;

    
    //remove the enities
	for(var i = 0; i < game.entities.length; i++) {
		var temp = game.entities[i];
		if(temp instanceof(testMazePath) || temp instanceof(VisibilityCircle) || temp instanceof(Coin) || temp instanceof(gameLabel)) {
			temp.removeFromWorld = true;
		}
	}
	
	for (var i = 0; i < game.mazePieces.length; i++) {
		game.mazePieces[i].removeFromWorld = true;
	}
	
	
	var myMaze = new Maze(mazeSize, mazeSize, game, true);

	var myMazeC = new Maze(mazeSize, mazeSize, game, false);
    var myMazeW = new Maze(mazeSize, mazeSize, game, false);

    myMaze.printMaze();

    //make the maze we are solving a game variable
    game.myMaze = myMaze.maze;

   
    var ms = new solveMaze(myMaze.maze, myMazeC.maze, myMazeW.maze);
    console.log(ms.traverse(0, 1));
    printMaze(myMazeC.maze);


    var mazePieces = createMazePieces(game, myMaze, myMazeC.maze);

    game.mazePieces  = mazePieces;

    var gamelabel = new gameLabel(game);
    gamelabel.nextLevelLabel = true;
    game.addEntity(gamelabel);

    game.gameLabel = gamelabel;

    var timer = new Timer();
    game.timer = timer;
}

