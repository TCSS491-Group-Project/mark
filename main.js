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

BoundingBox.prototype.collideRight = function (oth) {
    if (this.right === oth.left) {
        return true;
    } else {
        return false;
    }
}

function MazePiece(game, x, y, width, height) {
    this.width = width;
    this.height = height;
    this.startX = x;
    this.startY = y;
    this.moveIncrement = 0;
    this.boundingbox = new BoundingBox(x, y, width, height);

    
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
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.width, this.height); 

    Entity.prototype.draw.call(this);
}




function Ninja(game) {
    //this.animation = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    //this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 618, 334, 174, 138, 0.02, 40, false, true);

    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 0, 0, 50, 77, 0.05, 1, true, false);
    this.walkRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 0, 155, 50, 77, 0.08, 8, true, false);
    this.LookRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 0, 155, 50, 77, 0.08, 1, true, false);
    this.walkLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 0, 77, 50, 77, 0.08, 8, true, false);
    this.LookLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 0, 77, 50, 77, 0.08, 1, true, false);
    this.goUpAndDownAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 200, 0, 50, 77, 0.08, 4, true, false);
    this.jumpRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 200, 309, 50, 77, 0.13, 3, false, false);
    this.jumpLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 0, 309, 50, 77, 0.13, 3, false, true);
    
    this.radius = 100;
    this.ground = 430;
    this.boxes = true;
    this.stay = true;
    this.boundingbox = new BoundingBox(this.x, this.y, this.animation.frameWidth, this.animation.frameHeight);

 
    this.platform = game.mazePieces[0];

    Entity.call(this, game, 360, 370);
}

Ninja.prototype = new Entity();
Ninja.prototype.constructor = Ninja;

Ninja.prototype.update = function () {

    if (this.game.jumping && this.lookRightOrLeftActive) {
        

        if (this.jumpRightAnimation.isDone()) {
            this.jumpRightAnimation.elapsedTime = 0;
            this.game.jumping = false;
        } else if (this.jumpLeftAnimation.isDone()) {
            this.jumpLeftAnimation.elapsedTime = 0;
            this.game.jumping = false;
        }
        
        var jumpDistance;
        if(this.lookRight){
            jumpDistance = this.jumpRightAnimation.elapsedTime / this.jumpRightAnimation.totalTime;
             //this.x += 10;
            this.boundingbox = new BoundingBox(this.x, this.y, this.jumpRightAnimation.frameWidth, this.jumpRightAnimation.frameHeight);
        } else if(this.lookLeft){
            jumpDistance = this.jumpLeftAnimation.elapsedTime / this.jumpLeftAnimation.totalTime;
            this.boundingbox = new BoundingBox(this.x, this.y, this.jumpLeftAnimation.frameWidth, this.jumpLeftAnimation.frameHeight);
             //this.x -= 10;
        }
         
        var totalHeight = 50;

        if (jumpDistance > 0.5){
            jumpDistance = 1 - jumpDistance;
        }
            

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));

        this.y = this.ground - height; 
        //console.log(this.y);
        
        
    } else if(this.game.walkRight){
        
        this.lookRightOrLeftActive = true;
        this.lookLeft = false;
        this.stay = false;
        this.ground = this.y;
        this.lookRight = true;
        this.game.tx = 2;
        this.boundingbox = new BoundingBox(this.x, this.y, this.walkRightAnimation.frameWidth, this.walkRightAnimation.frameHeight);
        for (var i = 0; i < this.game.mazePieces.length; i++) {
            var pf = this.game.mazePieces[i];
            
            if (this.boundingbox.collide(pf.boundingbox)) {
                          
                this.game.tx = 0;
                this.stay = true;
            } 
        }
        
        if(this.stay){
            for (var i = 0; i < this.game.mazePieces.length; i++) {
                var pf = this.game.mazePieces[i];
                pf.x = pf.x + 6;
                
            }
        }

        //console.log(this.tx);
        //this.x += 1;
    } else if(this.game.walkLeft){
        
        this.lookLeft = true;
        this.lookRightOrLeftActive = true;
        this.lookLeft = true;
        this.lookRight = false;
        this.ground = this.y;
        this.stay = false;
        this.game.tx = -2;
        this.boundingbox = new BoundingBox(this.x, this.y, this.walkLeftAnimation.frameWidth, this.walkLeftAnimation.frameHeight);
        for (var i = 0; i < this.game.mazePieces.length; i++) {
            var pf = this.game.mazePieces[i];
           
            if (this.boundingbox.collide(pf.boundingbox)) {
                //this.x = pf.boundingbox.left - this.animation.frameWidth + 10;  
                this.game.tx = 0;     
                this.stay = true;
                //this.game.walkLeft = false;
                break;
            } 
        }

        if(this.stay){
            for (var i = 0; i < this.game.mazePieces.length; i++) {
                var pf = this.game.mazePieces[i];
                pf.x = pf.x - 6;
                
            }
        } 
        
        
        
    } if(this.game.goUp){
        this.stay = false; 
        this.game.ty = -2;
        this.boundingbox = new BoundingBox(this.x, this.y, this.goUpAndDownAnimation.frameWidth, this.goUpAndDownAnimation.frameHeight);
        for (var i = 0; i < this.game.mazePieces.length; i++) {
            var pf = this.game.mazePieces[i];
            
            if (this.boundingbox.collide(pf.boundingbox)) {
                
                this.game.ty = 0;                                
                this.stay = true;
                break;
            } 
        }
        
        if(this.stay){
            for (var i = 0; i < this.game.mazePieces.length; i++) {
                var pf = this.game.mazePieces[i];
                pf.y = pf.y - 5;
                
            }
        }

        this.lookRightOrLeftActive = false;
        this.lookLeft = false;
        this.lookRight = false;

    }else if(this.game.goDown){

        this.stay = false;
        this.game.ty = 2;
        this.boundingbox = new BoundingBox(this.x, this.y, this.goUpAndDownAnimation.frameWidth, this.goUpAndDownAnimation.frameHeight);
        for (var i = 0; i < this.game.mazePieces.length; i++) {
            var pf = this.game.mazePieces[i];
           
            if (this.boundingbox.collide(pf.boundingbox)) {
     
                this.game.ty = 0;                      
                this.stay = true;
                break;
            } 
        }
        
        if(this.stay){
            for (var i = 0; i < this.game.mazePieces.length; i++) {
                var pf = this.game.mazePieces[i];
                pf.y = pf.y + 5;
                
            }
        }

        this.lookRightOrLeftActive = false;
        this.lookLeft = false;
        this.lookRight = false;
    }
    

    Entity.prototype.update.call(this);
}

Ninja.prototype.draw = function (ctx) {
    if (this.game.jumping && this.lookRight) {
        this.jumpRightAnimation.drawFrame(this.game.clockTick, ctx, this.x + 10, this.y - 40);
    }else if (this.game.jumping && this.lookLeft) {
        this.jumpLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x + 10, this.y - 40);
    } else if (this.game.walkRight){
        this.walkRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
         if (this.boxes) {
            ctx.strokeStyle = "red";
            ctx.strokeRect(this.x, this.y, this.walkRightAnimation.frameWidth, this.walkRightAnimation.frameHeight);
            ctx.strokeStyle = "green";
            ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
        }
    } else if (this.game.walkLeft){
        this.walkLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
         if (this.boxes) {
            ctx.strokeStyle = "red";
            ctx.strokeRect(this.x, this.y, this.walkRightAnimation.frameWidth, this.walkRightAnimation.frameHeight);
            ctx.strokeStyle = "green";
            ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
        }
    } else if (this.lookLeft) {
        this.LookLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.lookRight){
        this.LookRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.game.goUp){
        this.goUpAndDownAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.game.goDown){
        this.goUpAndDownAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } 
   
       
    Entity.prototype.draw.call(this);
}

function VisibilityCircle(game) {
    //this.animation1 = new Animation(ASSET_MANAGER.getAsset("./img/Capture.png"), 0, 0, 10, 10, 0.05, 1, true, false);
    Entity.call(this, game, 0, 0);
}
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


// Hardcoded maze
function Maze(length, width) {
	this.length = length;
	this.width = width;
	this.maze = [['X', ' ', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
	              ['X', ' ', ' ', ' ', 'X', ' ', ' ', ' ', 'X', ' ', 'X'],
	              ['X', 'X', 'X', ' ', 'X', 'X', 'X', ' ', 'X', ' ', 'X'],
	              ['X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X'],
	              ['X', 'X', 'X', 'X', 'X', 'X', 'X', ' ', 'X', 'X', 'X'],
	              ['X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', ' ', 'X'],
	              ['X', ' ', 'X', 'X', 'X', ' ', 'X', 'X', 'X', ' ', 'X'],
	              ['X', ' ', 'X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X'],
	              ['X', ' ', 'X', 'X', 'X', 'X', 'X', 'X', 'X', ' ', 'X'],
	              ['X', ' ', ' ', ' ', ' ', ' ', 'X', ' ', ' ', ' ', 'X'],
	              ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', ' ', 'X']];
	
	this.printMaze = function() {
		var string = '';
		console.log('The Maze length: ' + this.length);
		console.log('The Maze width: ' + this.width);
		for(var r = 0; r < this.length + 1; r++) {
			for(var c = 0; c < this.width + 1; c++) {
				string += this.maze[r][c] + " ";
			}
			string += '\r\n';
		}
		console.log(string);
	}	
}

function createMazePieces(game, maze) {
	var mazePieces = [];
	for(var r = 0; r < maze.length + 1; r++) {
		for(var c = 0; c < maze.width + 1; c++) {
//			string += maze.maze[r][c] + " ";
			if(maze.maze[r][c] === 'X') {
				var pl = new MazePiece(game, (c * 100) + 250, (r * 100) + 370 , 100, 100);
    				game.addEntity(pl);
    				mazePieces.push(pl); 
			} 
		}
//		string += '\r\n';
	}
	return mazePieces;
};

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/ninja.png");
ASSET_MANAGER.queueDownload("./img/Maze.png");
ASSET_MANAGER.queueDownload("./img/Capture.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();



    var myMaze = new Maze(10, 10);
    myMaze.printMaze();
    var mazePieces = createMazePieces(gameEngine, myMaze);
    //mazePieces.push(pl);
   
    gameEngine.mazePieces  = mazePieces;


    var ninja = new Ninja(gameEngine);
    var box = new VisibilityCircle(gameEngine);

    
    gameEngine.addEntity(box);
    gameEngine.addEntity(ninja);
 
    gameEngine.init(ctx);
    gameEngine.start();
});
