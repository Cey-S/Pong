var game ={};
var playArea ={};
var ball ={};
var leftPaddle ={};
var rightPaddle ={};
var paddleMargin = 50;
var lastTick = 0;
var paddleSpeed = 500 / 1000;
var ballSpeed = 400 / 1000;
var controls = {
player1UP : "w",
player1DOWN : "s",
player2UP : "ArrowUp",
player2DOWN : "ArrowDown",
startGame :" ",
};
var keysPressed = {};

var random;
var scorePlayer1 = {};
var scorePlayer2 = {};
var score1 = 0;
var score2 = 0;

function init(){
	initGOs();
	document.addEventListener("keydown", function(keyEvent){
		keysPressed[keyEvent.key] = true;
	}); //,keyPressed
	document.addEventListener("keyup", function(keyEvent){//keyup -> key released
		if (keyEvent.key == controls.startGame) {
			keysPressed[keyEvent.key] = true;
			ball.isMoving = true;
		}else{
			keysPressed[keyEvent.key] = false;
		}
	});
	window.addEventListener('resize', function(event){
  		resizeScreen();
	});
	requestAnimationFrame(loop);	
}

function loop(ts){//time stamp, current time
 	var delta = ts - lastTick;

	handleInput(delta);
	updateGame(delta);

	lastTick = ts;
	requestAnimationFrame(loop);
}

function handleInput(dt){

		if (keysPressed[controls.player1UP]) {
		leftPaddle.y -= dt * paddleSpeed;
		}
		if (keysPressed[controls.player1DOWN]) {
		leftPaddle.y += dt * paddleSpeed;
		}
		if (keysPressed[controls.player2UP]) {
		rightPaddle.y -= dt * paddleSpeed;
		}
		if (keysPressed[controls.player2DOWN]) {
		rightPaddle.y += dt * paddleSpeed;
		}
	
		if(leftPaddle.y < 0){
			leftPaddle.y = 0;
		}

		if (leftPaddle.y > playArea.height - leftPaddle.height) {
			leftPaddle.y = playArea.height - leftPaddle.height;
		}

		if(rightPaddle.y < 0){
			rightPaddle.y = 0;
		}

		if (rightPaddle.y > playArea.height - rightPaddle.height) {
			rightPaddle.y = playArea.height - rightPaddle.height;
		}

	updateDOMFromGO(leftPaddle);
	updateDOMFromGO(rightPaddle);
}

function startOver(){
	keysPressed[controls.startGame] = false;	
	keysPressed[controls.player1DOWN] = false;
	keysPressed[controls.player2DOWN] = false;
	keysPressed[controls.player1UP] = false;
	keysPressed[controls.player2UP] = false;
	ball.isMoving = false;

	generateDirectionForBall();
	ball.x = (playArea.width - ball.width) / 2; 
	ball.y = (playArea.height - ball.height) / 2;
	leftPaddle.x = paddleMargin;
	leftPaddle.y = (playArea.height - leftPaddle.height) / 2;
	rightPaddle.x = (playArea.width - paddleMargin - rightPaddle.width)  ;
	rightPaddle.y = (playArea.height - rightPaddle.height) / 2;
	scorePlayer1.dom.innerText = "Score Player 1: " + score1;
	scorePlayer2.dom.innerText = "Score Player 2: " + score2;

	updateDOMFromGO(leftPaddle);
	updateDOMFromGO(rightPaddle);
	updateDOMFromGO(scorePlayer1);
	updateDOMFromGO(scorePlayer2);
}

function updateGame(delta){
	
	if (keysPressed[controls.startGame]) {
	ball.x += delta * ballSpeed * ball.direction.x;
	ball.y += delta * ballSpeed * ball.direction.y;}
	
	if(ball.x < 0){
		ball.x = 0;
		alert("Player 2 scored!");
		score2 += 1;
		startOver();		
	}
	
	if(ball.x > playArea.width - ball.width) {
		ball.x = playArea.width - ball.width;
		alert("Player 1 scored!");
		score1 += 1;
		startOver();
	}

	if(ball.y < 0) {
		ball.y = 0;
		ball.direction.y *= -1;
	}

	if (ball.y > playArea.height - ball.height) {
		ball.y = playArea.height - ball.height;
		ball.direction.y *= -1;
	}
	
	if (aabbCollision(ball, leftPaddle) || aabbCollision(ball, rightPaddle)) {
		ball.direction.x *= -1;
	}

	updateDOMFromGO(ball);
}

function aabbCollision(go1, go2){
	if (go1.x < go2.x + go2.width &&
		go1.x + go1.width > go2.x &&
		go1.y < go2.y + go2.height &&
		go1.y + go1.height > go2.y) {
		return true;
	}else{
		return false;
	}
}

function generateDirectionForBall(){
	random = Math.random();
	if (random < 0.25) {
		ball.direction.x = 1;
		ball.direction.y = 1;
	}else if(random < 0.50 && random > 0.25){
		ball.direction.x = -1;
		ball.direction.y = 1;
	}else if(random < 0.75 && random > 0.50){
		ball.direction.x = 1;
		ball.direction.y = -1;
	}else{
		ball.direction.x = -1;
		ball.direction.y = -1;
	}
}

function resizeScreen(){
	game.width = game.dom.offsetWidth;
	game.height = game.dom.offsetHeight;
	playArea.width = playArea.dom.offsetWidth;
	playArea.height = playArea.dom.offsetHeight;

	rightPaddle.x = (playArea.width - paddleMargin - rightPaddle.width);

	if(!ball.isMoving){
		ball.width = ball.dom.offsetWidth;
		ball.height = ball.dom.offsetHeight;
		ball.x = (playArea.width - ball.width) / 2; 
		ball.y = (playArea.height - ball.height) / 2;
		updateDOMFromGO(ball);
	}

}

function initGOs(){//game objects	
	game.dom = document.getElementById("Game");
	playArea.dom = document.getElementById("PlayArea");

	scorePlayer1.dom = document.getElementById("scoreP1");
	scorePlayer1.dom.innerText +=  score1;	
	scorePlayer2.dom = document.getElementById("scoreP2");
	scorePlayer2.dom.innerText +=  score2;

	leftPaddle.dom = document.getElementById("leftP");
	leftPaddle.width = leftPaddle.dom.offsetWidth;
	leftPaddle.height = leftPaddle.dom.offsetHeight;
	leftPaddle.x = paddleMargin;

	rightPaddle.dom = document.getElementById("rightP");
	rightPaddle.width = rightPaddle.dom.offsetWidth;
	rightPaddle.height = rightPaddle.dom.offsetHeight;

	ball.dom = document.getElementById("Ball");	
	ball.isMoving = false;
	ball.direction = {};
	generateDirectionForBall();	

	resizeScreen();
	
	leftPaddle.y = (playArea.height - leftPaddle.height) / 2;
	updateDOMFromGO(leftPaddle);
	
	rightPaddle.y = (playArea.height - rightPaddle.height) / 2;
	updateDOMFromGO(rightPaddle);	
}

function updateDOMFromGO(go){//game object
	go.dom.style.width = go.width + "px";
	go.dom.style.height = go.height + "px";
	go.dom.style.top = go.y + "px"; 
	go.dom.style.left = go.x + "px";
}