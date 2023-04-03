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

const resetButton = document.getElementById("reset-button");
const dfsButton = document.getElementById("dfs-button");
const bfsButton = document.getElementById("bfs-button");
const astarButton = document.getElementById("astar-button");
const dijkstraButton = document.getElementById("dijkstra-button");
const startPoints = document.getElementById("new-start-points");
const newPoints = document.getElementById("new-points");
const newStartButton = document.getElementById("new-start-button");
const newEndButton = document.getElementById("new-end-button");
const table = document.getElementById("graph");
const endPoints = document.getElementById("new-end-points");
const removeObstaclesButton = document.getElementById(
  "reset-button-remove-obstacles"
);
const keepObstaclesButton = document.getElementById(
  "reset-button-keep-obstacles"
);
const addWeightedNodesButton = document.getElementById("weighted-button");
const addWallsButton = document.getElementById("obstacle-button");
let isMouseDown = false;
resetButton.addEventListener("click", () => {
  const resetContainer = document.getElementById("reset-options");
  if (
    resetContainer.style.display === "none" ||
    resetContainer.style.display === ""
  ) {
    resetContainer.style.display = "flex";
  } else {
    resetContainer.style.display = "none";
  }
});
removeObstaclesButton.addEventListener("click", () => {
  resetGrid(startRow, startCol, endRow, endCol);
});
keepObstaclesButton.addEventListener("click", () => {
  resetGridLeaveObstacles(startRow, startCol, endRow, endCol);
});
dfsButton.addEventListener("click", () => {
  disableButtons();
  resetGridLeaveObstacles(startRow, startCol, endRow, endCol);
  dfs(startRow, startCol, endRow, endCol, 0);
});
bfsButton.addEventListener("click", () => {
  disableButtons();
  resetGridLeaveObstacles(startRow, startCol, endRow, endCol);
  bfs(startRow, startCol, endRow, endCol, 0);
});
astarButton.addEventListener("click", () => {
  disableButtons();
  resetGridLeaveObstacles(startRow, startCol, endRow, endCol);
  aStar(startRow, startCol, endRow, endCol, 0);
});
dijkstraButton.addEventListener("click", () => {
  disableButtons();
  resetGridLeaveObstacles(startRow, startCol, endRow, endCol);
  dijkstra(startRow, startCol, endRow, endCol, 0);
});
newStartButton.addEventListener("click", () => {
  const xInput = document.getElementById("new-starting-x");
  const yInput = document.getElementById("new-starting-y");
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
  const xInput = document.getElementById("new-end-x");
  const yInput = document.getElementById("new-end-y");
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
  const inputContainer = document.getElementById("start-input-container");
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
  const inputContainer = document.getElementById("end-input-container");
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
table.addEventListener("mousedown", () => {
  isMouseDown = true;
});
table.addEventListener("mousemove", handleMouseMoveObstacle);
table.addEventListener("mouseup", () => {
  isMouseDown = false;
});
function handleMouseMoveWeight(event) {
  if (isMouseDown) {
    const target = event.target;
    if (target.tagName == "TD") {
      target.innerText = "W";
      const classList = target.classList;
      for (let i = 0; i < classList.length; i++) {
        if (classList[i] == "starting-cell" || classList[i] == "ending-cell") {
          return false; //if the cell is starting or ending, can't be an obstacle!
        }
      }
      target.classList = [];
      target.classList.add("weighted-cell");
    }
  }
}
function handleMouseMoveObstacle(event) {
  if (isMouseDown) {
    const target = event.target;
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
addWeightedNodesButton.addEventListener("click", () => {
  const table = document.getElementById("graph");
  document.getElementById("obstacle-text").innerText =
    "Click and drag to create weighted nodes!";
  table.removeEventListener("mousemove", handleMouseMoveObstacle);
  table.removeEventListener("mousemove", handleMouseMoveWeight);
  table.addEventListener("mousemove", handleMouseMoveWeight);
});
addWallsButton.addEventListener("click", () => {
  const table = document.getElementById("graph");
  document.getElementById("obstacle-text").innerText =
    "Click and drag to create walls!";
  table.removeEventListener("mousemove", handleMouseMoveObstacle);
  table.removeEventListener("mousemove", handleMouseMoveWeight);
  table.addEventListener("mousemove", handleMouseMoveObstacle);
});
function disableButtons() {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.style.opacity = ".5";
    button.style.filter = "grayscale(100%)";
    button.style.pointerEvents = "none";
  });
}
createGrid(startRow, startCol, endRow, endCol, numRows, numCols);
