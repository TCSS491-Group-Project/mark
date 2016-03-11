function gameLabel(game) {
    //this.animation1 = new Animation(ASSET_MANAGER.getAsset("./img/Capture.png"), 0, 0, 10, 10, 0.05, 1, true, false);
    this.gameLevel = game.level;
    this.gameTotCoins = game.totCoins;
    this.nextLevelLabel = false;
    this.trapLabel = false;
    this.ninjaLabel = false;
    this.trapCounter = 300;
    this.nextLevelCounter = 300;
    this.ninjaCounter = 300;
    this.gameMins = 0;
    this.gameSecs = 0;
    Entity.call(this, game, 0, 0);
};

gameLabel.prototype = new Entity();

gameLabel.prototype.constructor = gameLabel;

gameLabel.prototype.update = function () {
    this.gameLevel = this.game.level;
    this.gameTotCoins = this.game.totCoins;

    this.gameMins = Math.floor(Math.floor(this.game.timer.gameTime) / 60);
    if(this.gameMins < 10) this.gameMins = "0" + this.gameMins;


    this.gameSecs = Math.floor(this.game.timer.gameTime) % 60;
    if(this.gameSecs < 10) this.gameSecs = "0" + this.gameSecs;
    
   if(this.game.startTrapTime) {
	   this.game.currTime = Math.floor(this.game.timer.gameTime);
	   this.game.startTrapTime = false;
	   this.game.continueTrapTime  = true;
   } else if(this.game.continueTrapTime) {
	   var sub = Math.floor(this.game.timer.gameTime) - this.game.currTime;
	   this.game.currTime = Math.floor(this.game.timer.gameTime);
//	   console.log(" >>> Sub Time: " +  sub);
	   this.game.trapTime -= sub;
//	   console.log("TIME: " + this.game.trapTime);
//	   this.game.currTime = this.gameSecs;
   }
   if(this.game.trapTime <= 0){
	   this.game.continueTrapTime = false;
	   this.game.stopTraps = false;
//	   this.game.currTime = 20;
//	   this.game.disableTrap = false;
   }
   

    if (this.nextLevelLabel){
        this.nextLevelCounter -= 2;
        if(this.nextLevelCounter < 0){ //TODO hereehrherhehrhehrhe
            this.nextLevelCounter = 300;
            this.nextLevelLabel = false;
        }
    }
    if (this.trapLabel){
        this.trapCounter -= 2;
        if(this.trapCounter < 0){
            this.trapCounter = 300;
            this.trapLabel = false;
        }
    }
    if (this.ninjaLabel){
        this.ninjaCounter -= 2;
        if(this.ninjaCounter < 0){
            this.ninjaCounter = 300;
            this.ninjaLabel = false;
        }
    }

    var musicChck = document.getElementById("Music");
    if(musicChck.checked){
        //console.log("checked");
    	this.game.musicSnd.muted = false;
    }else{
    	this.game.musicSnd.muted = true;
        //console.log("notChecked");
    }
    
    var soundfx = document.getElementById("SoundEffects");
    if(soundfx.checked){
    	this.game.muteSoundfx = true;
    } else {
    	this.game.muteSoundfx = false;
    }
    
    
    Entity.prototype.update.call(this);
}

gameLabel.prototype.draw = function (ctx) {

    ctx.fillStyle = "white";
    ctx.font = "bold 2em Arial";
    ctx.fillText("Level: " + this.game.level, 625, 50); // TODO score
    
    ctx.fillStyle = "orange";
    ctx.font = "bold 2em Arial";
    ctx.fillText(" x " + this.game.totCoins, 75, 50);

    ctx.fillStyle = "white";
    ctx.font = "bold 1.5em Arial";
    ctx.fillText("Time " + this.gameMins + ":" + this.gameSecs, 625, 80);
    
    if(this.game.continueTrapTime) {
    	ctx.fillStyle = "Red";
        ctx.font = "bold 2em Arial";
        ctx.fillText(this.game.trapTime, 350, 50);
    }

    if(this.nextLevelLabel){
        ctx.fillStyle = "white";
        ctx.font = "bold 3em Arial";
        ctx.fillText("Level: " + this.game.level, 300, 150);
    } 
    if(this.trapLabel){
        ctx.fillStyle = "Red";
        ctx.font = "bold 2em Arial";
        ctx.fillText("You fall on to a trap" , 210, 100);
    }

    if(this.ninjaLabel){
        ctx.fillStyle = "Red";
        ctx.font = "bold 2em Arial";
        ctx.fillText("You got rob by a ninja" , 210, 130);
    }
    Entity.prototype.draw.call(this);
}