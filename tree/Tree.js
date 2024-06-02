const tree = {
  6: { left: 4, right: 9 },
  4: { left: 2, right: 5 },
  2: { left: 1, right: 3 },
  9: { left: 8, right: 10 },
  8: { left: 7, right: null },
  1: { left: null, right: null },
  3: { left: null, right: null },
  5: { left: null, right: null },
  7: { left: null, right: null },
  10: { left: null, right: null },
};

var animations = [];
var ind = 0,
  traversalStarted = false;

var target = 7;

document.getElementById("node").value = target;

function inOrder(root) {
  if (tree[root] === null) return;
  animations.push([[root, 1]]);
  if (tree[root].left !== null) inOrder(tree[root].left);
  console.log(root);
  animations.push([[root, 0]]);
  animations.push([[root, 3]]); //<-
  if (tree[root].right !== null) inOrder(tree[root].right);
}
function postOrder(root) {
  if (tree[root] === null) return;
  animations.push([[root, 1]]);
  if (tree[root].left !== null) postOrder(tree[root].left);
  if (tree[root].right !== null) postOrder(tree[root].right);
  console.log(root);
  animations.push([[root, 0]]);
  animations.push([[root, 3]]); //<-
}
function preOrder(root) {
  if (tree[root] === null) return;
  console.log(root);
  animations.push([[root, 1]]);
  animations.push([[root, 0]]);
  animations.push([[root, 3]]); //<-
  if (tree[root].left !== null) preOrder(tree[root].left);
  if (tree[root].right !== null) preOrder(tree[root].right);
}

function bfs(q, num) {
  var isFirst = true;
  while (q.length > 0) {
    const root = q[0];
    if (isFirst) {
      animations.push([[root, 1]]); //took an element
      animations.push([[root, 3]]); //took an element
      isFirst = false;
    }
    animations.push([[root, 6]]);
    animations.push([[root, 6]]);

    if (root === num) {
      animations.push([[root, 2]]);
      return;
    }

    //add two nodes to q and color in tree
    if (tree[root].left !== null) {
      //left node
      q.push(tree[root].left);
      animations.push([
        [tree[root].left, 1],
        [tree[root].left, 3],
      ]);
      // animations.push([[tree[root].left, 3]]);
    }
    if (tree[root].right !== null) {
      //right node
      q.push(tree[root].right);
      animations.push([
        [tree[root].right, 1],
        [tree[root].right, 3],
      ]);
      // animations.push([[tree[root].right, 3]]);
    }
    //rem top from que and black in tree

    animations.push([
      [root, 0],
      [root, 4],
    ]);
    // animations.push([[root, 4]]);
    animations.push([[root, 5]]);

    q = q.slice(1);
  }
  console.log("not found");
}

function dfs(root, num) {
  if (tree[root] === null) return;

  animations.push([
    [root, 3],
    [root, 1],
  ]); //<-

  if (root === num) {
    //got target
    animations.push([[root, 2]]);
    return true;
  }

  if (tree[root].left !== null && dfs(tree[root].left, num)) return true;
  if (tree[root].right !== null && dfs(tree[root].right, num)) return true;

  animations.push([[root, 0]]); //<-
  animations.push([[root, 4]]); //<-[root, 4],
  animations.push([[root, 5]]); //<-
  console.log(root);
  return false;
}

const stack = document.getElementById("stack-frame");

function myFunction() {
  if (ind >= animations.length) {
    traversalStarted = false;
    return;
  }

  let animationSet = animations[ind];

  for (let i = 0; i < animationSet.length; i++) {
    let a = animationSet[i][0]; //[index,color]

    let cellId = `cell-${a}`;
    cellElement = document.getElementById(cellId);

    if (animationSet[i][1] == 1) {
      //1 means dark color
      cellElement.style.background = "aquamarine"; //visiting
      cellElement.style.color = "black";
      cellElement.style.transform = "scale(1.2)";
    } else if (animationSet[i][1] == 0) {
      //visited
      cellElement.style.background = "#000";
      cellElement.style.color = "white";
      cellElement.style.transform = "scale(1)";
    } else if (animationSet[i][1] == 2)
      cellElement.style.background = "orange"; //target node
    else if (animationSet[i][1] == 3) {
      //ADD TO STACK
      const cell = document.createElement("div");
      cell.className = "stack";
      cell.id = `stack-${a}`;
      cell.innerHTML = a;
      stack.appendChild(cell);
    } else if (animationSet[i][1] == 4) {
      //remove from stack
      const elem = document.getElementById(`stack-${a}`);
      elem.style.transform = "scale(0)";
    } else if (animationSet[i][1] == 5) {
      //remove from stack
      const elem = document.getElementById(`stack-${a}`);
      elem.remove();
    } else {
      const elem = document.getElementById(`stack-${a}`);
      elem.style.background = "blue";
      elem.style.color = "white";
      elem.style.fontWeight = "600";
      elem.style.fontSize = "160%";
      cellElement.style.transform = "scale(1.2)";
      cellElement.style.background = "blue"; //visiting
      cellElement.style.color = "white";
    }
  }

  ind++;
}

function startInterval() {
  var intervalStartTime = new Date().getTime();

  function checkInterval() {
    if (ind >= animations.length) {
      traversalStarted = false;
      return;
    }
    var currentTime = new Date().getTime();
    var elapsed = currentTime - intervalStartTime;

    if (elapsed >= 600) {
      myFunction();
      intervalStartTime = currentTime;
    }

    requestAnimationFrame(checkInterval);
  }

  checkInterval();
}

function startPre() {
  if (traversalStarted) return;
  ind = 0;
  animations = [];
  traversalStarted = true;
  newReset();
  preOrder(6);
  startInterval();
}
function startIn() {
  if (traversalStarted) return;
  ind = 0;
  animations = [];
  traversalStarted = true;
  newReset();
  inOrder(6);
  startInterval();
}
function startPost() {
  if (traversalStarted) return;
  ind = 0;
  animations = [];
  traversalStarted = true;
  newReset();
  postOrder(6);
  startInterval();
}
function startBfs() {
  console.log(document.getElementById("node").value);
  if (traversalStarted) return;
  ind = 0;
  animations = [];
  traversalStarted = true;
  newReset();
  bfs([6], Number(document.getElementById("node").value));
  startInterval();
}
function startDfs() {
  if (traversalStarted) return;
  ind = 0;
  animations = [];
  traversalStarted = true;
  newReset();
  dfs([6], Number(document.getElementById("node").value));
  startInterval();
}

function reset() {
  newReset();
  traversalStarted = false;
  return;
}

function newReset() {
  for (let i = 1; i < 11; i++) {
    const cell = document.getElementById(`cell-${i}`);
    cell.style.background = "white";
    cell.style.color = "black";
    cell.style.transform = "scale(1)";
  }
  const stackList = document.querySelectorAll(".stack");
  stackList.forEach((s) => {
    s.remove();
  });
}
