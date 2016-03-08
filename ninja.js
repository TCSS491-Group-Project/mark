function Ninja(game, x, y) {
     //this.animation = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
     //this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 618, 334, 174, 138, 0.02, 40, false, true);
 
     this.animation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 0, 0, 50, 77, 0.05, 1, true, false);
     this.walkRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 0, 155, 50, 77, 0.08, 8, true, false);
     this.LookRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 0, 155, 50, 77, 0.08, 1, true, false);
     this.walkLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 0, 77, 50, 77, 0.08, 8, true, false);
     this.LookLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 0, 77, 50, 77, 0.08, 1, true, false);
     this.goUpAndDownAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 200, 0, 50, 77, 0.08, 4, true, false);
     this.jumpRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 200, 309, 50, 77, 0.08, 3, false, false);
     this.jumpLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/ninja.png"), 0, 309, 50, 77, 0.08, 3, false, true);
     this.radius = 100;
     this.ground = 430;
     this.x = x;
     this.y = y;
     this.currSec = Math.floor(game.timer.gameTime) % 60; 
     this.gameSecs = this.currSec;
     Entity.call(this, game, this.x, this.y);
 }
 
 Ninja.prototype = new Entity();
 Ninja.prototype.constructor = Ninja;
 
 Ninja.prototype.update = function () {
   this.gameSecs = Math.floor(this.game.timer.gameTime) % 60;
   if(this.currSec !== this.gameSecs) {
	   this.NinjaMove = Math.floor(Math.random() * 4);
	   this.currSec = this.gameSecs;
   }
// this.game.NinjaMove = Math.floor(Math.random() * 4);
   if(this.NinjaMove === 0){
//         this.lookRight = true;
//         this.lookRightOrLeftActive = true;
//         this.lookLeft = false;
         this.ground = this.y;
         this.x += 1;
     } else if(this.NinjaMove === 1){
         this.lookLeft = true;
         this.lookRight = false;
         this.lookRightOrLeftActive = true;
         this.ground = this.y;
         this.x -= 1;
     } else if(this.NinjaMove === 2){
         this.lookLeft = false;
         this.lookRight = false;
         this.lookRightOrLeftActive = false;
         this.y -= 1;
     } else if(this.NinjaMove === 3){
         this.lookLeft = false;
         this.lookRight = false;
         this.lookRightOrLeftActive = false;
         this.y += 1;
     }
     this.x = this.x - this.game.tx;
     this.y = this.y - this.game.ty;
 
 
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
        
     Entity.prototype.draw.call(this);
 }