// JavaScript source code


class map {
  constructor(x, y, biome) {
    this.altura = x;
    this.largura = y;
	this.biome = biome;
  }
}

grid = { };

grid[[0, 0]] = new map(0,0, "Grassland");

alert(grid[[0, 0]].biome);