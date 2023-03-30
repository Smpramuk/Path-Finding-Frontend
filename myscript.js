import {
  dfs,
  bfs,
  resetGrid,
  createGrid,
  toggleDropdown,
  aStar,
  isValidSquare,
  resetGridLeaveObstacles,
  dijkstra,
} from "./algorithms.js";
// Define the size of the grid
const numRows = 30;
const numCols = 30;
var startRow = 0;
var startCol = 0;
var endRow = 29;
var endCol = 29;
// Maybe I'll use a node at some point?, could create a two dimesional matrix full of them in the loop below
// class Node {
//   constructor(x, y) {
//     this.x = x;
//     this.y = y;
//   }
// }
// Loop through each row and cell to create the table

const resetButton = document.querySelector(".reset-button");
const dfsButton = document.querySelector(".dfs-button");
const bfsButton = document.querySelector(".bfs-button");
const astarButton = document.querySelector(".astar-button");
const dijkstraButton = document.querySelector(".dijkstra-button");
const startPoints = document.querySelector(".new-start-points");
const newPoints = document.querySelector(".new-points");
const newStartButton = document.querySelector(".new-start-button");
const newEndButton = document.querySelector(".new-end-button");
const table = document.querySelector(".graph");
let isMouseDown = false;
const endPoints = document.querySelector(".new-end-points");
resetButton.addEventListener("click", () => {
  resetGrid(startRow, startCol, endRow, endCol);
});
dfsButton.addEventListener("click", () => {
  resetGridLeaveObstacles(startRow, startCol, endRow, endCol);
  dfs(startRow, startCol, endRow, endCol, 0);
});
bfsButton.addEventListener("click", () => {
  console.log(startRow + "," + startCol);
  resetGridLeaveObstacles(startRow, startCol, endRow, endCol);
  bfs(startRow, startCol, endRow, endCol, 0);
});
astarButton.addEventListener("click", () => {
  resetGridLeaveObstacles(startRow, startCol, endRow, endCol);
  aStar(startRow, startCol, endRow, endCol, 0);
});
dijkstraButton.addEventListener("click", () => {
  resetGridLeaveObstacles(startRow, startCol, endRow, endCol);
  dijkstra(startRow, startCol, endRow, endCol, 0);
});
newStartButton.addEventListener("click", () => {
  const xInput = document.querySelector(".new-starting-x");
  const yInput = document.querySelector(".new-starting-y");
  const newX = parseInt(yInput.value);
  const newY = parseInt(xInput.value);
  if (!isValidSquare(newX, newY)) {
    alert("Out of Bounds!");
    return;
  } else if (newX == endRow && newY == endCol) {
    alert("Invalid, start == end.");
  } else {
    startRow = newX;
    startCol = newY;
    resetGridLeaveObstacles(newX, newY, endRow, endCol);
  }
});
newEndButton.addEventListener("click", () => {
  const xInput = document.querySelector(".new-end-x");
  const yInput = document.querySelector(".new-end-y");
  const newX = parseInt(yInput.value);
  const newY = parseInt(xInput.value);
  if (!isValidSquare(newX, newY)) {
    alert("Out of Bounds!");
    return;
  } else if (newX == startRow && newY == startCol) {
    alert("Invalid, start == end.");
  } else {
    endRow = newX;
    endCol = newY;
    resetGridLeaveObstacles(startRow, startCol, newX, newY);
  }
});
startPoints.addEventListener("click", () => {
  // Toggle the display property of the input container
  const inputContainer = document.querySelector(".start-input-container");
  if (
    inputContainer.style.display === "none" ||
    inputContainer.style.display === ""
  ) {
    inputContainer.style.display = "flex";
  } else {
    inputContainer.style.display = "none";
  }
});
endPoints.addEventListener("click", () => {
  // Toggle the display property of the input container
  const inputContainer = document.querySelector(".end-input-container");
  if (
    inputContainer.style.display === "none" ||
    inputContainer.style.display === ""
  ) {
    inputContainer.style.display = "flex";
  } else {
    inputContainer.style.display = "none";
  }
});
newPoints.addEventListener("click", toggleDropdown);
table.addEventListener("mousedown", handleMouseDown);
table.addEventListener("mousemove", handleMouseMove);
table.addEventListener("mouseup", handleMouseUp);
function handleMouseDown() {
  isMouseDown = true;
}
function handleMouseMove(event) {
  if (isMouseDown) {
    const target = event.target;
    console.log(target);
    if (target.tagName == "TD") {
      const classList = target.classList;
      for (let i = 0; i < classList.length; i++) {
        if (classList[i] == "starting-cell" || classList[i] == "ending-cell") {
          return false; //if the cell is starting or ending, can't be an obstacle!
        }
      }
      target.classList = [];
      target.classList.add("obstacle");
    }
  }
}
function handleMouseUp() {
  isMouseDown = false;
}
createGrid(startRow, startCol, endRow, endCol, numRows, numCols);
