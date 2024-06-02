const TOTAL_BARS = 50;
const SWAP = 1;
const SET = 2;
const COLOR = 3;

const SortingBoard = document.getElementById("SortingBoard");

var bars = [];
var animations = [];
var isSorting = false;

// const audio=new Audio('resources/Bomb.mp3');

//setting up board
for (let i = 0; i < TOTAL_BARS; i++) {
  const cell = document.createElement("div");
  cell.className = "bar";
  cell.id = `bar-${i}`;
  var height = Math.floor(Math.random() * 250) + 80;
  bars.push(height);
  cell.style.height = `${height}px`;
  SortingBoard.appendChild(cell);
}

var ind = 0;

function myFunction() {
  if (ind >= animations.length) {
    return;
  }
  if (animations[ind][0] === SWAP) {
    const a = animations[ind][1],
      b = animations[ind][2];

    const heightOne = bars[a],
      heightTwo = bars[b];

    cellId = `bar-${a}`;
    cellElement = document.getElementById(cellId);
    cellElement.style.height = `${heightTwo}px`;

    cellId = `bar-${b}`;
    cellElement = document.getElementById(cellId);
    cellElement.style.height = `${heightOne}px`;

    [bars[a], bars[b]] = [bars[b], bars[a]];
  } else if (animations[ind][0] === SET) {
    const a = animations[ind][1], //bar to update
      heightTwo = animations[ind][2]; //height to put

    cellId = `bar-${a}`;
    cellElement = document.getElementById(cellId);
    cellElement.style.height = `${heightTwo}px`;

    bars[a] = heightTwo;
  } else if (animations[ind][0] === COLOR) {
    const a = animations[ind][1]; //height to put

    cellId = `bar-${a}`;
    cellElement = document.getElementById(cellId);
    if (animations[ind][2] == 1)
      cellElement.style.background = "#90EE90"; //green
    else if (animations[ind][2] == 2)
      cellElement.style.background = "#5ebfbe"; //blue
    else cellElement.style.background = "#6C3082"; //purple
  }
  ind++;
}

function startInterval() {
  var intervalStartTime = new Date().getTime();

  function checkInterval() {
    if (ind >= animations.length) {
      console.log("sorting anim over");
      finalRun();
      return;
    }
    var currentTime = new Date().getTime();
    var elapsed = currentTime - intervalStartTime;

    if (elapsed >= 25) {
      myFunction();
      intervalStartTime = currentTime;
    }

    requestAnimationFrame(checkInterval);
  }

  checkInterval();
}

// Call the startInterval function to start the interval

function sort(n) {
  if (isSorting) return;
  isSorting = true;
  ind = 0;
  animations = [];
  if (n == 1) {
    bubbleSort([...bars]);
  } else if (n == 2) {
    insertionSort([...bars]);
  } else if (n == 3) {
    quickSort([...bars], 0, bars.length - 1);
  } else {
    mergeSort(0, bars.length - 1);
  }
  startInterval();
}

function bubbleSort(array) {
  const length = array.length;

  // Outer loop for the number of passes
  for (let i = 0; i < length - 1; i++) {
    // Inner loop for comparisons and swapping
    for (let j = 0; j < length - 1 - i; j++) {
      // Compare adjacent elements
      animations.push([COLOR, j, 1]);
      animations.push([COLOR, j, 0]);
      if (array[j] > array[j + 1]) {
        // Swap the elements
        animations.push([SWAP, j, j + 1]);
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
    animations.push([COLOR, length - 1 - i, 1]);
  }
}

function insertionSort(array) {
  const length = array.length;

  for (let i = 1; i < length; i++) {
    const key = array[i]; // Current element to be inserted at the right position
    animations.push([COLOR, i, 1]);
    animations.push([COLOR, i, 1]);
    animations.push([COLOR, i, 0]);
    let j = i - 1;

    // Shift elements greater than the key to the right [5, 3, 8, 2, 1, 4]
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      animations.push([SET, j + 1, array[j]]);
      j--;
    }

    array[j + 1] = key; // Insert the key at the correct position
    animations.push([COLOR, j + 1, 1]);
    animations.push([COLOR, j + 1, 1]);
    animations.push([COLOR, j + 1, 0]);
    animations.push([SET, j + 1, key]);
  }
}

function mergeSort(start, end) {
  if (start >= end) {
    return; //array; // Base case: Array with 0 or 1 element is already sorted
  }

  // Split the array into two halves
  const mid = Math.floor((start + end) / 2);

  animations.push([COLOR, mid, 1]);
  // animations.push([COLOR, mid, 1]);
  animations.push([COLOR, mid, 0]);

  mergeSort(start, mid);
  mergeSort(mid + 1, end);

  // Merge the sorted halves
  const mergedArray = merge(start, mid, end);

  bars = [...bars.slice(0, start), ...mergedArray, ...bars.slice(end + 1)];
}

function merge(start, mid, end) {
  const mergedArray = [];
  var curr = 0;
  let i = start; // Pointer for left array
  let j = mid + 1; // Pointer for right array
  // Merge the arrays by comparing elements
  while (i <= mid && j <= end) {
    if (bars[i] <= bars[j]) {
      mergedArray.push(bars[i]);
      animations.push([SET, start + curr, bars[i]]);
      i++;
    } else {
      mergedArray.push(bars[j]);
      animations.push([SET, start + curr, bars[j]]);
      j++;
    }
    curr++;
  }
  // Append the remaining elements from the left array, if any
  while (i <= mid) {
    mergedArray.push(bars[i]);
    animations.push([SET, start + curr, bars[i]]);
    curr++;
    i++;
  }
  // Append the remaining elements from the right array, if any
  while (j <= end) {
    mergedArray.push(bars[j]);
    animations.push([SET, start + curr, bars[j]]);
    curr++;
    j++;
  }

  return mergedArray;
}

function quickSort(arr, start, end) {
  // Base case or terminating case
  if (start >= end) {
    if (start === end) animations.push([COLOR, start, 1]);
    return;
  }

  // Returns pivotIndex
  let index = partition(arr, start, end);

  animations.push([COLOR, index, 1]);

  // Recursively apply the same logic to the left and right subarrays
  quickSort(arr, start, index - 1);
  quickSort(arr, index + 1, end);

  // animations.push([COLOR, index, 0]);
}

function partition(arr, start, end) {
  // Taking the last element as the pivot
  const pivotValue = arr[end];
  animations.push([COLOR, end, 2]);

  let pivotIndex = start;
  for (let i = start; i < end; i++) {
    if (arr[i] < pivotValue) {
      // Swapping elements
      [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
      animations.push([COLOR, i, 2]);
      animations.push([COLOR, pivotIndex, 2]);
      animations.push([COLOR, i, 0]);
      animations.push([COLOR, pivotIndex, 0]);
      animations.push([SWAP, i, pivotIndex]);
      // Moving to next element
      pivotIndex++;
    }
  }

  // Putting the pivot value in the middle
  [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
  animations.push([SWAP, end, pivotIndex]);

  animations.push([COLOR, end, 0]);

  return pivotIndex;
}

var finalAnimation = [];
// var finalAnimationRunning=false;
var finalInd = 0;

function finalRun() {
  finalInd = 0;
  finalAnimation = [];

  console.log("finale run called");
  for (let i = 0; i < bars.length; i++) {
    finalAnimation.push([COLOR, i, 0]);
    finalAnimation.push([COLOR, i, 1]);
  }
  finalAnimationRunner();
  // audio.play();
  document.getElementById("myAudio").play();
}

function finalAnimationRunner() {
  var intervalStartTime = new Date().getTime();

  function checkFinalInterval() {
    if (finalInd >= finalAnimation.length) {
      isSorting = false;
      console.log("final anim over");
      return;
    }
    var currentTime = new Date().getTime();
    var elapsed = currentTime - intervalStartTime;

    if (elapsed >= 25) {
      sortedShow();
      intervalStartTime = currentTime;
    }

    requestAnimationFrame(checkFinalInterval);
  }

  checkFinalInterval();
}

function sortedShow() {
  if (finalInd >= finalAnimation.length) {
    isSorting = false;
    return;
  }
  const a = finalAnimation[finalInd][1];
  const cellId = `bar-${a}`;
  cellElement = document.getElementById(cellId);
  if (finalAnimation[finalInd][2] == 1)
    cellElement.style.background = "#90EE90";
  else cellElement.style.background = "#6C3082";
  finalInd++;
}

function restart() {
  window.location.reload();
}
