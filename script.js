/* #               world class             #*/
function World(arr) {
	this.map = arr;
}

var arr = [
	[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
	[2,0,1,1,2,1,1,1,1,1,1,1,1,1,2],
	[2,1,2,1,1,1,2,2,2,1,2,2,2,1,2],
	[2,1,2,1,2,2,2,2,2,1,2,1,1,1,2],
	[2,1,2,1,2,0,0,0,2,1,2,1,2,1,2],
	[2,1,2,1,2,2,0,2,2,1,2,1,2,1,2],
	[2,1,2,1,1,1,1,1,1,1,2,1,2,1,2],
	[2,1,2,2,2,2,2,2,2,2,2,1,2,1,2],
	[2,1,1,1,1,1,1,1,1,1,1,1,2,1,2],
	[2,1,2,2,2,2,2,2,2,2,2,2,2,1,2],
	[2,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
	[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];
world = new World(arr);

function displayWorld() {
	var output = '';
	for(var idx in world.map) {
		output += "\n<div class='row'>\n"
		for(var jdx in world.map[idx]) {
			if(world.map[idx][jdx] == 2) {
				output += "<div class='brick'></div>"
			} else if(world.map[idx][jdx] == 1) {
				output += "<div class='coin'></div>"
			} else {
				output += "<div class='empty'></div>"
			}
		}
		output += "\n</div>"
	}
	document.getElementById('world').innerHTML = output;
}

/* #               pacman class             #*/
function Pacman() {
	this.x = 1;
	this.y = 1;
}

pacman = new Pacman();

document.onkeydown = function(e) {
	console.log(e.keyCode);
	if(e.keyCode == 37) {
		if(world.map[pacman.y][pacman.x-1] != 2) {
			pacman.x--;
		}
	}
	else if(e.keyCode == 39) {
		if(world.map[pacman.y][pacman.x+1] != 2) {
			pacman.x++;
		}
	}
	else if(e.keyCode == 38) {
		if(world.map[pacman.y-1][pacman.x] !== 2) {
			pacman.y--;
		}
	}
	else if(e.keyCode == 40) {
		if(world.map[pacman.y+1][pacman.x] !== 2) {
			pacman.y++;
		}
	}

	if(world.map[pacman.y][pacman.x] == 1) {
		world.map[pacman.y][pacman.x] = 0;
		score.score +=10;
		count--;
		displayWorld();
		displayScore();
		if(count == 0) {
			document.getElementById('win').innerHTML = 'YOU WON!!'
			clearInterval(moveGhost);
		}
	}
	displayPacman();
}

var tracker = [],
	visited = false,
	ghosts  = [],
	countVert,
	moveGhost;
/* #               ghost class             #*/
function Ghost() {
	this.x = 6;
	this.y = 4;
	this.escapeHome = function() {
		if(world.map[this.y+1][this.x] != 2) {
			console.log(world.map[this.y+1][this.x])
			this.y++;
		} else {
			this.x--;
			clearInterval(escape);
			moveGhost = setInterval(function(){ghost.move()},500);
		}
		this.displayGhost();
	}
	this.displayGhost = function() {
		document.getElementById('ghost').style.top = this.y*20+"px"
		document.getElementById('ghost').style.left = this.x*20+"px"
		document.getElementById('ghost').style.display = "block";
		setInterval(function(){
			for(var ghost in ghosts) {
				ghosts[ghost].eat(pacman.x, pacman.y)
			}
		}, 100);
	}

	this.isStuck = function(ltr) {
		if(ltr && ltr == 'x') {
			console.log('stuck x')
			if(this.y > 5 && world.map[this.y+1][this.x] != 2) {
				var y = setInterval(this.y++, 500);
			} else if (world.map[this.y-1][this.x] != 2){
				var y = setInterval(this.y--, 500);
			} else {
				clearInterval(y);
			}
		} else if(ltr && ltr == 'y') {
			console.log('stuck y')
			if(this.x > 5 && world.map[this.y][this.x+1] != 2) {
				console.log('')
				var x = setInterval(this.x++, 500);
			} else if (world.map[this.y][this.x-1] != 2){
				var x = setInterval(this.x--, 500);
			} else {
				clearInterval(x);
			}
		}
	}
	this.move = function() {
		if(pacman.x < this.x) {
			if(world.map[this.y][this.x-1] != 2) {
				this.x--;
			} else {
				this.isStuck('x');
			}
		} else if(pacman.y > this.y) {
			if(world.map[this.y+1][this.x] != 2) {
				this.y++;
			} else {
				this.isStuck('y');
			}
		} else if(pacman.x > this.x) {
			if(world.map[this.y][this.x+1] != 2) {
				this.x++;
			} else {
				console.log('escaping stuck')
				this.isStuck('x');
			}
		} else if(pacman.y < this.y) {
			// console.log(world.map[this.y][this.x+1] == 2)
			if(world.map[this.y-1][this.x] != 2) {
				console.log('pacman less than ghost')
				this.y--;
			} else {
				console.log('pacman above monster')
				this.isStuck('y');
			}
		}
	// 	// // compare X
		this.displayGhost();
	}

	this.eat = function(x,y) {
		if(this.x == x && this.y == y) {
			clearInterval(moveGhost);
			document.getElementById('lost').innerHTML = 'You lost';
		}
	}
}

var ghost = new Ghost();
ghosts.push(ghost);
ghost.displayGhost();
setTimeout(function(){
	console.log(ghosts);
}, 3000);

var escape = setInterval(function(){ghost.escapeHome()},500);

var count = 0;
function countCoins() {
	for(var idx in world.map) {
		for(var jdx in world.map[idx]) {
			if(world.map[idx][jdx] == 1) {
				count++;
			}
		}
	}
}
countCoins();

function displayPacman() {
	document.getElementById('pacman').style.top = pacman.y*20+"px"
	document.getElementById('pacman').style.left = pacman.x*20+"px"
}

/* #               score class             #*/
function Score() {
	this.score = 0;
}

score = new Score();

function displayScore() {
	document.getElementById('score').innerHTML = score.score;
}

displayWorld();
displayPacman();
displayScore();
