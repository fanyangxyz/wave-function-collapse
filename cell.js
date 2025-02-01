class Cell {
  constructor(tiles, x, y, w, index) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.index = index;
    this.options = []
    this.collapsed = false;
    this.checked = false;
    for (let i = 0; i < tiles.length; i++) {
      this.options.push(i);
    }
  }

  show() {
    if (this.collapsed) {
      let tileIndex = this.options[0];
      let tile = tiles[tileIndex];
      renderCell(tile.img, this.x, this.y, this.w);
    } else {
      noFill();
      stroke(255);
      square(this.x, this.y, this.w);
    }
  }
}