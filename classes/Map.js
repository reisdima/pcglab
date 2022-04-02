import Cell from "./Cell.js";
import { getMapArea, setMapArea } from "./MAPA_AREA.js";
import { setDebugMode, getDebugMode } from "./DebugMode.js";
import { getPlayer } from "./Player.js";

export default class Map {
  constructor(w, h, s, assetsMng) {
    this.w = w;
    this.h = h;
    this.s = s;
    this.cell = [];
    this.assetsMng = assetsMng;
    for (let l = 0; l < h; l++) {
      this.cell[l] = [];
      for (let c = 0; c < w; c++) {
        //this.cell[l][c] = { tipo: 0, room: -3, distTeleportes: 999, distFirezones: 999,  
        //  distInimigos: 999, distTesouros: 999, linha: l, coluna: c};
        this.cell[l][c] = new Cell({ linha: l, coluna: c });
      }
    }

    // Auxiliares
    this.distComposto = {
      inimigosTesouros: {
        max: 0
      },
      inimigosTeleportes: {
        max: 0
      },
    };
  }

  copyDates(matrix) {           // Copia a matriz de geração procedural que contém apenas o tipo da celula
    //this.cell = JSON.parse(JSON.stringify(matrix)); //Copia matriz
    for (let l = 0; l < this.h; l++) {
      for (let c = 0; c < this.w; c++) {
        this.cell[l][c].tipo = matrix[l][c];
      }
    }
  }

  /**
   * Return a text with type of each cells on the map
   */
  getMatrixType() {
    let text = "map[ " + this.h + " ][ " + this.w + " ] = {\n";
    for (let i = 0; i < this.h; i++) {
      text += "[";
      for (let j = 0; j < this.w; j++) {
        text += this.cell[i][j].tipo + ", ";
      }
      text += "]\n";
    }
    text += "\n}\n";
    return text;
  }

  /*copyDataInto (matrix, L, C) {
    //console.log(matrix);
    //if(!this.cell) this.cell = [];
    for (var l = 0; l < matrix.length - 1; l++) {
      //this.cell[l] = [];
      for (var c = 0; c < matrix[0].length - 1; c++) {
        this.cell[l + L][c + C].tipo = matrix[l][c];
      }
    }
  }*/

  initMap(L, C, v) {
    let mapx = [];
    for (let l = 0; l < L; l++) {
      mapx[l] = [];
      for (let c = 0; c < C; c++) {
        mapx[l][c] = v;
      }
    }
    return mapx;
  }

  findCellByDistAndType(value, type, row, column) {
    if (row != null && column != null) {              // Começar a analisar de uma posição específica
      for (let l = row; l < this.h; l++) {
        for (let c = column; c < this.w; c++) {
          if (this.cell[l][c].tipo == type) {
            if (this.cell[l][c].dist >= value) {
              return this.cell[l][c];
            }
          }
        }
      }
    }
    else {
      for (let l = 0; l < this.h; l++) {
        for (let c = 0; c < this.w; c++) {
          if (this.cell[l][c].tipo == type) {
            if (this.cell[l][c].dist >= value) {
              return this.cell[l][c];
            }
          }
        }
      }
    }
    return null;                // Não encontrou nenhuma celula com a caracteristica
  }

  getCell(row, column) {
    return this.cell[row][column];
  }

  // Caminha na matriz e encontra as salas que cada célula pertence
  mapearSalas() {
    let auxMatrix = this.initMap(this.h, this.w, -1);
    let auxMatrixVisited = [];
    let room = 0;
    let roomFloors = 0;
    let caveArea = 0;
    let floorIndex = 0;
    for (let i = 0; i < this.h; i++) {
      auxMatrixVisited[i] = [];
      for (let j = 0; j < this.w; j++) {
        auxMatrixVisited[i][j] = false;
        if (this.cell[i][j].tipo !== floorIndex) {
          auxMatrix[i][j] = -2;   //Cave area
          caveArea++;
        }
        else {
          auxMatrix[i][j] = -1;   //rooms area
          roomFloors++;
        }
      }
    }

    for (let i = 0; i < this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        if (auxMatrix[i][j] === -1) {
          room++;
          this.visitCells(auxMatrix, this.cell, i, j, floorIndex, 1, room);
        }
      }
    }

    for (let i = 0; i < this.h; i++) {            //Ajusta os indices das salas de cada celula
      for (let j = 0; j < this.w; j++) {
        this.cell[i][j].room = auxMatrix[i][j];
      }
    }
  }

  visitCells(auxMatrix, mapx, y, x, tp, d = 1, indexArea) {   //visita as celulas visinhas de maneira recursiva e atribui o código da sala correspondente 
    /**********************************************
     * 
     * Algoritmo Flood fill:
     * https://en.wikipedia.org/wiki/Flood_fill
     * 
    ***********************************************/

    if (auxMatrix[y][x] === indexArea) {  //Célula com a "cor" ou "indice da sala" correspondente ao indexArea
      return;
    }
    if (auxMatrix[y][x] === -1) {         //Não mapeado ainda
      auxMatrix[y][x] = indexArea;        //Set cell is visited
    }
    else {                                //Ou foi mapeado ou a celula é Wall/Rock
      return;
    }
    if (y - 1 >= 0) {
      this.visitCells(auxMatrix, mapx, y - 1, x, tp, d, indexArea);
    }
    if (y + 1 < this.h) {
      this.visitCells(auxMatrix, mapx, y + 1, x, tp, d, indexArea);
    }
    if (x - 1 >= 0) {
      this.visitCells(auxMatrix, mapx, y, x - 1, tp, d, indexArea);
    }
    if (x + 1 < this.w) {
      this.visitCells(auxMatrix, mapx, y, x + 1, tp, d, indexArea);
    }
  }

  // Teste função retorna distancia de composição entre os dois atributos
  getDistInimigosTesouros(l, c) {
    return (3 * this.cell[l][c].distInimigos + 2 * this.cell[l][c].distTesouros);
  }

  // Teste função retorna distancia de composição entre os dois atributos -- MAX
  distMaxInimigosTesouros(l, c) {
    for (let l = 0; l < this.h; l++) {
      for (let c = 0; c < this.w; c++) {
        if (this.cell[l][c].tipo === 0) {         // Não considera a parede e a rocha da caverna
          let aux = this.getDistInimigosTesouros(l, c);
          if (aux > this.distComposto.inimigosTesouros.max) {
            this.distComposto.inimigosTesouros.max = aux;
          }
        }
      }
    }
  }

  camadaDistCompostas() {
    if (this.distComposto.inimigosTesouros.max === 0) {
      this.distMaxInimigosTesouros();

      // Inimigo + Teleporte
      for (let l = 0; l < this.h; l++) {
        for (let c = 0; c < this.w; c++) {
          if (this.cell[l][c].tipo === 0) {         // Não considera a parede e a rocha da caverna
            if (this.cell[l][c].distInimigoTeleporte() > this.distComposto.inimigosTeleportes.max) {
              this.distComposto.inimigosTeleportes.max = this.cell[l][c].distInimigoTeleporte();
            }
          }
        }
      }
    }
  }



  /************************************************
   *                                              *
   *          Funções de Desenho                  *
   *                                              *
   ************************************************/


  desenhar(ctx, player) {
    ctx.lineWidth = 2;
    for (let l = Math.max(0, player.gy - getMapArea()); l < Math.min(this.h, player.gy + getMapArea()); l++) {
      for (let c = Math.max(0, player.gx - getMapArea()); c < Math.min(this.w, player.gx + getMapArea()); c++) {
        switch (this.cell[l][c].tipo) {
          case 0:   // Vazio     -- Chão
            this.assetsMng.drawSize({
              ctx: ctx, key: "floor_sand", x: (c * this.s),
              y: (l * this.s), w: this.s, h: this.s
            });
            break;
          case 1:   // Bloqueado -- Muro
            this.assetsMng.drawSize({
              ctx: ctx, key: "brick_gray", x: (c * this.s),
              y: (l * this.s), w: this.s, h: this.s
            });
            break;
          case 2:   // Caverna
            this.assetsMng.drawClipSize({
              ctx: ctx, key: "rockBlock", sx: 0, sy: 0, w: 32, h: 32,
              dx: (c * this.s), dy: (l * this.s), dw: this.s, dh: this.s
            });
            break;
          default:
            console.log("Wrong index map element");
            break;
        }

        /*if (getDebugMode() >= 5 || (getDebugMode() <= 2 && getDebugMode() > 0)) {//if (getDebugMode() === 3) {
          this.desenharCell(ctx, l, c);         //Debug mode Grid
        }*/
      }
    }
  }

  desenharDebugMode(ctx) {
    const player = getPlayer();
    if (getDebugMode() >= 5 || (getDebugMode() <= 2 && getDebugMode() > 0)) {
      for (let l = Math.max(0, player.gy - getMapArea()); l < Math.min(this.h, player.gy + getMapArea()); l++) {
        for (let c = Math.max(0, player.gx - getMapArea()); c < Math.min(this.w, player.gx + getMapArea()); c++) {
          this.desenharCell(ctx, l, c);         //Debug mode Grid
        }
      }
    }
  }

  desenharCentro(ctx, l, c) {
    ctx.fillStyle = "red";
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1;
    ctx.fillRect(c * this.s, l * this.s, this.s, this.s);
    ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
  }

  desenharCell(ctx, l, c) {
    if (this.cell[l][c].tipo != 0) {    // Não coloca as distancias nas cavernas
      ctx.fillStyle = "yellow";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.font = "10px Arial Black";

      switch (getDebugMode()) {
        case 1:                   // Tipos
          this.escreveTexto(ctx, this.cell[l][c].tipo + "", c * this.s + this.s / 2, l * this.s + this.s / 2);
          break;
        case 2:                   // Rooms
          this.escreveTexto(ctx, this.cell[l][c].room + "", c * this.s + this.s / 2, l * this.s + this.s / 2);
          break;
      }
    }
    else {
      ctx.fillStyle = "yellow";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.font = "10px Arial Black";

      switch (getDebugMode()) {
        case 1:                   // Tipos
          this.escreveTexto(ctx, this.cell[l][c].tipo + "", c * this.s + this.s / 2, l * this.s + this.s / 2);
          break;
        case 2:                   // Rooms
          this.escreveTexto(ctx, this.cell[l][c].room + "", c * this.s + this.s / 2, l * this.s + this.s / 2);
          break;
        /*case 5:                   // Teleportes
          this.escreveTexto(ctx, this.cell[l][c].distTeleportes + "", c * this.s + this.s / 2, l * this.s + this.s / 2);
          break;
        case 6:                   // Firezones
          this.escreveTexto(ctx, this.cell[l][c].distFirezones + "", c * this.s + this.s / 2, l * this.s + this.s / 2);
          break;
        case 7:                   // Inimigos
          this.escreveTexto(ctx, this.cell[l][c].distInimigos + "", c * this.s + this.s / 2, l * this.s + this.s / 2);
          break;
        case 8:                   // Tesouros
          this.escreveTexto(ctx, this.cell[l][c].distTesouros + "", c * this.s + this.s / 2, l * this.s + this.s / 2);
          break;*/
        /*case 9:                   // distInimigosTesouros
          let aux = this.getDistInimigosTesouros(l, c);
          ctx.save();
          ctx.fillStyle = `hsl(${120 * aux/this.distComposto.inimigosTesouros.max}, 100%, 50%)`;
          ctx.linewidth = 1;
          ctx.globalAlpha = 0.4;
          //ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
          ctx.fillRect(c * this.s, l * this.s, this.s, this.s);
          //ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
          ctx.restore();
          ctx.fillStyle = "yellow";
          ctx.strokeStyle = "black";
          this.escreveTexto(ctx, this.getDistInimigosTesouros(l, c) + "", c * this.s + this.s / 2, l * this.s + this.s / 2);
          break;
        case 10:                   // distInimigosTeleportes
        {
          ctx.save();
          ctx.fillStyle = `hsl(${280 *  this.cell[l][c].distInimigoTeleporte()/this.distComposto.inimigosTeleportes.max}, 100%, 50%)`;
          ctx.linewidth = 1;
          ctx.globalAlpha = 0.3;
          //ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
          ctx.fillRect(c * this.s, l * this.s, this.s, this.s);
          //ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
          ctx.restore();
          ctx.fillStyle = "yellow";
          ctx.strokeStyle = "black";
          this.escreveTexto(ctx, this.cell[l][c].distInimigoTeleporte(), c * this.s + this.s / 2, l * this.s + this.s / 2);
          break;
        }*/
      }

    }

    if (getDebugMode() < 16) {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
    }
  };

  escreveTexto(ctx, texto, x, y) {
    ctx.strokeText(texto, x, y);
    ctx.fillText(texto, x, y);
  }

  // Matriz de distancias: Calcula a distancia em relação a uma linha, coluna e valor inicial
  atualizaDist(l, c, v, method) {
    let aavaliar = [{ l, c, v }];
    let cell;

    switch (method) {
      case 0:                                 // Teleportes
        while (cell = aavaliar.pop()) {
          if (cell.l < 0 || cell.l >= this.h || cell.c < 0 || cell.c >= this.w) {
            continue;
          }
          if (this.cell[cell.l][cell.c].tipo != 0) {
            continue;
          }
          if (this.cell[cell.l][cell.c].distTeleportes <= cell.v) {
            continue;
          }
          this.cell[cell.l][cell.c].distTeleportes = cell.v;
          aavaliar.push({ l: cell.l - 1, c: cell.c, v: cell.v + 1 });
          aavaliar.push({ l: cell.l + 1, c: cell.c, v: cell.v + 1 });
          aavaliar.push({ l: cell.l, c: cell.c - 1, v: cell.v + 1 });
          aavaliar.push({ l: cell.l, c: cell.c + 1, v: cell.v + 1 });
        }
        break;
      case 1:         // Firezones
        while (cell = aavaliar.pop()) {
          if (cell.l < 0 || cell.l >= this.h || cell.c < 0 || cell.c >= this.w) {
            continue;
          }

          if (this.cell[cell.l][cell.c].tipo != 0) {
            continue;
          }
          if (this.cell[cell.l][cell.c].distFirezones <= cell.v) {
            continue;
          }
          this.cell[cell.l][cell.c].distFirezones = cell.v;
          aavaliar.push({ l: cell.l - 1, c: cell.c, v: cell.v + 1 });
          aavaliar.push({ l: cell.l + 1, c: cell.c, v: cell.v + 1 });
          aavaliar.push({ l: cell.l, c: cell.c - 1, v: cell.v + 1 });
          aavaliar.push({ l: cell.l, c: cell.c + 1, v: cell.v + 1 });
        }
        break;
      case 2:         // Inimigos
        while (cell = aavaliar.pop()) {
          if (cell.l < 0 || cell.l >= this.h || cell.c < 0 || cell.c >= this.w) {
            continue;
          }
          if (this.cell[cell.l][cell.c].tipo != 0) {
            continue;
          }
          if (this.cell[cell.l][cell.c].distInimigos <= cell.v) {
            continue;
          }
          this.cell[cell.l][cell.c].distInimigos = cell.v;
          aavaliar.push({ l: cell.l - 1, c: cell.c, v: cell.v + 1 });
          aavaliar.push({ l: cell.l + 1, c: cell.c, v: cell.v + 1 });
          aavaliar.push({ l: cell.l, c: cell.c - 1, v: cell.v + 1 });
          aavaliar.push({ l: cell.l, c: cell.c + 1, v: cell.v + 1 });
        }
        break;
      case 3:         // Tesouros
        while (cell = aavaliar.pop()) {
          if (cell.l < 0 || cell.l >= this.h || cell.c < 0 || cell.c >= this.w) {
            continue;
          }
          if (this.cell[cell.l][cell.c].tipo != 0) {
            continue;
          }
          if (this.cell[cell.l][cell.c].distTesouros <= cell.v) {
            continue;
          }
          this.cell[cell.l][cell.c].distTesouros = cell.v;
          aavaliar.push({ l: cell.l - 1, c: cell.c, v: cell.v + 1 });
          aavaliar.push({ l: cell.l + 1, c: cell.c, v: cell.v + 1 });
          aavaliar.push({ l: cell.l, c: cell.c - 1, v: cell.v + 1 });
          aavaliar.push({ l: cell.l, c: cell.c + 1, v: cell.v + 1 });
        }
        break;
    }
  }
}