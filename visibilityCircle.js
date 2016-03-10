function VisibilityCircle(game, circleG) {
    //this.animation1 = new Animation(ASSET_MANAGER.getAsset("./img/Capture.png"), 0, 0, 10, 10, 0.05, 1, true, false);
    this.circleG = circleG;
    this.gradleTriger = false;
    Entity.call(this, game, 0, 0);
};

VisibilityCircle.prototype = new Entity();

VisibilityCircle.prototype.constructor = VisibilityCircle;

VisibilityCircle.prototype.update = function () {
    if(this.gradleTriger){
        this.circleG -= 5;
        camera = cameraOff;
        this.game.screenOff = true;
        if(this.circleG < 0){
            this.gradleTriger = false;
            this.circleG = 320;
            camera = cameraOn;
            this.game.screenOff = false;
        }
    }
    Entity.prototype.update.call(this);
}

VisibilityCircle.prototype.draw = function (ctx) {
    //this.animation1.drawFrame(this.game.clockTick, ctx, this.x + 10, this.y - 100);
    
    //ctx.fillStyle = "SaddleBrown";
    
    var gradient = ctx.createRadialGradient(400, 400, this.circleG, 400, 400, 0);
    gradient.addColorStop(0, "black");
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 800);  
    Entity.prototype.draw.call(this);
}