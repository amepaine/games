var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var i;
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
var squareSideLength = 6;

var leftPaddleY = centerY, rightPaddleY = centerY;
var paddleDistanceFromEdge = 60;
var leftPaddleX = paddleDistanceFromEdge;
var rightPaddleX = canvas.width - paddleDistanceFromEdge;
var paddleLongDimension = 40;
var paddleShortDimension = 6;

var playerScore = 0, cpuScore = 0;

var ballX = centerX, ballY = centerY;
var ballXVelocity = getRandomPositiveNegative() * 3, ballYVelocity = getRandomPositiveNegative() * 3;

var leftScoreHorizontalShift = 60;
var p;

//---------from Arthur Schreiber http://preview.tinyurl.com/9lhnbu2
var Key = {
  _pressed: {},

  UP: 38,
  DOWN: 40,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
//----------end of Schreiber's stuff

function updatePaddlePositions(){
  if (Key.isDown(Key.UP)){
    if (rightPaddleY > 60 + paddleLongDimension/2){
      rightPaddleY -= 5;
    }
  }
  if (Key.isDown(Key.DOWN)){
    if (rightPaddleY < canvas.height - (60 + paddleLongDimension/2)){
      rightPaddleY += 5;
    }
  }
  
}

function drawBall(){
  c.fillStyle = "white";
  c.fillRect(ballX - squareSideLength / 2,
            ballY - squareSideLength / 2,
            squareSideLength,
            squareSideLength);
}

function updateBall(){
  //move
  ballX += ballXVelocity;
  ballY += ballYVelocity;
  if(ballY < 63 || ballY > canvas.height - 63)
    ballYVelocity *= -1;
  
  //bounce off paddles
  if(ballX < leftPaddleX + 9 && ballX > leftPaddleX - 3){
    if(Math.abs(ballY - leftPaddleY) < paddleLongDimension / 2){
      console.log("cpu hit");
      ballXVelocity *= -1;
    }
  }
  if(ballX < rightPaddleX && ballX > rightPaddleX - 3){
    if(Math.abs(ballY - rightPaddleY) < paddleLongDimension / 2){
      console.log("player hit");
      ballXVelocity *= -1;
    }
  }
  
  //if missed, serve
  if(ballX <= 40){
    serveBall();
    playerScore++;
  }
  if(ballX >= canvas.width - 40){
    serveBall();
    cpuScore++;
  }
  
  //draw ball
  drawBall();
}

function serveBall(){
  ballX = centerX;
  ballY = centerY;
  ballXVelocity *= getRandomPositiveNegative();
  ballYVelocity *= getRandomPositiveNegative();
}

function drawField(){
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  var numLittleSquares = Math.floor((canvas.height - 120)/12) + 1;
  for (i = 0; i < numLittleSquares; i++){
    var squareStartX = centerX - squareSideLength / 2;
    var squareStartY = 60 + 2 * squareSideLength * i;
    var squareEndX = 2;
    var squareEndY = 6;
    c.fillStyle = "white";
    c.fillRect(squareStartX, squareStartY, squareEndX, squareEndY);
  }
}

function drawPaddles(){
  c.fillStyle = "white";
  c.fillRect(leftPaddleX, 
             leftPaddleY - paddleLongDimension / 2, 
             paddleShortDimension, 
             paddleLongDimension);
  c.fillRect(rightPaddleX, 
             rightPaddleY - paddleLongDimension / 2, 
             paddleShortDimension, 
             paddleLongDimension);
  if(ballX < centerX){
    if(leftPaddleY - ballY > 40){
      leftPaddleY -= 5;
    }
    if(leftPaddleY - ballY < -40){
      leftPaddleY += 5;
    }
    if(100 < ballX < 300 && ballY > leftPaddleY){
      p = Math.random();
      if(p > 0.25)
        leftPaddleY += 4;
    }
    if(100 < ballX < 300 && ballY < leftPaddleY){
      p = Math.random();
      if(p > 0.25)
        leftPaddleY -= 4;
    }
  }
}

function getRandomPositiveNegative(){
  var n = Math.random() * 2;
  if(n <= 1)
    return -1;
  else
    return 1;
}

function drawScores(x, y){
  if(x === 0){
    c.fillStyle = "white";
    c.fillRect(canvas.width / 3, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(canvas.width / 3 + 6, 66, 18, 48);
  }
  if(y === 0){
    c.fillStyle = "white";
    c.fillRect(2 * canvas.width / 3 + leftScoreHorizontalShift, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(2 * canvas.width / 3 + 6 + leftScoreHorizontalShift, 66, 18, 48);
  }
  if(x == 1){
    c.fillStyle = "white";
    c.fillRect(canvas.width / 3, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(canvas.width / 3 + 6, 60, 30, 60);
  }
  if(y == 1){
    c.fillStyle = "white";
    c.fillRect(2 * canvas.width / 3 + leftScoreHorizontalShift, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(2 * canvas.width / 3 + 6 + leftScoreHorizontalShift, 60, 30, 60);
  }
  if(x == 2){
    c.fillStyle = "white";
    c.fillRect(canvas.width / 3, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(canvas.width / 3 - 1, 66, 25, 21);
    c.fillRect(canvas.width / 3 + 6, 93, 25, 21);
  }
  if(y == 2){
    c.fillStyle = "white";
    c.fillRect(2 * canvas.width / 3 + leftScoreHorizontalShift, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(2 * canvas.width / 3 - 1 + leftScoreHorizontalShift, 66, 25, 21);
    c.fillRect(2 * canvas.width / 3 + 6 + leftScoreHorizontalShift, 93, 25, 21);
  }
  if(x == 3){
    c.fillStyle = "white";
    c.fillRect(canvas.width / 3, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(canvas.width / 3 - 1, 66, 25, 21);
    c.fillRect(canvas.width / 3 - 1, 93, 25, 21);
  }
  if(y == 3){
    c.fillStyle = "white";
    c.fillRect(2 * canvas.width / 3 + leftScoreHorizontalShift, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(2 * canvas.width / 3 - 1 + leftScoreHorizontalShift, 66, 25, 21);
    c.fillRect(2 * canvas.width / 3 - 1 + leftScoreHorizontalShift, 93, 25, 21);
  }
  if(x == 4){
    c.fillStyle = "white";
    c.fillRect(canvas.width / 3, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(canvas.width / 3 + 6, 60, 18, 27);
    c.fillRect(canvas.width / 3 - 1, 93, 25, 30);
  }
  if(y == 4){
    c.fillStyle = "white";
    c.fillRect(2 * canvas.width / 3 + leftScoreHorizontalShift, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(2 * canvas.width / 3 + 6 + leftScoreHorizontalShift, 60, 18, 27);
    c.fillRect(2 * canvas.width / 3 - 1 + leftScoreHorizontalShift, 93, 25, 30);
  }
  if(x == 5){
    c.fillStyle = "white";
    c.fillRect(canvas.width / 3, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(canvas.width / 3 + 6, 66, 25, 21);
    c.fillRect(canvas.width / 3 - 1, 93, 25, 21);
  }
  if(y == 5){
    c.fillStyle = "white";
    c.fillRect(2 * canvas.width / 3 + leftScoreHorizontalShift, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(2 * canvas.width / 3 + 6 + leftScoreHorizontalShift, 66, 25, 21);
    c.fillRect(2 * canvas.width / 3 - 1 + leftScoreHorizontalShift, 93, 25, 21);
  }
  if(x == 6){
    c.fillStyle = "white";
    c.fillRect(canvas.width / 3, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(canvas.width / 3 + 6, 66, 25, 21);
    c.fillRect(canvas.width / 3 + 6, 93, 18, 21);
  }
  if(y == 6){
    c.fillStyle = "white";
    c.fillRect(2 * canvas.width / 3 + leftScoreHorizontalShift, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(2 * canvas.width / 3 + 6 + leftScoreHorizontalShift, 66, 25, 21);
    c.fillRect(2 * canvas.width / 3 + 6 + leftScoreHorizontalShift, 93, 18, 21);
  }
  if(x == 7){
    c.fillStyle = "white";
    c.fillRect(canvas.width / 3, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(canvas.width / 3 - 1, 66, 25, 60);
  }
  if(y == 7){
    c.fillStyle = "white";
    c.fillRect(2 * canvas.width / 3 + leftScoreHorizontalShift, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(2 * canvas.width / 3 - 1 + leftScoreHorizontalShift, 66, 25, 60);
  }
  if(x == 8){
    c.fillStyle = "white";
    c.fillRect(canvas.width / 3, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(canvas.width / 3 + 6, 66, 18, 21);
    c.fillRect(canvas.width / 3 + 6, 93, 18, 21);
  }
  if(y == 8){
    c.fillStyle = "white";
    c.fillRect(2 * canvas.width / 3 + leftScoreHorizontalShift, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(2 * canvas.width / 3 + 6 + leftScoreHorizontalShift, 66, 18, 21);
    c.fillRect(2 * canvas.width / 3 + 6 + leftScoreHorizontalShift, 93, 18, 21);
  }
  if(x == 9){
    c.fillStyle = "white";
    c.fillRect(canvas.width / 3, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(canvas.width / 3 + 6, 66, 18, 21);
    c.fillRect(canvas.width / 3 - 1, 93, 25, 21);
  }
  if(y == 9){
    c.fillStyle = "white";
    c.fillRect(2 * canvas.width / 3 + leftScoreHorizontalShift, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(2 * canvas.width / 3 + 6 + leftScoreHorizontalShift, 66, 18, 21);
    c.fillRect(2 * canvas.width / 3 - 1 + leftScoreHorizontalShift, 93, 25, 21);
  }
  if(x == 10){
    c.fillStyle = "white";
    c.fillRect(canvas.width / 3, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(canvas.width / 3 + 6, 60, 30, 60);
    c.fillStyle = "white";
    c.fillRect(canvas.width / 3 + 36, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(canvas.width / 3 + 6 + 36, 66, 18, 48);
  }
  if(y == 10){
    c.fillStyle = "white";
    c.fillRect(2 * canvas.width / 3 + leftScoreHorizontalShift, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(2 * canvas.width / 3 + 6 + leftScoreHorizontalShift, 60, 30, 60);
    c.fillStyle = "white";
    c.fillRect(2 * canvas.width / 3 + leftScoreHorizontalShift + 36, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(2 * canvas.width / 3 + 6 + leftScoreHorizontalShift + 36, 66, 18, 48);
  }
  if(x == 11){
    c.fillStyle = "white";
    c.fillRect(canvas.width / 3, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(canvas.width / 3 + 6, 60, 30, 60);
    c.fillStyle = "white";
    c.fillRect(canvas.width / 3 + 36, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(canvas.width / 3 + 6 + 36, 60, 30, 60);
  }
  if(y == 11){
    c.fillStyle = "white";
    c.fillRect(2 * canvas.width / 3 + leftScoreHorizontalShift, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(2 * canvas.width / 3 + 6 + leftScoreHorizontalShift, 60, 30, 60);
    c.fillStyle = "white";
    c.fillRect(2 * canvas.width / 3 + leftScoreHorizontalShift + 36, 60, 30, 60);
    c.fillStyle = "black";
    c.fillRect(2 * canvas.width / 3 + 6 + leftScoreHorizontalShift + 36, 60, 30, 60);
  }
}

setInterval(function(){
  drawScores(cpuScore, playerScore);
  if(cpuScore < 11 && playerScore < 11){
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawField();
    updatePaddlePositions();
    drawPaddles();
    drawScores(cpuScore, playerScore);
    updateBall();
  }
}, 50/3);