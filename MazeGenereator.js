
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

function addTraps(rows, cols, maze, numOfTraps) {
	var traps = 0;
	
	while(traps !== numOfTraps ) {
		var x = Math.floor(Math.random() * (rows - 2)) + 2;
		var y = Math.floor(Math.random() * (cols - 2)) + 2;
		
		if(maze[x][y] === " ") {
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

