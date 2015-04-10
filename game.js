var paddleShape = function(x, y){
	this.height = 25;
	this.width = 175;
	this.color = "#0062FF";
	this.x = x;
	this.y = y;
	this.speed = 40;
}

paddleShape.prototype.move = function(x){
	this.x = x;
}

var ballShape = function(x,y){
	this.radius = 12;
	this.width = this.radius * 2;
	this.height = this.radius * 2;
	this.color = "red";
	this.x = x;
	this.y = y;
	this.xDirection = 0;
	this.yDirection = 5;
}

ballShape.prototype.move = function(){
	var xloc = this.x + 2 * this.xDirection;
	var yloc = this.y + 2 * this.yDirection;
	this.x = xloc;
	this.y = yloc;
}

ballShape.prototype.detectCollision = function(obj){
	var ball = this;
	if(ball.y - ball.radius <= obj.y + obj.height && ball.y + ball.radius >= obj.y){
			if(ball.x >= obj.x && ball.x <= obj.x + obj.width / 4){
				ball.xDirection = -4;
				ball.yDirection *= -1;
				return true;
			} else if(ball.x >= obj.x + obj.width / 4 && ball.x <= obj.x + obj.width / 3){
				ball.xDirection = -3;
				ball.yDirection *= -1;
				return true;
			} else if(ball.x >= obj.x + obj.width / 3 && ball.x < obj.x + obj.width / 2 - ball.width){
				ball.xDirection = -2;
				ball.yDirection *= -1;
				return true;
			} else if(ball.x >= obj.x + Math.ceil(obj.width / 2 - ball.width) && ball.x <= obj.x + Math.ceil(obj.width / 2 + ball.width)){
				ball.yDirection *= -1;
				return true;
			} else if(ball.x >= (obj.x + obj.width) - (obj.width / 2) && ball.x <= (obj.x + obj.width) - (obj.width / 3)){
				ball.xDirection = 2;
				ball.yDirection *= -1;
				return true;
			} else if(ball.x >= (obj.x + obj.width) - (obj.width / 3) && ball.x <= (obj.x + obj.width) - (obj.width / 4)){
				ball.xDirection = 3;
				ball.yDirection *= -1;
				return true;
			} else if(ball.x >= (obj.x + obj.width) - (obj.width / 4) && ball.x <= (obj.x + obj.width)){
				ball.xDirection = 4;
				ball.yDirection *= -1;
				return true;
			}
		}
	return false;
}

var blockShape = function(x, y, color){
	this.height = 25;
	this.width = 50;
	this.color = color;
	this.x = x;
	this.y = y;
}

var Game = function(){
	this.controls = {
		"reset": 'R'
	}
}

Game.prototype.start = function(){
	this.initCanvas();
	this.generateBlocks();
	this.drawBlocks();
	this.initPaddle();
	this.drawPaddle();
	this.balls = [];
	this.initBall();
	this.drawBall();
}

Game.prototype.initCanvas = function(){
	c1=document.getElementById("gameCanvas");
	c2=document.getElementById("canvas1");
	c3=document.getElementById("canvas2");
	this.paddleCtx=c1.getContext("2d");
	this.ballCtx=c2.getContext("2d");
	this.blockCtx=c3.getContext("2d");
	this.width = c1.width;
	this.height = c1.height;

}

Game.prototype.initPaddle = function(){
	var game = this;
	game.paddle = new paddleShape(0, 0);
	game.paddle.x = Math.ceil((game.width / 2) - (game.paddle.width / 2));
	game.paddle.y = Math.ceil((game.height - (game.height / 6)));
}

Game.prototype.drawPaddle = function(){
	var game = this;
	game.paddleCtx.fillStyle = game.paddle.color;
	game.paddleCtx.fillRect(game.paddle.x,game.paddle.y,game.paddle.width,game.paddle.height);
}

Game.prototype.clearPaddle = function(){
	var game = this;
	game.paddleCtx.clearRect(game.paddle.x,game.paddle.y,game.paddle.width,game.paddle.height);
}

Game.prototype.initBall = function(){
	var game = this;
	var x = Math.ceil((game.width / 2) - (new ballShape(0,0).radius * 2));
	var y = Math.ceil((game.height / 2) - (new ballShape(0,0).radius * 2));
	game.ballCount = game.balls.push(new ballShape(x, y));
}

Game.prototype.drawBall = function(i){
	var game = this;
	if(i == undefined) i = 0;
	game.ballCtx.fillStyle = game.balls[i].color;
	game.ballCtx.beginPath();
	game.ballCtx.arc(game.balls[i].x, game.balls[i].y, game.balls[i].radius, 0, 2 * Math.PI);
	game.ballCtx.fill();
}

Game.prototype.clearBall = function(i){
	var game = this;
	if(i == undefined) i = 0;
	game.ballCtx.clearRect(game.balls[i].x - game.balls[i].radius, game.balls[i].y - game.balls[i].radius, game.balls[i].radius * 2, game.balls[i].radius * 2);
}


Game.prototype.generateBlocks = function(){
	var game = this;
	game.blocks = [];
	var blockWidth = new blockShape(0,0).width;
	var blockHeight = new blockShape(0,0).height;
	for(var j = 3; j <= 10; j++){
		var color = '#'+Math.floor(Math.random()*16777215).toString(16);
		for (var i = 0; i <= (game.width / blockWidth)-1; i++) {
			game.blocks.push(new blockShape(i * blockWidth, j * blockHeight, color));
		};
	}
}

Game.prototype.drawBlocks = function(){
	var game = this;
	for(var i in game.blocks){
		var block = game.blocks[i];
		game.blockCtx.fillStyle = "black";
		game.blockCtx.fillRect(block.x,block.y,block.width,block.height);
		game.blockCtx.fillStyle = block.color;
		game.blockCtx.fillRect(block.x + 2,block.y + 2,block.width - 4,block.height - 4);
	}
}

Game.prototype.clearBlock = function(block){
	var game = this;
	game.blockCtx.clearRect(block.x,block.y,block.width,block.height);
}

Game.prototype.run = function(){
	var game = this;
	window.onmousemove = function(event){
		if(event.clientX + game.paddle.width < game.width && event.clientX > 0){
			game.clearPaddle();
			game.paddle.move(event.clientX);
			game.drawPaddle();
		}
	}
	window.onkeydown = function(event){
		if(String.fromCharCode(event.which) == game.controls.reset){
				game.initBall();
				game.drawBall();
		}
	}
	game.balls.forEach(function(_, i){
		game.balls[i].detectCollision(game.paddle);
		game.blocks.forEach(function(_, j){
			if(game.balls[i].detectCollision(game.blocks[j])){
				game.clearBlock(game.blocks[j]);
				game.blocks.splice(j, 1);
			}
		})
		if(game.balls[i].y - game.balls[i].radius <= 0){
			game.balls[i].yDirection *= -1;
		}
		if(game.balls[i].y >= game.height){
			game.clearBall(i);
			game.balls.splice(i, 1);
			return;
		}
		if(game.balls[i].x <= 0){
			game.balls[i].xDirection *= -1;
		}
		if(game.balls[i].x + game.balls[i].radius >= game.width){
			game.balls[i].xDirection *= -1;
		}
		game.clearBall(i);
		game.balls[i].move();
		game.drawBall(i);	
	})
	requestAnimationFrame(function(){ game.run() });
}

window.onload = function(){
	game = new Game();
	game.start();
	game.run();
}


