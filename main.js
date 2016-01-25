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

function Background(game) {
    Entity.call(this, game, 0, 400);
    this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Maze.png"), 0, 0, 800, 800);
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

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/ninja.png");
ASSET_MANAGER.queueDownload("./img/Maze.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    var ninja = new Ninja(gameEngine);

    gameEngine.addEntity(bg);
    gameEngine.addEntity(ninja);
 
    gameEngine.init(ctx);
    gameEngine.start();
});
