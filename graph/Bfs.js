const ROW = 15;
const COL = 30;

var visited = [];

var animations = [];

var traversalStarted = false;
var ind = 0;

var startX = 7,
  startY = 8,
  endX = 8,
  endY = 23;

const GraphBoard = document.getElementById("GraphBoard");

function setUp() {
  for (let i = 0; i < ROW; i++) {
    visited.push([]);
    for (let j = 0; j < COL; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.id = `cell-${i}-${j}`;
      GraphBoard.appendChild(cell);
      cell.setAttribute("ondrop", "drop(event)");
      cell.setAttribute("ondragover", "allowDrop(event)");
      visited[i].push(false);
    }
  }
}

setUp();

function reset() {
  window.location.reload();
  return;
}

function bfs(q) {
  while (q.length > 0) {
    var newQ = [];
    var newA = [];
    var newF = [];
    for (let i = 0; i < q.length; i++) {
      var curr = q[i];
      var cX = curr[0],
        cY = curr[1];
      if (cX === endX && cY === endY) {
        return;
      }
      if (cX - 1 >= 0 && !visited[cX - 1][cY]) {
        newQ.push([cX - 1, cY]);
        newA.push([cX - 1, cY, 0]);
        newF.push([cX - 1, cY, 1]);
        visited[cX - 1][cY] = true;
      }
      if (cY + 1 < COL && !visited[cX][cY + 1]) {
        newQ.push([cX, cY + 1]);
        newA.push([cX, cY + 1, 0]);
        newF.push([cX, cY + 1, 1]);
        visited[cX][cY + 1] = true;
      }
      if (cY - 1 >= 0 && !visited[cX][cY - 1]) {
        newQ.push([cX, cY - 1]);
        newA.push([cX, cY - 1, 0]);
        newF.push([cX, cY - 1, 1]);
        visited[cX][cY - 1] = true;
      }
      if (cX + 1 < ROW && !visited[cX + 1][cY]) {
        newQ.push([cX + 1, cY]);
        newA.push([cX + 1, cY, 0]);
        newF.push([cX + 1, cY, 1]);
        visited[cX + 1][cY] = true;
      }
    }
    q = newQ;
    animations.push(newF);
    animations.push(newA);
  }
}

var gotIt = false;

function dfs(x, y) {
  if (gotIt || x < 0 || y < 0 || x >= ROW || y >= COL) return;
  if (visited[x][y]) return;
  animations.push([[x, y, 1]]);
  animations.push([[x, y, 0]]);
  if (x === endX && y === endY) {
    gotIt = true;
    return;
  }
  visited[x][y] = true;
  dfs(x - 1, y); //up
  dfs(x, y + 1); //right
  dfs(x + 1, y); //down
  dfs(x, y - 1); //left
}

function myFunction() {
  if (ind >= animations.length) {
    traversalStarted = false;
    let cellIde = `cell-${endX}-${endY}`;
    document.getElementById(cellIde).style.backgroundColor = "red";
    return;
  }
  let animationSet = animations[ind];

  for (let i = 0; i < animationSet.length; i++) {
    let a = animationSet[i][0],
      b = animationSet[i][1];

    var cellId = `cell-${a}-${b}`;
    cellElement = document.getElementById(cellId);

    if (animationSet[i][2] == 1)
      cellElement.style.background = "#3b6bbd"; //#4c7fd9";
    else cellElement.style.background = "#5bc9e1"; //#5ad559";
  }
  ind++;
}

function startInterval() {
  var intervalStartTime = new Date().getTime();

  function checkInterval() {
    if (ind >= animations.length) {
      return;
    }
    console.log("checking");
    var currentTime = new Date().getTime();
    var elapsed = currentTime - intervalStartTime;

    if (elapsed >= 150) {
      myFunction();
      intervalStartTime = currentTime;
    }

    requestAnimationFrame(checkInterval);
  }

  checkInterval();
}

// startInterval();

function startBfs() {
  if (traversalStarted) return;
  bfs([[startX, startY]]);
  traversalStarted = true;
  startInterval();
}
function startDfs() {
  if (traversalStarted) return;
  dfs(startX - 1, startY);
  dfs(startX, startY + 1);
  dfs(startX + 1, startY);
  dfs(startX, startY - 1);
  traversalStarted = true;
  startInterval();
}

var drawing = false;
//event handler section ----------------------------------------------------
function addOrRemoveHover(event) {
  cellElements = document.querySelectorAll(".cell");
  if (event.key == "s") {
    if (drawing) {
      console.log("stop drawing");
      cellElements.forEach((cell) => {
        removeHover(cell);
      });
      drawing = false;
    } else {
      console.log("start drawing");
      cellElements.forEach((cell) => {
        addHover(cell);
      });
      drawing = true;
    }
  }
}
function addHover(cell) {
  cell.addEventListener("mouseover", addColor);
}
function removeHover(cell) {
  cell.removeEventListener("mouseover", addColor);
}

function addColor(event) {
  if (traversalStarted) return;
  var coords = giveCoords(event.target.id);
  if (
    (coords[0] == startX && coords[1] == startY) ||
    (coords[0] == endX && coords[1] == endY)
  ) {
    return;
  }
  if (visited[coords[0]] !== undefined) {
    visited[coords[0]][coords[1]] = true;
    this.style.backgroundColor = "black";
  }
}

document.addEventListener("keydown", addOrRemoveHover);

//event ------------------------------------------------------------------

function giveCoords(str) {
  const arr = str.split("-");
  return [Number(arr[1]), Number(arr[2])];
}

function dragS(ev) {
  ev.dataTransfer.setData("start", ev.target.id);
}
function dragE(ev) {
  ev.dataTransfer.setData("end", ev.target.id);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();

  var data = ev.dataTransfer.getData("start");

  if (data === "") {
    //end point
    data = ev.dataTransfer.getData("end");
    var coords = giveCoords(ev.target.id);
    if (coords[0] == startX && coords[1] == startY) {
      return;
    }
    endX = coords[0];
    endY = coords[1];
  } else {
    //start point
    var coords = giveCoords(ev.target.id);
    if (coords[0] == endX && coords[1] == endY) {
      return;
    }
    startX = coords[0];
    startY = coords[1];
  }

  ev.target.appendChild(document.getElementById(data));
}

document
  .getElementById("cell-7-8")
  .appendChild(document.getElementById("start-div"));
document
  .getElementById("cell-8-23")
  .appendChild(document.getElementById("end-div"));

document.getElementById("whatever").focus();
