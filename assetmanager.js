function AssetManager() {
    this.successCount = 0;
    this.errorCount = 0;
    this.cache = [];
    this.downloadQueue = [];
    this.audioCache = [];
    this.audioQueue = [];
}

AssetManager.prototype.queueDownload = function (path) {
//    console.log("Queueing " + path);
    this.downloadQueue.push(path);
}

AssetManager.prototype.queueAudioDownload = function(path){
    this.audioQueue.push(path);
}

AssetManager.prototype.isDone = function () {
    return this.downloadQueue.length === this.successCount + this.errorCount;
}

AssetManager.prototype.downloadAll = function (callback) {
    for(var i = 0; i < this.audioQueue.length; i++){
        var audio = new Audio();
        var that = this;
        var path = this.audioQueue[i];
        audio.src = path;
        this.audioCache[path] = audio;
    }

    for (var i = 0; i < this.downloadQueue.length; i++) {
        var img = new Image();
        var that = this;

        var path = this.downloadQueue[i];
//        console.log(path);

        img.addEventListener("load", function () {
//            console.log("Loaded " + this.src);
            that.successCount++;
            if(that.isDone()) callback();
        });

        img.addEventListener("error", function () {
            console.log("Error loading " + this.src);
            that.errorCount++;
            if (that.isDone()) callback();
        });

        img.src = path;
        this.cache[path] = img;
    }
}

AssetManager.prototype.getAsset = function (path) {
    return this.cache[path];
}

AssetManager.prototype.getAudioAsset = function (path) {
    return this.audioCache[path];
}