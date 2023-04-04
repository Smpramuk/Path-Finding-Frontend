import { handleMouseMoveObstacle, handleMouseMoveWeight } from "./myscript.js";

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
  counter,
  wallsTrue
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
    const cell = document.getElementById(`${x},${y}`);
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
    }, counter * 2 + 800);
    if (x === destRow && y === destCol) {
      var path = createPath(parentMap, [x, y]);
      var pathLength = 0;
      for (let i = 0; i < path.length; i++) {
        if (
          document.getElementById(`${path[i][0]},${path[i][1]}`).classList[0] ==
          "weighted-cell"
        ) {
          pathLength += 10;
        } else {
          pathLength++;
        }
        setTimeout(() => {
          const x = path[i][0];
          const y = path[i][1];
          const cell = document.getElementById(`${x},${y}`);
          cell.classList.add("path");
          if (i == path.length - 1) {
            enableButtons();
            const table = document.getElementById("graph");
            if (wallsTrue) {
              table.addEventListener("mousemove", handleMouseMoveObstacle);
            } else {
              table.addEventListener("mousemove", handleMouseMoveWeight);
            }
          }
        }, (counter + i + 1) * 2 + 800);
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
    setTimeout(() => {
      enableButtons();
    }, (counter + 1) * 2 + 800);
    const table = document.getElementById("graph");
    if (wallsTrue) {
      table.addEventListener("mousemove", handleMouseMoveObstacle);
    } else {
      table.addEventListener("mousemove", handleMouseMoveWeight);
    }
    const dataDiv = document.querySelector(".algo-data");
    dataDiv.innerText = "No Path from DFS!";
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
    pathLength +
    "\nThe optimal path length is: " +
    optimalPathLength(sourceRow, sourceCol, destRow, destCol) +
    "\nDescription: Depth-first search (DFS) is a graph traversal algorithm that starts at a given node and explores as far as possible along each branch before backtracking. The algorithm maintains a stack to keep track of the nodes to visit, and marks each visited node to avoid revisiting them. DFS is useful for exploring all paths in a graph, and for detecting cycles in directed graphs. However, it may not find the shortest path between two nodes, as it may explore long branches before exploring shorter ones.";
}
export function bfs(
  sourceRow = startRow,
  sourceCol = startCol,
  destRow = endRow,
  destCol = endCol,
  counter,
  wallsTrue
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
    const cell = document.getElementById(`${x},${y}`);
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
    }, counter * 2 + 800);
    if (x === destRow && y === destCol) {
      var path = createPath(parentMap, [x, y]);
      var pathLength = 0;
      for (let i = 0; i < path.length; i++) {
        if (
          document.getElementById(`${path[i][0]},${path[i][1]}`).classList[0] ==
          "weighted-cell"
        ) {
          pathLength += 10;
        } else {
          pathLength++;
        }
        setTimeout(() => {
          const x = path[i][0];
          const y = path[i][1];
          const cell = document.getElementById(`${x},${y}`);
          cell.classList.add("path");
          if (i == path.length - 1) {
            enableButtons();
            const table = document.getElementById("graph");
            if (wallsTrue) {
              table.addEventListener("mousemove", handleMouseMoveObstacle);
            } else {
              table.addEventListener("mousemove", handleMouseMoveWeight);
            }
          }
        }, (counter + i + 1) * 2 + 800);
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
    setTimeout(() => {
      enableButtons();
    }, (counter + 1) * 2 + 800);
    const table = document.getElementById("graph");
    if (wallsTrue) {
      table.addEventListener("mousemove", handleMouseMoveObstacle);
    } else {
      table.addEventListener("mousemove", handleMouseMoveWeight);
    }
    const dataDiv = document.querySelector(".algo-data");
    dataDiv.innerText = "No Path from BFS!";
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
    pathLength +
    "\nThe optimal path length is: " +
    optimalPathLength(sourceRow, sourceCol, destRow, destCol) +
    "\nDescription: Breadth-first search (BFS) is an algorithm for traversing or searching a graph, starting from a specific node. It explores all the neighboring nodes at the present depth level before moving on to nodes at the next level. This approach ensures that the shortest path to any reachable node is found first. BFS maintains a queue of nodes to visit, and marks each visited node to avoid revisiting them. The algorithm continues to visit nodes in the queue until all reachable nodes have been visited, or a desired node has been found.";
}
export function aStar(
  sourceRow = startRow,
  sourceCol = startCol,
  destRow = endRow,
  destCol = endCol,
  counter,
  wallsTrue
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
    const cell = document.getElementById(`${x},${y}`);
    if (x === sourceRow && y === sourceCol) {
      const neighbors = getAllNeighbors(x, y);
      neighbors.forEach((element) => {
        if (
          isValidSquare(element[0], element[1]) &&
          !seen.has(hashCode(element[0], element[1]))
        ) {
          if (!parentMap.hasOwnProperty(`${element[0]},${element[1]}`)) {
            parentMap[`${element[0]},${element[1]}`] = `${x},${y}`;
          }
          nodes.enqueue(
            element,
            getCostSoFar(parentMap, element) +
              getHeuristic(element, [destRow, destCol])
          );
        }
      });
      continue;
    }
    setTimeout(() => {
      cell.classList.add("seen");
      if (x === destRow && y == destCol) {
        cell.classList.add("arrived");
      }
    }, counter * 2 + 800);
    if (x === destRow && y === destCol) {
      var path = createPath(parentMap, [x, y]);
      var pathLength = 0;
      for (let i = 0; i < path.length; i++) {
        if (
          document.getElementById(`${path[i][0]},${path[i][1]}`).classList[0] ==
          "weighted-cell"
        ) {
          pathLength += 10;
        } else {
          pathLength++;
        }
        setTimeout(() => {
          const x = path[i][0];
          const y = path[i][1];
          const cell = document.getElementById(`${x},${y}`);
          cell.classList.add("path");
          if (i == path.length - 1) {
            enableButtons();
            const table = document.getElementById("graph");
            if (wallsTrue) {
              table.addEventListener("mousemove", handleMouseMoveObstacle);
            } else {
              table.addEventListener("mousemove", handleMouseMoveWeight);
            }
          }
        }, (counter + i + 1) * 2 + 800);
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
        if (!parentMap.hasOwnProperty(`${element[0]},${element[1]}`)) {
          parentMap[`${element[0]},${element[1]}`] = `${x},${y}`;
        }
        nodes.enqueue(
          element,
          getCostSoFar(parentMap, element) +
            getHeuristic(element, [destRow, destCol])
        );
      }
    });
  }
  if (nodes.isEmpty()) {
    setTimeout(() => {
      enableButtons();
    }, (counter + 1) * 2 + 800);
    const table = document.getElementById("graph");
    if (wallsTrue) {
      table.addEventListener("mousemove", handleMouseMoveObstacle);
    } else {
      table.addEventListener("mousemove", handleMouseMoveWeight);
    }
    const dataDiv = document.querySelector(".algo-data");
    dataDiv.innerText = "No Path from A*!";
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
    pathLength +
    "\nThe optimal path length is: " +
    optimalPathLength(sourceRow, sourceCol, destRow, destCol) +
    "\nDescription: A* is an informed search algorithm, or a best-first search, meaning that it is formulated in terms of weighted graphs: starting from a specific starting node of a graph, it aims to find a path to the given goal node having the smallest cost (least distance travelled, shortest time, etc.). It does this by maintaining a tree of paths originating at the start node and extending those paths one edge at a time until its termination criterion is satisfied.";
}
export function dijkstra(
  sourceRow = startRow,
  sourceCol = startCol,
  destRow = endRow,
  destCol = endCol,
  counter,
  wallsTrue
) {
  const nodes = new PriorityQueue(); //[[sourceRow, sourceCol]]; //keep track of nodes by their x, y coordinate pair
  const seen = new Set();
  const parentMap = {};
  parentMap[`${sourceRow},${sourceCol}`] = null;
  nodes.enqueue(
    [sourceRow, sourceCol],
    getCostSoFar(parentMap, [sourceRow, sourceCol])
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
    const cell = document.getElementById(`${x},${y}`);
    if (x === sourceRow && y === sourceCol) {
      const neighbors = getAllNeighbors(x, y);
      neighbors.forEach((element) => {
        if (
          isValidSquare(element[0], element[1]) &&
          !seen.has(hashCode(element[0], element[1]))
        ) {
          if (!parentMap.hasOwnProperty(`${element[0]},${element[1]}`)) {
            parentMap[`${element[0]},${element[1]}`] = `${x},${y}`;
          }
          nodes.enqueue(element, getCostSoFar(parentMap, element));
        }
      });
      continue;
    }
    setTimeout(() => {
      cell.classList.add("seen");
      if (x === destRow && y == destCol) {
        cell.classList.add("arrived");
      }
    }, counter * 2 + 1100);
    if (x === destRow && y === destCol) {
      var path = createPath(parentMap, [x, y]);
      var pathLength = 0;
      for (let i = 0; i < path.length; i++) {
        if (
          document.getElementById(`${path[i][0]},${path[i][1]}`).classList[0] ==
          "weighted-cell"
        ) {
          pathLength += 10;
        } else {
          pathLength++;
        }
        setTimeout(() => {
          const x = path[i][0];
          const y = path[i][1];
          const cell = document.getElementById(`${x},${y}`);
          cell.classList.add("path");
          if (i == path.length - 1) {
            enableButtons();
            const table = document.getElementById("graph");
            if (wallsTrue) {
              table.addEventListener("mousemove", handleMouseMoveObstacle);
            } else {
              table.addEventListener("mousemove", handleMouseMoveWeight);
            }
          }
        }, (counter + i + 1) * 2 + 1100);
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
        if (!parentMap.hasOwnProperty(`${element[0]},${element[1]}`)) {
          parentMap[`${element[0]},${element[1]}`] = `${x},${y}`;
        }
        nodes.enqueue(element, getCostSoFar(parentMap, element));
        // link the parent to the child, and enqueue the child
      }
    });
  }
  if (nodes.isEmpty()) {
    setTimeout(() => {
      enableButtons();
    }, (counter + 1) * 2 + 800);
    const table = document.getElementById("graph");
    if (wallsTrue) {
      table.addEventListener("mousemove", handleMouseMoveObstacle);
    } else {
      table.addEventListener("mousemove", handleMouseMoveWeight);
    }
    const dataDiv = document.querySelector(".algo-data");
    dataDiv.innerText = "No Path from Dijkstra!";
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
    pathLength +
    "\nThe optimal path length is: " +
    optimalPathLength(sourceRow, sourceCol, destRow, destCol) +
    "\nDescription: Dijkstra's algorithm is a graph traversal algorithm that finds the shortest path between a starting node and all other nodes in a weighted graph. It achieves this by maintaining a priority queue of nodes based on their distance from the starting node, and iteratively visiting the closest node until all nodes have been visited. During each iteration, the algorithm relaxes the edges connecting the current node to its neighboring nodes, updating their distances if a shorter path is found.";
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
      } else if (i == endX && j == endY) {
        cell.classList = [];
        cell.classList.add("ending-cell");
      } else {
        cell.innerText = "";
        cell.classList = [];
      }
    }
  }
  const dataDiv = document.querySelector(".algo-data");
  dataDiv.innerText = "See data here after selecting an algorithm!";
}
export function resetGridLeaveObstacles(
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
        cell.innerText = "";
        cell.classList.add("starting-cell");
      } else if (i == endX && j == endY) {
        cell.classList = [];
        cell.innerText = "";
        cell.classList.add("ending-cell");
      } else {
        const classList = cell.classList;
        let obstacle = false;
        for (let i = 0; i < classList.length; i++) {
          if (classList[i] == "obstacle") {
            obstacle = true; //if the cell is an obstacle, return false
          } else if (classList[i] == "weighted-cell") {
            obstacle = true;
            cell.classList = [];
            cell.classList.add("weighted-cell");
          }
        }
        if (obstacle) {
          continue;
        }
        cell.classList = [];
      }
    }
  }
  const dataDiv = document.querySelector(".algo-data");
  dataDiv.innerText = "See data here after selecting an algorithm!";
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
      cell.id = `${i},${j}`;
      if (i == srcRow && j == srcCol) {
        cell.classList.add("starting-cell");
      } else if (i == destRow && j == destCol) {
        cell.classList.add("ending-cell");
      }
      row.appendChild(cell);
      // cell.addEventListener("click", () => {
      //   cell.classList = [];
      //   cell.classList.add("obstacle");
      // });
    }
    document.querySelector("table").appendChild(row);
  }
}
export function toggleDropdown() {
  var menu = document.querySelector(".new-points-dropdown");
  menu.style.opacity = menu.style.opacity === "1" ? "0" : "1";
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
  var pathLength = 0;
  let curX = curPoint[0];
  let curY = curPoint[1];
  while (map[`${curX},${curY}`]) {
    if (
      document.getElementById(`${curX},${curY}`).classList[0] == "weighted-cell"
    ) {
      pathLength += 10;
      const nextPoint = map[`${curX},${curY}`];
      const [newX, newY] = nextPoint.split(",").map((str) => parseInt(str));
      curX = newX;
      curY = newY;
    } else {
      pathLength++;
      const nextPoint = map[`${curX},${curY}`];
      const [newX, newY] = nextPoint.split(",").map((str) => parseInt(str));
      curX = newX;
      curY = newY;
    }
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
  //return optimalPathLength(curX, curY, targetX, targetY); //PAINFULLY SLOW!!!
  // Distance formula for heuristic
}
function optimalPathLength(
  sourceRow = startRow,
  sourceCol = startCol,
  destRow = endRow,
  destCol = endCol
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
    seen.add(curNodeHash);
    if (x === sourceRow && y === sourceCol) {
      const neighbors = getAllNeighbors(x, y);
      neighbors.forEach((element) => {
        if (
          isValidSquare(element[0], element[1]) &&
          !seen.has(hashCode(element[0], element[1]))
        ) {
          parentMap[`${element[0]},${element[1]}`] = `${x},${y}`;
          nodes.enqueue(
            element,
            getCostSoFar(parentMap, element) +
              getHeuristic(element, [destRow, destCol])
          );
        }
      });
      continue;
    }
    if (x === destRow && y === destCol) {
      var path = createPath(parentMap, [x, y]);
      var pathLength = 0;
      for (let i = 0; i < path.length; i++) {
        if (
          document.getElementById(`${path[i][0]},${path[i][1]}`).classList[0] ==
          "weighted-cell"
        ) {
          pathLength += 10;
        } else {
          pathLength++;
        }
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
        if (!parentMap.hasOwnProperty(`${element[0]},${element[1]}`)) {
          parentMap[`${element[0]},${element[1]}`] = `${x},${y}`;
        }
        nodes.enqueue(
          element,
          getCostSoFar(parentMap, element) +
            getHeuristic(element, [destRow, destCol])
        );
      }
    });
  }
  return pathLength;
}
function enableButtons() {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.style.opacity = "";
    button.style.filter = "";
    button.style.pointerEvents = "";
  });
}
