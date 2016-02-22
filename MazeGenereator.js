
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
					maze2D[j][k] = 'X';
				} else {
					if (j>0 && m.verti[j/2-1][Math.floor(k/2)]) {
						maze2D[j][k] = ' ';
					} else {
						maze2D[j][k] = 'X';
					}
				}
			}
		} else {
			for (var k=0; k<m.y*2+1; k++) {
				if (0 == k%2) {
					if (k>0 && m.horiz[(j-1)/2][k/2-1]) {
						maze2D[j][k] = ' ';
					} else { 
						maze2D[j][k] = 'X';
					}
				} else {
					maze2D[j][k] = ' ';
				}
			}
		}
		if (0 == j) {
			maze2D[j][1] = ' ';
		}
		if (m.x*2-1 == j) {
			maze2D[j][2*m.y] = ' ';
		}
	}
	return maze2D;
}

function addCoins(rows, cols, maze, numOfcoins) {
	var coins = 0;
	
	while(coins !== numOfcoins) {
		var x = Math.floor(Math.random() * (rows - 2)) + 2;
		var y = Math.floor(Math.random() * (cols - 2)) + 2;
		
		if(maze[x][y] === ' ') {
			maze[x][y] = 'C';
			coins++;
		}
	}
}

function addTraps(rows, cols, maze, numOfTraps) {
	var traps = 0;
	
	while(traps !== numOfTraps ) {
		var x = Math.floor(Math.random() * (rows - 2)) + 2;
		var y = Math.floor(Math.random() * (cols - 2)) + 2;
		
		if(maze[x][y] === ' ') {
			maze[x][y] = 'T';
			traps++;
		}
	}
}

