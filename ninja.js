function Ninja(game) {
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
     Entity.call(this, game, 10, 430);
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
              this.x += 10;
         } else if(this.lookLeft){
             jumpDistance = this.jumpLeftAnimation.elapsedTime / this.jumpLeftAnimation.totalTime;
              this.x -= 10;
         }
          
         var totalHeight = 50;
 
         if (jumpDistance > 0.5){
             jumpDistance = 1 - jumpDistance;
         }
             
 
         //var height = jumpDistance * 2 * totalHeight;
         var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
 
         this.y = this.ground - height; 
         console.log(this.y);
         
         
     } else if(this.game.walkRight){
         this.lookRight = true;
         this.lookRightOrLeftActive = true;
         this.lookLeft = false;
         this.ground = this.y;
         this.x += 1;
     } else if(this.game.walkLeft){
         this.lookLeft = true;
         this.lookRight = false;
         this.lookRightOrLeftActive = true;
         this.ground = this.y;
         this.x -= 1;
     } else if(this.game.goUp){
         this.lookLeft = false;
         this.lookRight = false;
         this.lookRightOrLeftActive = false;
         this.y -= 1;
     } else if(this.game.goDown){
         this.lookLeft = false;
         this.lookRight = false;
         this.lookRightOrLeftActive = false;
         this.y += 1;
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
     } else if (this.game.walkLeft){
         this.walkLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
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