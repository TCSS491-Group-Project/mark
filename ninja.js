function Ninja(game, x, y) {
     //this.animation = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
     //this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 618, 334, 174, 138, 0.02, 40, false, true);
    this.boxes = true
//     this.animation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 0, 0, 50, 77, 0.05, 1, true, false);
     this.walkRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 0, 155, 50, 77, 0.08, 8, true, false);
//     this.LookRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 0, 155, 50, 77, 0.08, 1, true, false);
     this.walkLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 0, 77, 50, 77, 0.08, 8, true, false);
//     this.LookLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 0, 77, 50, 77, 0.08, 1, true, false);
     this.goUpAndDownAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 200, 0, 50, 77, 0.08, 4, true, false);
//     this.jumpRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 200, 309, 50, 77, 0.08, 3, false, false);
//     this.jumpLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 0, 309, 50, 77, 0.08, 3, false, true);
//     this.radius = 100;
//     this.ground = 430;
     this.x = x;
     this.y = y;
     this.startX = x;
     this.startY = y;
     this.currSec = Math.floor(game.timer.gameTime) % 60; 
     this.gameSecs = this.currSec;
     this.boundingbox = new BoundingBox(x, y, this.walkRightAnimation.frameWidth, this.walkRightAnimation.frameHeight);
     Entity.call(this, game, this.x, this.y);
 }
 
 Ninja.prototype = new Entity();
 Ninja.prototype.constructor = Ninja;
 
 Ninja.prototype.update = function () {

   this.gameSecs = Math.floor(this.game.timer.gameTime) % 60;
   var ninjaSpeedX = 1;
   var ninjaSpeedY = 1;
   var ninjaPadding = 9;

    this.x = this.x - this.game.tx;
    this.y = this.y - this.game.ty;

    if(this.currSec !== this.gameSecs) {
	   this.NinjaMove = Math.floor(Math.random() * 4);
	   this.currSec = this.gameSecs;
    }
// this.game.NinjaMove = Math.floor(Math.random() * 4);
    if(this.NinjaMove === 0){
        this.boundingbox = new BoundingBox(this.x + ninjaPadding, this.y, this.walkRightAnimation.frameWidth, this.walkRightAnimation.frameHeight);

        for(var i = 0; i < this.game.mazePieces.length; i++){
            var ent = this.game.mazePieces[i];
           
                if(this.boundingbox.collide(ent.boundingbox) && ent instanceof(MazePiece) && !ent.trap){
                    ninjaSpeedX = 0;
                }
                if(this.game.circle3d.boundingcircle.collide(this.boundingbox)){
                    ninjaSpeedX = 0;
                }
            
        }
        this.x += ninjaSpeedX;
    } else if(this.NinjaMove === 1){
        this.boundingbox = new BoundingBox(this.x - ninjaPadding, this.y, this.walkRightAnimation.frameWidth, this.walkRightAnimation.frameHeight);

        for(var i = 0; i < this.game.mazePieces.length; i++){
            var ent = this.game.mazePieces[i];
            
                if(this.boundingbox.collide(ent.boundingbox)&& ent instanceof(MazePiece) && !ent.trap){
                    ninjaSpeedX = 0;
                    
                }

                if(this.game.circle3d.boundingcircle.collide(this.boundingbox)){
                    ninjaSpeedX = 0;
                }
            
        }
        this.x -= ninjaSpeedX;
    } else if(this.NinjaMove === 2){
        this.boundingbox = new BoundingBox(this.x, this.y - ninjaPadding, this.walkRightAnimation.frameWidth, this.walkRightAnimation.frameHeight);

        for(var i = 0; i < this.game.mazePieces.length; i++){
            var ent = this.game.mazePieces[i];
            
                if(this.boundingbox.collide(ent.boundingbox)&& ent instanceof(MazePiece) && !ent.trap){
                    ninjaSpeedY = 0;
                    
                }

                if(this.game.circle3d.boundingcircle.collide(this.boundingbox)){
                    ninjaSpeedY = 0;
                }
            
        }
        this.y -= ninjaSpeedY;
    } else if(this.NinjaMove === 3){
        this.boundingbox = new BoundingBox(this.x, this.y + ninjaPadding, this.walkRightAnimation.frameWidth, this.walkRightAnimation.frameHeight);

        for(var i = 0; i < this.game.mazePieces.length; i++){
            var ent = this.game.mazePieces[i];
     
                if(this.boundingbox.collide(ent.boundingbox)&& ent instanceof(MazePiece) && !ent.trap){
                    ninjaSpeedY = 0;
                   
                } 

                if(this.game.circle3d.boundingcircle.collide(this.boundingbox)){
                    ninjaSpeedy = 0;
                }
          
        }
        this.y += ninjaSpeedY;
    }
    
    if(!this.game.stopTraps && this.game.circle3d.boundingcircle.collide(this.boundingbox)) {
    	
    	if(this.game.muteSoundfx) {
	    	(ASSET_MANAGER.getAudioAsset("./song/ninja1.wav")).play();
	    	(ASSET_MANAGER.getAudioAsset("./song/ninja1.wav")).currentTime  = 0;
    	}
    	var randomLocation = Math.floor(Math.random() * (this.game.solutionPieces.length)); //Math.floor(Math.random() * (max - min)) + min;
//    	console.log("SolutionPieces: " + this.game.solutionPieces.length);
//    	console.log("Random Location: " + randomLocation);
    	var pl = this.game.solutionPieces[randomLocation];
    	this.x = pl.x;
    	this.y = pl.y;
    	if(this.game.totCoins >= 3) {
    		this.game.totCoins -= 3;
    	} else {
    		this.game.totCoins = 0;
    	}
    }
    
 
 
     Entity.prototype.update.call(this);
 };
 
 Ninja.prototype.draw = function (ctx) {
     if (this.NinjaMove === 0){
         this.walkRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
     } else if (this.NinjaMove === 1){
         this.walkLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
     } else if (this.NinjaMove === 2){
         this.goUpAndDownAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
     } else if (this.NinjaMove === 3){
         this.goUpAndDownAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
     } 
        
    if (this.boxes) {
            ctx.strokeStyle = "green";
            ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
    }
     Entity.prototype.draw.call(this);
 }