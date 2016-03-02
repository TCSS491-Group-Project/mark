/** Coin function */
function Coin(game, x, y){
	this.startX = x;
    this.startY = y;
	this.x = x;
	this.y = y;
	this.width = 50;
	this.height = 50;
    this.isCoin = true;
    this.trap = true;
    this.someX = 0;
    this.deactivate = false;
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/coin.png"), 0, 0, 100, 100, 0.05, 10, true, false);
	this.boxes = false;
	this.boundingbox = new BoundingBox(this.x + 10, this.y - 40, this.animation.frameWidth, this.animation.frameHeight);
	
	Entity.call(this, game, x, y); // Entity.call(this, game, x, y);
	
}

Coin.prototype = new Entity();
Coin.prototype.constructor = Coin;



Coin.prototype.update = function () {
	if(!this.deactivate) {
		this.x = this.x - this.game.tx;
	    this.y = this.y - this.game.ty;
	} else {
		this.x = 25;
		this.y = 50;
	}
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
	
	
	// ctx.fillStyle = "orange";
 //    ctx.font = "bold 2em Arial";
 //    ctx.fillText("Level: " + this.game.level, 625, 50); // TODO score
    
 //    ctx.fillStyle = "orange";
 //    ctx.font = "bold 2em Arial";
 //    ctx.fillText(" x " + this.game.totCoins, 75, 50);
    
    Entity.prototype.draw.call(this);
}