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
	this.yDirection = 1;
	this.ySpeed = 5;
}

ballShape.prototype.move = function(){
	var xloc = this.x + 2 * this.xDirection;
	var yloc = (this.y + 2 * this.yDirection * this.ySpeed);
	this.x = xloc;
	this.y = yloc;
}

ballShape.prototype.detectCollision = function(obj){
	var ball = this;
	var ballEdge = ball.y - ball.radius;
	if(ballEdge < obj.y + obj.height && ballEdge > obj.y - obj.height){
			if(ball.x >= obj.x && ball.x <= obj.x + (obj.width / 8)){
				ball.xDirection = -4;
				ball.yDirection *= -1;
				return true;
			} else if(ball.x >= (obj.x + obj.width / 8) && ball.x < obj.x + ((obj.width / 8) * 2)){
				ball.xDirection = -3;
				ball.yDirection *= -1;
				return true;
			} else if(ball.x >= obj.x + ((obj.width / 8) * 2) && ball.x < obj.x + ((obj.width / 8) * 3)){
				ball.xDirection = -2;
				ball.yDirection *= -1;
				return true;
			} else if(ball.x >= obj.x + ((obj.width / 8) * 3) && ball.x <= obj.x + (obj.width / 2)){
				ball.xDirection = -1;
				ball.yDirection *= -1;
				return true;
			} else if(ball.x >= obj.x + (obj.width / 2) && ball.x <= obj.x + ((obj.width / 8) * 5)){
				ball.xDirection = 1;
				ball.yDirection *= -1;
				return true;
			} else if(ball.x >= obj.x + ((obj.width / 8) * 5) && ball.x <= obj.x + ((obj.width / 8) * 6)){
				ball.xDirection = 2;
				ball.yDirection *= -1;
				return true;
			} else if(ball.x >= obj.x + ((obj.width / 8) * 6) && ball.x <= obj.x + ((obj.width / 8) * 7)){
				ball.xDirection = 3;
				ball.yDirection *= -1;
				return true;
			} else if(ball.x >= obj.x + ((obj.width / 8) * 7) && ball.x <= (obj.x + obj.width)){
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
	var game = this;
	this.initCanvas();
	this.generateBlocks();
	this.drawBlocks();
	this.initPaddle();
	this.drawPaddle();
	this.balls = [];
	this.initBall();
	this.drawBall();
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
	forEach(game.balls, function(i, ball){
		ball.detectCollision(game.paddle);
		forEach(game.blocks, function(j, block){
			if(ball.detectCollision(block)){
				game.clearBlock(block);
				game.blocks.splice(j, 1);
			} 
		})
		if(ball.y - ball.radius <= 0){
			ball.yDirection *= -1;
		}
		if(ball.y >= game.height){
			game.clearBall(i);
			game.balls.splice(i, 1);
			return;
		}
		if(ball.x <= 0){
			ball.xDirection *= -1;
		}
		if(ball.x + ball.radius >= game.width){
			ball.xDirection *= -1;
		}
		game.clearBall(i);
		ball.move();
		game.drawBall(i);	
	})
	requestAnimationFrame(function(){ game.run() });
}

window.onload = function(){
	game = new Game();
	game.start();
	game.run();
}

var forEach = function(arr, cb){
	for(var i in arr){
		cb(i, arr[i])
	}
	return;
}


