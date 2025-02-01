function renderImage(img, x, y, w) {
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      let index = (i + j * img.width) * 4;
      let r = img.pixels[index + 0];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      fill(r, g, b);
      square(x + i * w, y + j * w, w);
    }
  }
}

function renderCell(img, x, y, w) {
  // TODO(fyang): replace the magic number.
  let i = floor(img.width / 2);
  let j = floor(img.height / 2);
  let index = (i + j * img.width) * 4;
  let r = img.pixels[index + 0];
  let g = img.pixels[index + 1];
  let b = img.pixels[index + 2];
  fill(r, g, b);
  square(x, y, w);
}

function copyTile(source, sx, sy, w, dest) {
  dest.loadPixels();
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < w; j++) {
      let pi = (sx + i) % source.width;
      let pj = (sy + j) % source.height;
      let index = (pi + pj * source.width) * 4;
      let r = source.pixels[index + 0];
      let g = source.pixels[index + 1];
      let b = source.pixels[index + 2];
      let a = source.pixels[index + 3];
      let index2 = (i + j * w) * 4;
      dest.pixels[index2 + 0] = r;
      dest.pixels[index2 + 1] = g;
      dest.pixels[index2 + 2] = b;
      dest.pixels[index2 + 3] = a;
    }
  }
  dest.updatePixels();
}

function hashImage(img) {
  return img.canvas.toDataURL();
}

function extractTiles(img) {
  let uniqueTiles = {};

  img.loadPixels();
  let counter = 0;
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      let tileImage = createImage(tile_width, tile_width);
      copyTile(img, i, j, tile_width, tileImage); 

      let tileKey = hashImage(tileImage);
      if (uniqueTiles[tileKey]) {
        uniqueTiles[tileKey].freq += 1;
      } else {
        uniqueTiles[tileKey] = new Tile(tileImage, counter);
        counter += 1;
      }
    }
  }
  return Object.values(uniqueTiles);
}

function  overlapping(this_img, other, direction) {
  if (direction == TRIGHT) {
    for (let i = 1; i < tile_width; i++) {
      for (let j = 0; j < tile_width; j++) {
        let indexA = (i + j * tile_width) * 4;
        let indexB = ((i - 1) + j * tile_width) * 4;
        if (differentColor(this_img, indexA, other, indexB)) {
          return false;
        }
      }
    }
    return true;
  } else if (direction == TLEFT) {
    for (let i = 0; i < tile_width - 1; i++) {
      for (let j = 0; j < tile_width; j++) {
        let indexA = (i + j * tile_width) * 4;
        let indexB = ((i + 1) + j * tile_width) * 4;
        if (differentColor(this_img, indexA, other, indexB)) {
          return false;
        }
      }
    }
    return true;
  } else if (direction == TUP) {
    for (let i = 0; i < tile_width; i++) {
      for (let j = 0; j < tile_width - 1; j++) {
        let indexA = (i + j * tile_width) * 4;
        let indexB = (i + (j + 1) * tile_width) * 4;
        if (differentColor(this_img, indexA, other, indexB)) {
          return false;
        }
      }
    }
    return true;
  } else if (direction == TDOWN) {
    for (let i = 0; i < tile_width; i++) {
      for (let j = 1; j < tile_width; j++) {
        let indexA = (i + j * tile_width) * 4;
        let indexB = (i + (j - 1) * tile_width) * 4;
        if (differentColor(this_img, indexA, other, indexB)) {
          return false;
        }
      }
    }
    return true;
  }
}

function differentColor(imgA, indexA, imgB, indexB) {
  let rA = imgA.pixels[indexA + 0];
  let gA = imgA.pixels[indexA + 1];
  let bA = imgA.pixels[indexA + 2];
  let rB = imgB.pixels[indexB + 0];
  let gB = imgB.pixels[indexB + 1];
  let bB = imgB.pixels[indexB + 2];
  return (rA != rB || gA != gB || bA != bB);
}

function getValidOptions(cell, neighbor, direction) {
  let validOptions = [];
  for (option of cell.options) {
    validOptions = validOptions.concat(tiles[option].neighbors[direction]);
  }
  return neighbor.options.filter(option => validOptions.includes(option));
}

function computeEntropy(options) {
  let entropy = 0;
  let total_freq = 0;
  for (let option of options) {
    total_freq += tiles[option].freq;
  }
  for (let option of options) {
    let prob = tiles[option].freq / total_freq;
    entropy -= prob * log(prob) / log(2);
  }
  return entropy;
}