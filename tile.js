const TRIGHT = 0;
const TLEFT = 1;
const TUP = 2;
const TDOWN = 3;

class Tile {
  constructor(img, i) {
    this.img = img;
    this.img.loadPixels();
    this.index = i;
    this.freq = 1;
    this.neighbors = [];
    this.neighbors[TRIGHT] = [];
    this.neighbors[TLEFT] = [];
    this.neighbors[TUP] = [];
    this.neighbors[TDOWN] = [];
  }

  calculateNeighbors(tiles) {
    for (let i = 0; i < tiles.length; i++) {
      if (overlapping(this.img, tiles[i].img, TRIGHT)) {
        this.neighbors[TRIGHT].push(i);
      }
      if (overlapping(this.img, tiles[i].img, TLEFT)) {
        this.neighbors[TLEFT].push(i);
      }
      if (overlapping(this.img, tiles[i].img, TUP)) {
        this.neighbors[TUP].push(i);
      }
      if (overlapping(this.img, tiles[i].img, TDOWN)) {
        this.neighbors[TDOWN].push(i);
      }
    }
  }
}