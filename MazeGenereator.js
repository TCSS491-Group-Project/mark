
function generateMaze(x,y) {
	var n=x*y-1;
	if (n<0) {alert("illegal maze dimensions");return;}
	var horiz =[]; for (var j= 0; j<x+1; j++) horiz[j]= [],
	    verti =[]; for (var j= 0; j<x+1; j++) verti[j]= [],
	    here = [Math.floor(Math.random()*x), Math.floor(Math.random()*y)],
	    path = [here],
	    unvisited = [];
	for (var j = 0; j<x+2; j++) {
		unvisited[j] = [];
		for (var k= 0; k<y+1; k++)
			unvisited[j].push(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
	}
	while (0<n) {
		var potential = [[here[0]+1, here[1]], [here[0],here[1]+1],
		    [here[0]-1, here[1]], [here[0],here[1]-1]];
		var neighbors = [];
		for (var j = 0; j < 4; j++)
			if (unvisited[potential[j][0]+1][potential[j][1]+1])
				neighbors.push(potential[j]);
		if (neighbors.length) {
			n = n-1;
			next= neighbors[Math.floor(Math.random()*neighbors.length)];
			unvisited[next[0]+1][next[1]+1]= false;
			if (next[0] == here[0])
				horiz[next[0]][(next[1]+here[1]-1)/2]= true;
			else 
				verti[(next[0]+here[0]-1)/2][next[1]]= true;
			path.push(here = next);
		} else 
			here = path.pop();
	}
	return {x: x, y: y, horiz: horiz, verti: verti};
} 

function getMazeField(m) {
	var maze2D = [];
	for (var j= 0; j<m.x*2+1; j++) {
		maze2D[j] = [];
		if (0 == j%2){
			for (var k=0; k<m.y*2+1; k++) {
				if (0 == k%2) {
					maze2D[j][k] = "X";
				} else {
					if (j>0 && m.verti[j/2-1][Math.floor(k/2)]) {
						maze2D[j][k] = " ";
					} else {
						maze2D[j][k] = "X";
					}
				}
			}
		} else {
			for (var k=0; k<m.y*2+1; k++) {
				if (0 == k%2) {
					if (k>0 && m.horiz[(j-1)/2][k/2-1]) {
						maze2D[j][k] = " ";
					} else { 
						maze2D[j][k] = "X";
					}
				} else {
					maze2D[j][k] = " ";
				}
			}
		}
		if (0 == j) {
			maze2D[j][1] = 1;
		}
		if (m.x*2-1 == j) {
			maze2D[j][2*m.y] = 'E';
		}
	}
	return maze2D;
}

function Maze(x, y, game, addFeatures) {
	this.maze = getMazeField(generateMaze(x,y));
//	addCoins(rows, cols, maze, numOfcoins) {
    this.length = this.maze[0].length;
    this.width = this.maze.length;
    if(addFeatures) {
	    addCoins(this.length, this.width, this.maze, game.numCoins);  
	    addTraps(this.length, this.width, this.maze, game.numTraps);
	    addNinjas(this.length, this.width, this.maze, game.numNinjas);
    }
    
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

function createMazePieces(game, maze, mazeP) {
	var mazePieces = [];
//    console.log(maze.length);
	var tempCoins = [];
	var tempTraps = [];
	game.solutionPieces = [];
	for(var r = 0; r < maze.width ; r++) {
		for(var c = 0; c < maze.maze[0].length  ; c++) {
			if(maze.maze[r][c] !== 'X' && maze.maze[r][c] !== 'E') { // the solution
                var pl = new testMazePath(game, (c * 175) + 250, (r * 175) + 400, r, c); // x, y, width, height
                game.addEntity(pl);
                game.solutionPieces.push(pl);
            }
//			string += maze.maze[r][c] + " ";
			if(maze.maze[r][c] === 'X') {
				var pl = new MazePiece(game, (c * 175) + 175, (r * 175) + 295 , 175, 175, false, false, false); // x, y, width, height
				game.addEntity(pl);
				mazePieces.push(pl); 
			} else if (maze.maze[r][c] === 'C') {
//				var pl = new Coin(game, (c * 175) + 195, (r * 175) + 355); // // x, y, width, height
//				game.addEntity(pl);
//				mazePieces.push(pl);
				tempCoins.push(new Coin(game, (c * 175) + 195 + 35, (r * 175) + 355 + 35));
			} else if(maze.maze[r][c] === 'T') {
				var isHorirontal = false;
				if(maze.maze[r][c - 1] === 'X' || maze.maze[r][c + 1] === 'X') isHorirontal = true;
				tempTraps.push(new MazePiece(game, (c * 175) + 175, (r * 175) + 295 , 100, 175, true, false, isHorirontal)); // x, y, width, height 
			} else if(maze.maze[r][c] === 'E') {
				var pl = new MazePiece(game, (c * 175) + 175, (r * 175) + 295 , 175, 175, false, true, false); // x, y, width, height
				game.addEntity(pl);
				mazePieces.push(pl); 
			} else if(maze.maze[r][c] === 'N') {
				var pl = new Ninja(game, (c * 175) + 195 + 35, (r * 175) + 355);
				game.addEntity(pl);
				mazePieces.push(pl);
			}
		}
//		string += '\r\n';
	}
	
	for(var i = 0; i < tempTraps.length; i++) {
		var pl = tempTraps[i];
		game.addEntity(pl);
		mazePieces.push(pl);
	}
	
	var shade = new VisibilityCircle(game, 300); //TODO  shade
    shade.gradleTriger = true;
    game.addEntity(shade);
    
	for(var i = 0; i < tempCoins.length; i++) {
		var pl = tempCoins[i];
		game.addEntity(pl);
		mazePieces.push(pl);
		
	}
	// Static coin counter
	var pl = new Coin(game, 0, 50)
	pl.deactivate = true;
	game.addEntity(pl);
	
	//Starting block blocker
    var pl = new MazePiece(game, ( 175) + 175, (-175) + 295 , 175, 175);
    pl.startTop = true;
    pl.boxes = false;
    game.addEntity(pl);
    mazePieces.push(pl);
	return mazePieces;
};

function testMazePath(game, x, y, r, c){
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.column = c;
    this.row = r;
    this.colors = ["Red", "transparent" ];
    this.color = 1;

    this.someX = 0;
    
    this.boxes = true;
    
    Entity.call(this, game, x, y); // Entity.call(this, game, x, y);
    
}

testMazePath.prototype = new Entity();
testMazePath.prototype.constructor = testMazePath;

testMazePath.prototype.update = function () {
    this.x = this.x - this.game.tx;
    this.y = this.y - this.game.ty;
    Entity.prototype.update.call(this);
}

testMazePath.prototype.draw = function (ctx) {
    if (this.boxes) {

        //ctx.strokeStyle = "green";
        ctx.fillStyle = this.colors[this.color];
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
    }


    Entity.prototype.draw.call(this);
}


function mazeTrapReset(game) { 
	for (var i = 0; i < game.mazePieces.length; i++) {
		game.mazePieces[i].x = game.mazePieces[i].startX;
		game.mazePieces[i].y = game.mazePieces[i].startY;
		game.mazePieces[i].update();
	}
	for(var i = 0; i < game.entities.length; i++) {
		var temp = game.entities[i];
		if(temp instanceof(testMazePath)) {
			temp.x = temp.startX;
			temp.y = temp.startY;
		} else if(temp instanceof(VisibilityCircle)){
            temp.gradleTriger = true;
        }
	}
}

function MazePiece(game, x, y, width, height, isTrap, isExit, isHorizontalTrap) {
    this.width = width;
    this.height = height;
    this.startX = x;
    this.startY = y;
    this.moveIncrement = 0;
    this.exit = isExit;
    if(isTrap && isHorizontalTrap) {
    	this.boundingbox = new BoundingBox(x, y, height, width);
    	this.desactivated = false;
    } else if(isTrap){
    	this.boundingbox = new BoundingBox(x, y, width, height);
    	this.desactivated = false;
    } else {
    	this.boundingbox = new BoundingBox(x, y, width, height);
    }
    
    
    this.boxes = false;  // TODO bounding boxes true/false
    this.trap = isTrap;
    this.horizontalTrap = isHorizontalTrap; 
    if(this.trap && this.horizontalTrap){ // currentFrame
    	this.animationHorizontal = new Animation(ASSET_MANAGER.getAsset("./img/trap1.png"), 0, 0, 252, 144, 0.12, 22, true, false); // running
    	this.horizontalDesactivated = new Animation(ASSET_MANAGER.getAsset("./img/trapDisableHorizontal.png"), 0, 0, 252, 144, 0.12, 1, true, false); // running
    } else if(this.trap){
    	this.animationVertical = new Animation(ASSET_MANAGER.getAsset("./img/trap2.png"), 0, 0, 144, 252, 0.12, 22, true, false); // running
    	this.verticalDesactivated = new Animation(ASSET_MANAGER.getAsset("./img/trapDisable.png"), 0, 0, 144, 252, 0.12, 1, true, false); // running
    }
	Entity.call(this, game, x, y);
}

MazePiece.prototype = new Entity();
MazePiece.prototype.constructor = MazePiece;

MazePiece.prototype.update = function () {
	
    
    this.x = this.x - this.game.tx;
    this.y = this.y - this.game.ty;

    var playShockSound = false;
    if(this.trap && this.horizontalTrap) {
    	this.boundingbox = new BoundingBox(this.x, this.y + 75, this.height, this.width - 30);
    	this.trapFrame = this.animationHorizontal.currentFrame();
        var pf = this.game.circle3d;
        if (pf.boundingcircle.collide(this.boundingbox)) { 
	        if(!this.desactivated){	
	        	if(this.trapFrame < 10 && !this.game.stopTraps) {
	        		this.game.tx = 0;
	        		this.game.ty = 0;
	        		playShockSound = true;
	        		if(this.game.totCoins !== 0) this.game.totCoins--;
	        		this.desactivated = true;
	                //tell user they fall in the trap
	                this.game.gameLabel.trapLabel = true;
	        		mazeTrapReset(this.game);
	        		this.game.screenOff = true;
	        		
	        	}
	        }
	    }
    } else if(this.trap){
    	this.boundingbox = new BoundingBox(this.x + 65, this.y, this.width - 30, this.height);
    	this.trapFrame = this.animationVertical.currentFrame();

    	var pf = this.game.circle3d;
        if (pf.boundingcircle.collide(this.boundingbox)) { 
        	if(!this.desactivated){	    	
	        	if(this.trapFrame < 10 && !this.game.stopTraps) {
	        		this.game.tx = 0;
	        		this.game.ty = 0;
	        		playShockSound = true;
	        		if(this.game.totCoins !== 0) this.game.totCoins--;
	        		this.desactivated = true;
	                //tell user they fall in the trap
	                this.game.gameLabel.trapLabel = true;
	        		mazeTrapReset(this.game);
	        		this.game.screenOff = true;
	        	}
        	}
	    }
    } else {
    	this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
    }
    
    if(playShockSound && this.game.muteSoundfx) {
    	this.game.shockSnd.play();
    	playShockSound = false;
    	this.game.shockSnd.currentTime  = 0;
    }
    Entity.prototype.update.call(this);
    
};

MazePiece.prototype.draw = function (ctx) {
    
	if(this.trap) {
//		ctx.fillStyle = "blue";
//		ctx.fillRect(this.x, this.y, this.width, this.height);
		if(this.horizontalTrap) {
			if(!this.desactivated) {
				this.animationHorizontal.drawFrame(this.game.clockTick, ctx, this.x - 40, this.y + 40, 1);
			} else {
				this.horizontalDesactivated.drawFrame(this.game.clockTick, ctx, this.x - 40, this.y + 40, 1);
			}	
		} else {
			if(!this.desactivated) {
				this.animationVertical.drawFrame(this.game.clockTick, ctx, this.x + 30, this.y - 40, 1);
			} else {
				this.verticalDesactivated.drawFrame(this.game.clockTick, ctx, this.x + 30, this.y - 40, 1);
			}
		}
	} else if(this.startTop) {
		ctx.fillStyle = "transparent";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	} else if(this.exit){
		ctx.drawImage(ASSET_MANAGER.getAsset("./img/exitFlag.png"), this.x, this.y, this.width, this.height);
	} else {
//		ctx.fillStyle = "black";
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.drawImage(ASSET_MANAGER.getAsset("./img/bricks.jpg"), this.x, this.y, this.width, this.height);
	}
    
    if (this.boxes) {
            ctx.strokeStyle = "green";
            ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
    }
   
    Entity.prototype.draw.call(this);
}

//solve the path with the current x, y coordinate
function pathSolver(game, r, c){
    var correctPath = new Maze(game.mazeSize, game.mazeSize, game, false);
    var temp = new Maze(game.mazeSize, game.mazeSize, game, false);

    var ms = new solveMaze(game.myMaze, correctPath.maze, temp.maze);
    console.log(ms.traverse(r, c));
    //printMaze(correctPath.maze);

    this.length = game.myMaze.length;
    this.width = game.myMaze[0].length;

    for(var r = 0; r < this.length; r++) {
        for(var c = 0; c < this.width; c++) {
            if(correctPath.maze[r][c]){
                for(var t = 0; t < game.entities.length; t++){
                    var cp = game.entities[t];
                    if(cp instanceof(testMazePath) && cp.row === r && cp.column ===c){
                        cp.color = 0;
                    }
                }
            }  
        }
    }

};

function addCoins(rows, cols, maze, numOfcoins) {
	var coins = 0;
	
	while(coins !== numOfcoins) {
		var x = Math.floor(Math.random() * (rows - 2)) + 2;
		var y = Math.floor(Math.random() * (cols - 2)) + 2;
		
		if(maze[x][y] === " ") {
			maze[x][y] = "C";
			coins++;
		}
	}
}

function addNinjas(rows, cols, maze, numOfcoins) {
	var ninjas = 0;
	while(ninjas !== numOfcoins) {
		var x = Math.floor(Math.random() * (rows - 2)) + 2;
		var y = Math.floor(Math.random() * (cols - 2)) + 2;
		
		if(maze[x][y] === " ") {
			maze[x][y] = "N";
			ninjas++;
		}
	}
}

function addTraps(rows, cols, maze, numOfTraps) {
	var traps = 0;
	
	while(traps !== numOfTraps ) {
		var x = Math.floor(Math.random() * (rows - 2)) + 1;
		var y = Math.floor(Math.random() * (cols - 2)) + 1;
		var okayTrap = false;
		if(maze[x - 1][y] === 'X' && maze[x + 1][y] === 'X') okayTrap = true;
		if(maze[x][y - 1] === 'X' && maze[x][y + 1] === 'X') okayTrap = true;
		
		if(maze[x][y - 1] === 'X' && maze[x][y + 1] === 'X' && maze[x - 1][y] === 'X') okayTrap = false;
		if(maze[x][y - 1] === 'X' && maze[x][y + 1] === 'X' && maze[x + 1][y] === 'X') okayTrap = false;
		if(maze[x - 1][y] === 'X' && maze[x + 1][y] === 'X' && maze[x][y - 1] === 'X') okayTrap = false;
		if(maze[x - 1][y] === 'X' && maze[x + 1][y] === 'X' && maze[x][y + 1] === 'X') okayTrap = false;
		
		if(maze[x][y] === " " && okayTrap) {
			maze[x][y] = "T";
			traps++;
		}
	}
}

function solveMaze(maze, mazeC, mazeW){
	this.maze = maze;

	var wasHere = mazeW;
	var correctPath = mazeC;
	//console.log(this.maze[0][0]);
	for(var r = 0; r < this.maze.length; r++) {
		for(var c = 0; c < this.maze[0].length  ; c++) {
			
			correctPath[r][c] = false;
			wasHere[r][c] = false;
		}
	};
	//console.log(mazeW[1][1]);
	this.traverse = function(x, y) {
		//console.log(wasHere[1][1]);
        if(x === this.maze.length - 1 && y === this.maze[0].length - 1 ) {
        	return true;
        }
        
        if(this.maze[x][y] === "X" || wasHere[x][y]) {
            //console.log("we reach the end");
            return false;
        }
        wasHere[x][y] = true;
        //console.log("2");
        if(x != 0){
        	if(this.traverse(x-1, y)){
        		correctPath[x][y] = true;
        		return true;
        	}
        }
        if( x != this.maze.length - 1){
        	if(this.traverse(x+1, y)){
        		correctPath[x][y] = true;
        		return true;
        	}
        }
        if(y != 0){
        	if (this.traverse(x, y-1)){
        		correctPath[x][y] = true;
        		return true;
        	}
        }
        if(y != this.maze[0].length - 1){
        	if (this.traverse(x, y+1)){
        		correctPath[x][y] = true;
        		return true;
        	}
        }
        return false;
    }
};

function printMaze(maze){
    this.maze = maze;

    var string = '';
    this.length = this.maze.length;
    this.width = this.maze[0].length;

    for(var r = 0; r < this.length; r++) {
        for(var c = 0; c < this.width; c++) {
            if(maze[r][c]){
                string += "1 ";
            } else {
                string += "2 ";
            }
            
        }
        string += '\r\n';
    }
    console.log(string);
}

