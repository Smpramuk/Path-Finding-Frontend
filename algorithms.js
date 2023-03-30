const numRows = 30;
const numCols = 30;
function withinBounds(x, y) {
  return x < numRows && x >= 0 && y < numCols && y >= 0;
}
export function isValidSquare(x, y) {
  if (withinBounds(x, y)) {
    const cell = document.querySelector(
      `tr:nth-child(${x + 1}) td:nth-child(${y + 1})`
    );
    const classList = cell.classList;
    for (let i = 0; i < classList.length; i++) {
      if (classList[i] == "obstacle") {
        return false; //if the cell is an obstacle, return false
      }
    }
    return true;
  }
  return false;
}
function getAllNeighbors(x, y) {
  const arr = [];
  arr.push([x + 1, y]);
  arr.push([x - 1, y]);
  arr.push([x, y + 1]);
  arr.push([x, y - 1]);
  return arr;
}
function hashCode(x, y) {
  let ret = 1;
  ret = ret * (x + 3) * 31 + 1;
  ret = ret * (y + 2) * 31 + 1;
  ret = ret * 2231 + 3;
  return ret;
}
export function dfs(
  sourceRow = startRow,
  sourceCol = startCol,
  destRow = endRow,
  destCol = endCol,
  counter
) {
  const nodes = [[sourceRow, sourceCol]]; //keep track of nodes by their x, y coordinate pair
  const seen = new Set();
  const parentMap = {};
  parentMap[`${sourceRow},${sourceCol}`] = null;
  while (nodes.length > 0) {
    // while there are still nodes, check if we are at the final node
    const curNode = nodes.pop();
    const x = curNode[0];
    const y = curNode[1];
    const curNodeHash = hashCode(x, y);
    if (seen.has(curNodeHash)) {
      continue;
      // if we've already seen the node, or it's not on the grid go to the next node
    }
    if (!isValidSquare(x, y)) {
      if (!seen.has(curNodeHash)) {
        seen.add(curNodeHash);
      }
      continue;
    }
    counter++;
    seen.add(curNodeHash);
    const cell = document.querySelector(
      `tr:nth-child(${x + 1}) td:nth-child(${y + 1})`
    );
    if (x === sourceRow && y === sourceCol) {
      const neighbors = getAllNeighbors(x, y);
      neighbors.forEach((element) => {
        if (
          isValidSquare(element[0], element[1]) &&
          !seen.has(hashCode(element[0], element[1]))
        ) {
          nodes.push(element);
          parentMap[`${element[0]},${element[1]}`] = `${x},${y}`;
        }
      });
      continue;
    }
    setTimeout(() => {
      cell.classList.add("seen");
      if (x === destRow && y == destCol) {
        cell.classList.add("arrived");
      }
    }, counter * 2);
    if (x === destRow && y === destCol) {
      console.log("ARRIVED!");
      var path = createPath(parentMap, [x, y]);
      for (let i = 0; i < path.length; i++) {
        setTimeout(() => {
          const x = path[i][0];
          const y = path[i][1];
          const cell = document.querySelector(
            `tr:nth-child(${x + 1}) td:nth-child(${y + 1})`
          );
          cell.classList.add("path");
        }, (counter + i + 1) * 2);
      }
      break;
    }
    // enqueue every neighboring node
    const neighbors = getAllNeighbors(x, y);
    neighbors.forEach((element) => {
      if (
        isValidSquare(element[0], element[1]) &&
        !seen.has(hashCode(element[0], element[1]))
      ) {
        nodes.push(element);
        parentMap[`${element[0]},${element[1]}`] = `${x},${y}`;
      }
    });
  }
  if (nodes.length == 0) {
    const dataDiv = document.querySelector(".algo-data");
    dataDiv.innerText = "No Path from dfs!";
    return;
  }
  const dataDiv = document.querySelector(".algo-data");
  dataDiv.innerText =
    "DFS DATA:\nThis algorithm took a total of: " +
    counter +
    " iterations to get from (" +
    sourceRow +
    "," +
    sourceCol +
    ") to (" +
    destRow +
    "," +
    destCol +
    ").\n It had a path length of: " +
    path.length +
    "\nThe optimal path length is: " +
    optimalPathLength(sourceRow, sourceCol, destRow, destCol);
}
export function bfs(
  sourceRow = startRow,
  sourceCol = startCol,
  destRow = endRow,
  destCol = endCol,
  counter
) {
  const nodes = [[sourceRow, sourceCol]]; //keep track of nodes by their x, y coordinate pair
  const seen = new Set();
  const parentMap = {};
  parentMap[`${sourceRow},${sourceCol}`] = null;
  while (nodes.length > 0) {
    // while there are still nodes, check if we are at the final node
    const curNode = nodes.shift();
    const x = curNode[0];
    const y = curNode[1];
    console.log(x + "," + y);
    const curNodeHash = hashCode(x, y);
    if (seen.has(curNodeHash)) {
      continue;
      // if we've already seen the node, or it's not on the grid go to the next node
    }
    if (!isValidSquare(x, y)) {
      if (!seen.has(curNodeHash)) {
        seen.add(curNodeHash);
      }
      continue;
    }
    counter++;
    seen.add(curNodeHash);
    const cell = document.querySelector(
      `tr:nth-child(${x + 1}) td:nth-child(${y + 1})`
    );
    if (x === sourceRow && y === sourceCol) {
      const neighbors = getAllNeighbors(x, y);
      neighbors.forEach((element) => {
        if (
          isValidSquare(element[0], element[1]) &&
          !seen.has(hashCode(element[0], element[1]))
        ) {
          nodes.push(element);
          parentMap[`${element[0]},${element[1]}`] = `${x},${y}`;
        }
      });
      continue;
    }
    setTimeout(() => {
      cell.classList.add("seen");
      if (x === destRow && y == destCol) {
        cell.classList.add("arrived");
      }
    }, counter * 2);
    if (x === destRow && y === destCol) {
      console.log("ARRIVED!");
      var path = createPath(parentMap, [x, y]);
      for (let i = 0; i < path.length; i++) {
        setTimeout(() => {
          const x = path[i][0];
          const y = path[i][1];
          const cell = document.querySelector(
            `tr:nth-child(${x + 1}) td:nth-child(${y + 1})`
          );
          cell.classList.add("path");
        }, (counter + i + 1) * 2);
      }
      break;
    }
    // enqueue every neighboring node
    const neighbors = getAllNeighbors(x, y);
    neighbors.forEach((element) => {
      if (
        isValidSquare(element[0], element[1]) &&
        !seen.has(hashCode(element[0], element[1]))
      ) {
        nodes.push(element);
        parentMap[`${element[0]},${element[1]}`] = `${x},${y}`;
      }
    });
  }
  if (nodes.length == 0) {
    const dataDiv = document.querySelector(".algo-data");
    dataDiv.innerText = "No Path from bfs!";
    return;
  }
  const dataDiv = document.querySelector(".algo-data");
  dataDiv.innerText =
    "BFS DATA:\nThis algorithm took a total of: " +
    counter +
    " iterations to get from (" +
    sourceRow +
    "," +
    sourceCol +
    ") to (" +
    destRow +
    "," +
    destCol +
    ").\n It had a path length of: " +
    path.length +
    "\nThe optimal path length is: " +
    optimalPathLength(sourceRow, sourceCol, destRow, destCol);
}
export function aStar(
  sourceRow = startRow,
  sourceCol = startCol,
  destRow = endRow,
  destCol = endCol,
  counter
) {
  const nodes = new PriorityQueue(); //[[sourceRow, sourceCol]]; //keep track of nodes by their x, y coordinate pair
  const seen = new Set();
  const parentMap = {};
  parentMap[`${sourceRow},${sourceCol}`] = null;
  nodes.enqueue(
    [sourceRow, sourceCol],
    getCostSoFar(parentMap, [sourceRow, sourceCol]) +
      getHeuristic([sourceRow, sourceCol], [destRow, destCol])
  );
  while (!nodes.isEmpty()) {
    // while there are still nodes, check if we are at the final node
    const curNode = nodes.dequeue();
    const x = curNode[0];
    const y = curNode[1];
    const curNodeHash = hashCode(x, y);
    if (seen.has(curNodeHash)) {
      continue;
      // if we've already seen the node, or it's not on the grid go to the next node
    }
    if (!isValidSquare(x, y)) {
      if (!seen.has(curNodeHash)) {
        seen.add(curNodeHash);
      }
      continue;
    }
    counter++;
    seen.add(curNodeHash);
    const cell = document.querySelector(
      `tr:nth-child(${x + 1}) td:nth-child(${y + 1})`
    );
    if (x === sourceRow && y === sourceCol) {
      const neighbors = getAllNeighbors(x, y);
      neighbors.forEach((element) => {
        if (
          isValidSquare(element[0], element[1]) &&
          !seen.has(hashCode(element[0], element[1]))
        ) {
          nodes.enqueue(
            element,
            getCostSoFar(parentMap, element) +
              getHeuristic(element, [destRow, destCol])
          );
          parentMap[`${element[0]},${element[1]}`] = `${x},${y}`;
        }
      });
      continue;
    }
    setTimeout(() => {
      cell.classList.add("seen");
      if (x === destRow && y == destCol) {
        cell.classList.add("arrived");
      }
    }, counter * 5);
    if (x === destRow && y === destCol) {
      console.log("ARRIVED!");
      var path = createPath(parentMap, [x, y]);
      for (let i = 0; i < path.length; i++) {
        setTimeout(() => {
          const x = path[i][0];
          const y = path[i][1];
          const cell = document.querySelector(
            `tr:nth-child(${x + 1}) td:nth-child(${y + 1})`
          );
          cell.classList.add("path");
        }, (counter + i + 1) * 5);
      }
      break;
    }
    // enqueue every neighboring node
    const neighbors = getAllNeighbors(x, y);
    neighbors.forEach((element) => {
      if (
        isValidSquare(element[0], element[1]) &&
        !seen.has(hashCode(element[0], element[1]))
      ) {
        nodes.enqueue(
          element,
          getCostSoFar(parentMap, element) +
            getHeuristic(element, [destRow, destCol])
        );
        parentMap[`${element[0]},${element[1]}`] = `${x},${y}`;
      }
    });
  }
  if (nodes.isEmpty()) {
    const dataDiv = document.querySelector(".algo-data");
    dataDiv.innerText = "No Path from astar!";
    return;
  }
  const dataDiv = document.querySelector(".algo-data");
  dataDiv.innerText =
    "A* DATA:\nThis algorithm took a total of: " +
    counter +
    " iterations to get from (" +
    sourceRow +
    "," +
    sourceCol +
    ") to (" +
    destRow +
    "," +
    destCol +
    ").\n It had a path length of: " +
    path.length +
    "\nThe optimal path length is: " +
    optimalPathLength(sourceRow, sourceCol, destRow, destCol);
}
export function dijkstra(
  sourceRow = startRow,
  sourceCol = startCol,
  destRow = endRow,
  destCol = endCol,
  counter
) {
  const nodes = new PriorityQueue(); //[[sourceRow, sourceCol]]; //keep track of nodes by their x, y coordinate pair
  const seen = new Set();
  const parentMap = {};
  parentMap[`${sourceRow},${sourceCol}`] = null;
  nodes.enqueue(
    [sourceRow, sourceCol],
    getCostSoFar(parentMap, [sourceRow, sourceCol]) +
      getHeuristic([sourceRow, sourceCol], [destRow, destCol])
  );
  while (!nodes.isEmpty()) {
    // while there are still nodes, check if we are at the final node
    const curNode = nodes.dequeue();
    const x = curNode[0];
    const y = curNode[1];
    const curNodeHash = hashCode(x, y);
    if (seen.has(curNodeHash)) {
      continue;
      // if we've already seen the node, or it's not on the grid go to the next node
    }
    if (!isValidSquare(x, y)) {
      if (!seen.has(curNodeHash)) {
        seen.add(curNodeHash);
      }
      continue;
    }
    counter++;
    seen.add(curNodeHash);
    const cell = document.querySelector(
      `tr:nth-child(${x + 1}) td:nth-child(${y + 1})`
    );
    if (x === sourceRow && y === sourceCol) {
      const neighbors = getAllNeighbors(x, y);
      neighbors.forEach((element) => {
        if (
          isValidSquare(element[0], element[1]) &&
          !seen.has(hashCode(element[0], element[1]))
        ) {
          nodes.enqueue(element, getCostSoFar(parentMap, element));
          parentMap[`${element[0]},${element[1]}`] = `${x},${y}`;
        }
      });
      continue;
    }
    setTimeout(() => {
      cell.classList.add("seen");
      if (x === destRow && y == destCol) {
        cell.classList.add("arrived");
      }
    }, counter * 5);
    if (x === destRow && y === destCol) {
      console.log("ARRIVED!");
      var path = createPath(parentMap, [x, y]);
      for (let i = 0; i < path.length; i++) {
        setTimeout(() => {
          const x = path[i][0];
          const y = path[i][1];
          const cell = document.querySelector(
            `tr:nth-child(${x + 1}) td:nth-child(${y + 1})`
          );
          cell.classList.add("path");
        }, (counter + i + 1) * 5);
      }
      break;
    }
    // enqueue every neighboring node
    const neighbors = getAllNeighbors(x, y);
    neighbors.forEach((element) => {
      if (
        isValidSquare(element[0], element[1]) &&
        !seen.has(hashCode(element[0], element[1]))
      ) {
        nodes.enqueue(element, getCostSoFar(parentMap, element));
        parentMap[`${element[0]},${element[1]}`] = `${x},${y}`;
      }
    });
  }
  if (nodes.isEmpty()) {
    const dataDiv = document.querySelector(".algo-data");
    dataDiv.innerText = "No Path from astar!";
    return;
  }
  const dataDiv = document.querySelector(".algo-data");
  dataDiv.innerText =
    "Dijkstra DATA:\nThis algorithm took a total of: " +
    counter +
    " iterations to get from (" +
    sourceRow +
    "," +
    sourceCol +
    ") to (" +
    destRow +
    "," +
    destCol +
    ").\n It had a path length of: " +
    path.length +
    "\nThe optimal path length is: " +
    optimalPathLength(sourceRow, sourceCol, destRow, destCol);
}
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  // Add an item to the queue with a priority
  enqueue(item, priority) {
    this.items.push({ item, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  // Remove and return the item with the highest priority
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift().item;
  }

  // Return the item with the highest priority without removing it
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0].item;
  }

  // Return true if the queue is empty, false otherwise
  isEmpty() {
    return this.items.length === 0;
  }
}
export function resetGrid(
  startX = startRow,
  startY = startCol,
  endX = endRow,
  endY = endCol
) {
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const cell = document.querySelector(
        `tr:nth-child(${i + 1}) td:nth-child(${j + 1})`
      );
      if (i == startX && j == startY) {
        cell.classList = [];
        cell.classList.add("starting-cell");
        console.log("The starting cell has been hit!");
      } else if (i == endX && j == endY) {
        cell.classList = [];
        cell.classList.add("ending-cell");
      } else {
        cell.classList = [];
      }
    }
  }
  const dataDiv = document.querySelector(".algo-data");
  dataDiv.innerText = "";
}
export function resetGridLeaveObstacles(
  startX = startRow,
  startY = startCol,
  endX = endRow,
  endY = endCol
) {
  console.log(startX + "," + startY + " in resetGrid");
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const cell = document.querySelector(
        `tr:nth-child(${i + 1}) td:nth-child(${j + 1})`
      );
      if (i == startX && j == startY) {
        cell.classList = [];
        cell.classList.add("starting-cell");
        console.log("The starting cell has been hit!");
      } else if (i == endX && j == endY) {
        cell.classList = [];
        cell.classList.add("ending-cell");
      } else {
        const classList = cell.classList;
        let obstacle = false;
        for (let i = 0; i < classList.length; i++) {
          if (classList[i] == "obstacle") {
            obstacle = true; //if the cell is an obstacle, return false
          }
        }
        if (obstacle) {
          continue;
        }
        cell.classList = [];
      }
    }
  }
}
export function createGrid(
  srcRow = startRow,
  srcCol = startCol,
  destRow = endRow,
  destCol = endCol
) {
  for (let i = 0; i < numRows; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < numCols; j++) {
      const cell = document.createElement("td");
      if (i == srcRow && j == srcCol) {
        cell.classList.add("starting-cell");
      } else if (i == destRow && j == destCol) {
        cell.classList.add("ending-cell");
      }
      row.appendChild(cell);
      cell.addEventListener("click", () => {
        cell.classList.add("obstacle");
      });
    }
    document.querySelector("table").appendChild(row);
  }
}
export function toggleDropdown() {
  var menu = document.querySelector(".new-points-dropdown");
  var button = document.getElementById(".new-points");

  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
  menu.style.top = "100%";
  menu.style.left = "15%";
}
function createPath(map, curPoint) {
  const path = [];
  let curX = curPoint[0];
  let curY = curPoint[1];
  const [newX, newY] = map[`${curX},${curY}`]
    .split(",")
    .map((str) => parseInt(str));
  curX = newX;
  curY = newY;

  while (map[`${curX},${curY}`]) {
    path.push([curX, curY]);
    const nextPoint = map[`${curX},${curY}`];
    const [newX, newY] = nextPoint.split(",").map((str) => parseInt(str));
    curX = newX;
    curY = newY;
  }
  path.reverse;
  return path;
}
function getCostSoFar(map, curPoint) {
  let pathLength = 0;
  let curX = curPoint[0];
  let curY = curPoint[1];
  while (map[`${curX},${curY}`]) {
    pathLength++;
    const nextPoint = map[`${curX},${curY}`];
    const [newX, newY] = nextPoint.split(",").map((str) => parseInt(str));
    curX = newX;
    curY = newY;
  }
  return pathLength;
}
function getHeuristic(curPoint, targetPoint) {
  const curX = curPoint[0];
  const curY = curPoint[1];
  const targetX = targetPoint[0];
  const targetY = targetPoint[1];
  const deltaX = Math.abs(curX - targetX);
  const deltaY = Math.abs(curY - targetY);
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  //return optimalPathLength(curX, curY, targetX, targetY);
  // Distance formula for heuristic
}
function optimalPathLength(
  sourceRow = startRow,
  sourceCol = startCol,
  destRow = endRow,
  destCol = endCol
) {
  const nodes = [[sourceRow, sourceCol]]; //keep track of nodes by their x, y coordinate pair
  const seen = new Set();
  const parentMap = {};
  parentMap[`${sourceRow},${sourceCol}`] = null;
  while (nodes.length > 0) {
    // while there are still nodes, check if we are at the final node
    const curNode = nodes.shift();
    const x = curNode[0];
    const y = curNode[1];
    const curNodeHash = hashCode(x, y);
    var path;
    if (seen.has(curNodeHash)) {
      continue;
      // if we've already seen the node, or it's not on the grid go to the next node
    }
    if (!isValidSquare(x, y)) {
      if (!seen.has(curNodeHash)) {
        seen.add(curNodeHash);
      }
      continue;
    }
    seen.add(curNodeHash);
    if (x === sourceRow && y === sourceCol) {
      const neighbors = getAllNeighbors(x, y);
      neighbors.forEach((element) => {
        if (
          isValidSquare(element[0], element[1]) &&
          !seen.has(hashCode(element[0], element[1]))
        ) {
          nodes.push(element);
          parentMap[`${element[0]},${element[1]}`] = `${x},${y}`;
        }
      });
      continue;
    }
    if (x === destRow && y === destCol) {
      path = createPath(parentMap, [x, y]);
      break;
    }
    // enqueue every neighboring node
    const neighbors = getAllNeighbors(x, y);
    neighbors.forEach((element) => {
      if (
        isValidSquare(element[0], element[1]) &&
        !seen.has(hashCode(element[0], element[1]))
      ) {
        nodes.push(element);
        parentMap[`${element[0]},${element[1]}`] = `${x},${y}`;
      }
    });
  }
  return path ? path.length : 0;
}
