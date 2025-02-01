const tile_width = 3;
let img;
let tiles;
let DIM = 40;
let grid = [];
let w;
let max_recursion = 10;

function preload() {
  img = loadImage('images/Flowers.png');
}

function setup() {
  
  // set the random seed
  randomSeed(42);

  createCanvas(400, 400);
  tiles = extractTiles(img);
  for (let i = 0; i < tiles.length; i++) {
    let tile = tiles[i];
    tile.calculateNeighbors(tiles);
  }

  w = width / DIM;
  initializeGrid();
}

function initializeGrid() {
  grid = [];
  for (let j = 0; j < DIM; j++) {
    for (let i = 0; i < DIM; i++) {
      grid.push(new Cell(tiles, i * w, j * w, w, grid.length));
    }
  }
}

function draw() {
  background(220);
  
  // let i = 20
  // renderImage(tiles[i].img, 0, 0, w);
  // let y = 0;
  // for (index of tiles[i].neighbors[TUP]) {
  //   renderImage(tiles[index].img, w * tile_width, y, w);
  //   y += w * tile_width;
  // }
  // return;
  
  wfc();
 
  for (let i = 0; i < grid.length; i++) {
    if (grid[i].options.length == 0) {
      console.log('Restart');
      initializeGrid();
      break;
    }
    grid[i].show();
    grid[i].checked = false;
  }
}
 
function wfc() {
  let gridCopy = grid.slice();
  gridCopy = gridCopy.filter(cell => !cell.collapsed);
  if (gridCopy.length == 0) {
    noLoop();
    return;
  }

  // Pick a cell with the least entropy
  gridCopy.sort((a, b) => computeEntropy(a.options) - computeEntropy(b.options));
  // Keep only the lowest entropy cells
  let len = gridCopy[0].options.length;
  let stopIndex = 0;
  for (let i = 0; i < gridCopy.length; i++) {
    if (gridCopy[i].options.length > len) {
      stopIndex = i;
      break;
    }
  }
  if (stopIndex > 0) {
    // NOTE(fyang): it is splice not slice!
    gridCopy.splice(stopIndex);
  }

  // Collapse a cell
  const cell = random(gridCopy);
  cell.collapsed = true;
  // console.log('collapse cell: ', cell.index);
  const pick = random(cell.options);
  cell.options = [pick];

  reduceEntropy(grid, cell, 0);
} 

function reduceEntropy(grid, cell, depth) {
  if (cell.checked) {
    return;
  }
  if (depth > max_recursion) {
    return;
  }

  cell.checked = true;

  let index = cell.index;
  let i = floor(index % DIM);
  let j = floor(index / DIM);

  // RIGHT
  if (i + 1 < DIM) {
    let rightCell = grid[i + 1 + j * DIM];
    rightCell.options = getValidOptions(cell, rightCell, TRIGHT);
    reduceEntropy(grid, rightCell, depth + 1);
  }

  // LEFT
  if (i - 1 >= 0) {
    let leftCell = grid[i - 1 + j * DIM];
    leftCell.options = getValidOptions(cell, leftCell, TLEFT);
    reduceEntropy(grid, leftCell, depth + 1);
  }

  // UP
  if (j - 1 >= 0) {
    let upCell = grid[i + (j - 1) * DIM];
    upCell.options = getValidOptions(cell, upCell, TUP);
    reduceEntropy(grid, upCell, depth + 1);
  }

  // DOWN
  if (j + 1 < DIM) {
    let downCell = grid[i + (j + 1) * DIM];
    downCell.options = getValidOptions(cell, downCell, TDOWN);
    reduceEntropy(grid, downCell, depth + 1);
  }
}

function keyPressed() {
  if (key == 's') {
    saveGif('wfc', 30);
  }
}