function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // vindex * this.frameHeight + this.startY
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}


function BoundingBox(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.left = x;
    this.top = y;
    this.right = this.left + width;
    this.bottom = this.top + height;
}

BoundingBox.prototype.collide = function (oth) {
    if (this.right > oth.left && this.left < oth.right && this.top < oth.bottom && this.bottom > oth.top) return true;
    return false;
}

function BoundingCircle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
}

BoundingCircle.prototype.collide = function (rect) {
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
}

/** Coin function */
function Coin(game, x, y){
	this.startX = x;
    this.startY = y;
	this.x = x;
	this.y = y;
	this.width = 50;
	this.height = 50;
    this.isCoin = true;
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/coin.png"), 0, 0, 100, 100, 0.05, 10, true, false);
	this.boxes = true;
	this.boundingbox = new BoundingBox(this.x, this.y, this.animation.frameWidth, this.animation.frameHeight);
	
	Entity.call(this, game, x, y); // Entity.call(this, game, x, y);
	
}

Coin.prototype = new Entity();
Coin.prototype.constructor = Coin;

Coin.prototype.update = function () {
	this.x = this.x - this.game.tx;
    this.y = this.y - this.game.ty;
    this.boundingbox = new BoundingBox(this.x + 10, this.y - 40, this.width, this.height);
    Entity.prototype.update.call(this);
}

Coin.prototype.draw = function (ctx) {
	if (this.boxes) {
        ctx.strokeStyle = "green";
        ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
//        ctx.strokeStyle = "red";
//        ctx.strokeRect(this.x + 10, this.y - 40, this.animation.frameWidth / 2, this.animation.frameHeight /2);
    }
    this.animation.drawFrame(this.game.clockTick, ctx, this.x + 10, this.y - 40, 0.5);
    Entity.prototype.draw.call(this);
}

function VisibilityCircle(game) {
    //this.animation1 = new Animation(ASSET_MANAGER.getAsset("./img/Capture.png"), 0, 0, 10, 10, 0.05, 1, true, false);
    Entity.call(this, game, 0, 0);
};

VisibilityCircle.prototype = new Entity();

VisibilityCircle.prototype.constructor = VisibilityCircle;

VisibilityCircle.prototype.update = function () {
    Entity.prototype.update.call(this);
}

VisibilityCircle.prototype.draw = function (ctx) {
    //this.animation1.drawFrame(this.game.clockTick, ctx, this.x + 10, this.y - 100);
    Entity.prototype.draw.call(this);
    //ctx.fillStyle = "SaddleBrown";
    
    var gradient = ctx.createRadialGradient(400, 400, 300, 400, 400, 0);
    gradient.addColorStop(0, "black");
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 800);  
}

function Circle3d(game, x, y, radius) {
    this.radius = radius;
    this.circle = true;
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

Circle3d.prototype.update = function () {
    Entity.prototype.update.call(this);

    var speedIncreament = 0.5;
    var MaxSpeed = 5;
    var padding = 5;

    var ballRotationSpeed = 0.09;

    if(this.game.walkRight){

        //move the maze
        this.game.tx += speedIncreament;
        if(this.game.tx > MaxSpeed){
            this.game.tx = MaxSpeed;
        }

        //rotate ball right
        var xAxis = new THREE.Vector3(0,1,0);
        
        x = ballRotationSpeed;       

        //render the 3d
        render();

        //create a new bounding circle with padding so that the maze will be able to move
        this.boundingcircle = new BoundingCircle(this.x + padding, this.y, this.radius);

        for (var i = 0; i < this.game.mazePieces.length; i++) {
            var pf = this.game.mazePieces[i];

            
            if (this.boundingcircle.collide(pf.boundingbox)) { 
                if(!pf.trap || pf.isCoin) {
                	this.game.tx = 0;
                    x = 0;
                } else {
                	pf.removeFromWorld = true;
                	mazeTrapReset(this.game);
                    
                	//console.log("here" + i);
                }
            } 
            //this.collide(pf.boundingbox);
            //console.log(this.collide(pf.boundingbox));
        
        };

        //update the position of the 3d ball
        rotateAroundWorldAxis(mesh, xAxis, x);
    }

    else if(this.game.walkLeft){

        //move the maze
        this.game.tx -= speedIncreament;
        if(this.game.tx < - (MaxSpeed)){
            this.game.tx = - (MaxSpeed);
        }

        //rotate ball left
        var xAxis = new THREE.Vector3(0,1,0);
        x = - (ballRotationSpeed);     

        //create a new bounding circle with padding so that the maze will be able to move
        this.boundingcircle = new BoundingCircle(this.x - padding, this.y, this.radius);

        for (var i = 0; i < this.game.mazePieces.length; i++) {
            var pf = this.game.mazePieces[i];

            
            if (this.boundingcircle.collide(pf.boundingbox)) { 
            	if(!pf.trap || pf.isCoin) {
            		this.game.tx = 0;
                    x = 0; 
                } else {
                	pf.removeFromWorld = true;
                	mazeTrapReset(this.game);
                	//console.log("here" + i);
                }
            } 
        
        };

        //update the position of the 3d ball
        rotateAroundWorldAxis(mesh, xAxis, x);
    }

    if(this.game.goDown){

        //move the maze
        this.game.ty += speedIncreament;
        if(this.game.ty > MaxSpeed){
            this.game.ty = MaxSpeed;
        }

        //rotateball down
        var xAxis = new THREE.Vector3(1,0,0);
        y = ballRotationSpeed;  

        //create a new bounding circle with padding so that the maze will be able to move
        this.boundingcircle = new BoundingCircle(this.x, this.y + padding, this.radius);

        for (var i = 0; i < this.game.mazePieces.length; i++) {
            var pf = this.game.mazePieces[i];

            
            if (this.boundingcircle.collide(pf.boundingbox)) { 
            	if(!pf.trap || pf.isCoin) {
            		this.game.ty = 0; 
                    y = 0;
                } else {
                	pf.removeFromWorld = true;
                	mazeTrapReset(this.game);
                	//console.log("here" + i);
                }
            } 
        };

        //update 3d ball
        rotateAroundWorldAxis(mesh, xAxis, y);
    }

    else if(this.game.goUp){

        //move the maze
        this.game.ty -= speedIncreament;
        if(this.game.ty < - (MaxSpeed)){
            this.game.ty = - (MaxSpeed);
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

            	if(!pf.trap || pf.isCoin) {
            		this.game.ty = 0;
                    y = 0;
                } else {
                	pf.removeFromWorld = true;
                	mazeTrapReset(this.game);
                	//console.log("here" + i);
                }

            } 
            //console.log(this.collide(pf.boundingbox));
        
        };

        //update ball
        rotateAroundWorldAxis(mesh, xAxis, y);
    }

};

Circle3d.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = "purple";
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

function mazeTrapReset(game) { // TODO here
	for (var i = 0; i < game.mazePieces.length; i++) {
		game.mazePieces[i].x = game.mazePieces[i].startX;
		game.mazePieces[i].y = game.mazePieces[i].startY;
		game.mazePieces[i].update();
	}
}

function MazePiece(game, x, y, width, height, isTrap) {
    this.width = width;
    this.height = height;
    this.startX = x;
    this.startY = y;
    this.moveIncrement = 0;

    this.boundingbox = new BoundingBox(x, y, width, height);
    this.boxes = true;
    this.trap = isTrap;
    
    Entity.call(this, game, x, y);
}

MazePiece.prototype = new Entity();
MazePiece.prototype.constructor = MazePiece;

MazePiece.prototype.update = function () {
	
    
    this.x = this.x - this.game.tx;
    this.y = this.y - this.game.ty;
    this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
    Entity.prototype.update.call(this);
    
}

MazePiece.prototype.draw = function (ctx) {
    //ctx.drawImage(ASSET_MANAGER.getAsset("./img/Maze.png"), 0, 0, 800, 800);
	if(this.trap) {
		ctx.fillStyle = "blue";
	} else {
		ctx.fillStyle = "black";
	}
    ctx.fillRect(this.x, this.y, this.width, this.height);
    if (this.boxes) {
            ctx.strokeStyle = "green";
            ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
        }

    Entity.prototype.draw.call(this);
}

function Maze(x, y) {
	this.maze = getMazeField(generateMaze(x,y));
//	addCoins(rows, cols, maze, numOfcoins) {
    this.length = this.maze[0].length;
    this.width = this.maze.length;
    addCoins(this.length, this.width, this.maze, 3);
    addTraps(this.length, this.width, this.maze, 3);
    
	this.printMaze = function() {
		var string = '';
		console.log('The Maze length: ' + this.length);
		console.log('The Maze width: ' + this.width);
		for(var r = 0; r < this.length; r++) {
			for(var c = 0; c < this.width; c++) {
				string += this.maze[r][c] + " ";
			}
			string += '\r\n';
		}
		console.log(string);
	}	
};

function createMazePieces(game, maze) {
	var mazePieces = [];
    console.log(maze.length);
	for(var r = 0; r < maze.width ; r++) {
		for(var c = 0; c < maze.maze[0].length  ; c++) {
//			string += maze.maze[r][c] + " ";
			if(maze.maze[r][c] === 'X') {
				var pl = new MazePiece(game, (c * 100) + 250, (r * 100) + 370 , 100, 100, false); // x, y, width, height
				game.addEntity(pl);
				mazePieces.push(pl); 
			} else if (maze.maze[r][c] === 'C') {
				var pl = new Coin(game, (c * 100) + 270, (r * 100) + 430); // // x, y, width, height
				game.addEntity(pl);
				mazePieces.push(pl);
			} else if(maze.maze[r][c] === 'T') {
				var pl = new MazePiece(game, (c * 100) + 250 + 25, (r * 100) + 370 + 25 , 50, 50, true); // x, y, width, height
				game.addEntity(pl);
				mazePieces.push(pl); 
			}
		}
//		string += '\r\n';
	}
    /*var pl = new MazePiece(game, ( 100) + 250, (100) + 370 , 100, 100);
    game.addEntity(pl);
    mazePieces.push(pl);*/
	return mazePieces;
};

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/ninja.png");
ASSET_MANAGER.queueDownload("./img/coin.png");
//ASSET_MANAGER.queueDownload("./img/Capture.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();

    //instanciate the 3d ball
    init();
    

    var myMaze = new Maze(5, 5);
//    myMaze.printMaze();

    var mazePieces = createMazePieces(gameEngine, myMaze);
    //mazePieces.push(pl);
   
    gameEngine.mazePieces  = mazePieces;


//    var ninja = new Ninja(gameEngine); Dont need
//    var shade = new VisibilityCircle(gameEngine);

    /*var test3d = new Test3D(gameEngine);
    gameEngine.addEntity(test3d);*/

    var circle3d = new Circle3d(gameEngine, 400, 400, 21);
    gameEngine.addEntity(circle3d);

//    gameEngine.addEntity(shade);
    //gameEngine.addEntity(ninja);
 
    gameEngine.init(ctx);
    gameEngine.start();
});
