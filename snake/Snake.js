const SnakeBoard = document.getElementById("SnakeBoard");
const m = 14; // number of rows
const n = 21; // number of columns

const DOWN = "down";
const UP = "up";
const RIGHT = "right";
const LEFT = "left";
const ROW = 14;
const COL = 21;

var currentDirection = LEFT;
var previousDirection = LEFT;
var fruitCell = [-2, -2];
var ate = true;

var gameEnded = false;
var score = 0;

// const audio = new Audio("resources/fruit-eat.mp3");

var interval;

for (let i = 0; i < m; i++) {
  for (let j = 0; j < n; j++) {
    const cell = document.createElement("div");
    cell.className = "empty-cell";
    cell.id = `cell-${i}-${j}`;
    SnakeBoard.appendChild(cell);
  }
}

var snake = [
  [5, 18],
  [5, 19],
  [6, 19],
  [6, 18],
];

for (let k = 0; k < snake.length; k++) {
  let i = snake[k][0],
    j = snake[k][1];
  const cellId = `cell-${i}-${j}`;
  const cellElement = document.getElementById(cellId);
  cellElement.className = "snake-cell";
}

function restart() {
  window.location.reload();
}

function myFunction() {
  // console.log("Executing every 1 second "+currentDirection);
  if (currentDirection === DOWN) move([1, 0], DOWN);
  else if (currentDirection === UP) move([-1, 0], UP);
  else if (currentDirection === LEFT) move([0, -1], LEFT);
  else if (currentDirection === RIGHT) move([0, 1], RIGHT);
}

function startInterval() {
  var intervalStartTime = new Date().getTime();

  function checkInterval() {
    if (gameEnded) return; //rem if have timing issues
    //   console.log("timer"); //also this
    var currentTime = new Date().getTime();
    var elapsed = currentTime - intervalStartTime;

    if (elapsed >= 200) {
      myFunction();
      intervalStartTime = currentTime;
    }

    requestAnimationFrame(checkInterval);
  }

  checkInterval();
}

// Call the startInterval function to start the interval
startInterval();

function spawnFruit() {
  // console.log("spawning "+fruitCell);
  if (!ate) return;

  let xf = Math.floor(Math.random() * 14),
    yf = Math.floor(Math.random() * 21);

  while (isOnSnake([xf, yf])) {
    xf = Math.floor(Math.random() * 14);
    yf = Math.floor(Math.random() * 21);
  }

  fruitCell[0] = xf;
  fruitCell[1] = yf;

  cellId = `cell-${xf}-${yf}`;
  cellElement = document.getElementById(cellId);
  cellElement.className = "fruit-cell";

  ate = false;
}

// spawnFruit();
setInterval(spawnFruit, 500);

function isOnSnake(fruit) {
  for (let x of snake) {
    if (x[0] === fruit[0] && x[1] === fruit[1]) return true;
  }
  return false;
}

function handleKeyPress(event) {
  if (event.keyCode === 37) {
    currentDirection = LEFT;
  } else if (event.keyCode === 38) {
    currentDirection = UP;
  } else if (event.keyCode === 39) {
    currentDirection = RIGHT;
  } else if (event.keyCode === 40) {
    currentDirection = DOWN;
  }
}

document.addEventListener("keydown", handleKeyPress);

function move(dir, DIRECTION) {
  // console.log(previousDirection + " -> " + DIRECTION);

  if (gameEnded) return;

  if (DIRECTION === DOWN && previousDirection === UP) {
    dir[0] = -1;
    dir[1] = 0;
    DIRECTION = UP;
  } else if (DIRECTION === UP && previousDirection === DOWN) {
    dir[0] = 1;
    dir[1] = 0;
    DIRECTION = DOWN;
  } else if (DIRECTION === LEFT && previousDirection === RIGHT) {
    dir[0] = 0;
    dir[1] = 1;
    DIRECTION = RIGHT;
  } else if (DIRECTION === RIGHT && previousDirection === LEFT) {
    dir[0] = 0;
    dir[1] = -1;
    DIRECTION = LEFT;
  }

  var snakeHead = snake[0];
  var snakeTail = snake[snake.length - 1];

  let x1 = snakeHead[0] + dir[0],
    y1 = snakeHead[1] + dir[1];

  if (x1 >= ROW || x1 < 0 || y1 < 0 || y1 >= COL) {
    document.getElementById("end-banner").style.transform = "scale(1)";
    document.getElementById("score-msg").innerHTML = "You scored : " + score;
    gameEnded = true;
    return;
  }
  
  if (isOnSnake([x1, y1])) {
    document.getElementById("end-banner").style.transform = "scale(1)";
    document.getElementById("score-msg").innerHTML = "You scored : " + score;
    gameEnded = true;
    return;
  }

  currentDirection = DIRECTION;
  let isFruit = false;

  if (x1 == fruitCell[0] && y1 == fruitCell[1]) {
    isFruit = true;
  }

  //head
  cellId = `cell-${x1}-${y1}`;
  cellElement = document.getElementById(cellId);
  cellElement.className = "snake-head";

  //clearing prev head
  let xh = snake[0][0],
    yh = snake[0][1];

  cellId = `cell-${xh}-${yh}`;
  cellElement = document.getElementById(cellId);
  cellElement.className = "snake-cell";

  if (!isFruit) {
    let x2 = snakeTail[0],
      y2 = snakeTail[1];

    //tail
    cellId = `cell-${x2}-${y2}`;
    cellElement = document.getElementById(cellId);
    cellElement.className = "empty-cell";

    snake.pop();
  } else {
    ate = true;
    // audio.play();
    document.getElementById("myAudio").play();
    score++;
  }

  snake = [[snakeHead[0] + dir[0], snakeHead[1] + dir[1]], ...snake];

  previousDirection = DIRECTION;
}

document.getElementById("whatever").focus();
document.getElementById("myAudio").play();