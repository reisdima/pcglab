import Room from "./Room.js";

export default function GeracaoWFC(params = {}){
    let estruturaPadrao = {
        HS: 0,
        WS: 0,
        MOORE: 1,
        r: 0.5,
        totalRock: 5,
        floorIndex: 0,
        rockIndex: 1,
        wallIndex: 2,
        map: null,
        map2: null,
        rooms: [],
        seedGen: null
    }

    Object.assign(this, estruturaPadrao, params);

    this.map = this.initMap(this.HS, this.WS, this.floorIndex);
    this.map2 = this.initMap(this.HS, this.WS, this.floorIndex);
}
//GeracaoWFC.prototype = new CellularAutomata();
GeracaoWFC.prototype.constructor = GeracaoWFC;

/**
 * GX => COLUNA
 * GY => LINHA
 */

GeracaoWFC.prototype.countRooms = function(){
    this.rooms = [];
    let auxMatrix = this.initMap(this.HS, this.WS, -1);
    let auxMatrixVisited = [];
    let room = 0;
    let roomFloors = 0;
    let caveArea = 0;

    for(let i = 0; i < this.HS; i++){
        auxMatrixVisited[i] = [];
        for(let j = 0; j < this.WS; j++){
            auxMatrixVisited[i][j] = false;
            if(this.map[i][j] != this.floorIndex){
                auxMatrix[i][j] = -2;   //Cave area
                caveArea++;
            }
            else{
                auxMatrix[i][j] = -1;   //rooms area
                roomFloors++;
            }
        }
    }

    //debugger;
    for(let i = 0; i < this.HS; i++){
        for(let j = 0; j < this.WS; j++){
            if(auxMatrix[i][j] === -1){
                room++;
                this.visitCells(auxMatrix, this.map, i, j, this.floorIndex, 1, room);
            }
        }
    }

    for(let i = 0; i < room; i++){                  //Cria o numero de salas correspondentes
        let aux = new Room(i+1);
        this.rooms.push(aux);
    }

    for(let i = 0; i < this.HS; i++){               //Incrementa os contadores
        for(let j = 0; j < this.WS; j++){
            if(auxMatrix[i][j] > 0){
                this.rooms[auxMatrix[i][j] - 1].addBlock(i, j);
            }
        }
    }

    console.log("Number of rooms: " + this.rooms.length);
    console.log("Number of roomFloors: " + roomFloors);
    console.log("Number of caveArea: " + caveArea);
    console.log("Total blocks: " + this.HS * this.WS);

}

/**
 * Remove as salas de tamanho menor que um valor determinado e aplica um automato para corrigir o mapa
 */

GeracaoWFC.prototype.filterRooms = function(sizeRoomsMinimal = 10){
    let count = 0;
    while(true){
        count = 0;
        for(let i = 0; i < this.rooms.length; i++){
            if(this.rooms[i].blocks.length <= sizeRoomsMinimal){    //Remove as salas de tamanhos menores que a variavel
                for(let k = 0; k < this.rooms[i].blocks.length; k++){
                    this.map2[this.rooms[i].blocks[k][0]][this.rooms[i].blocks[k][1]] = this.rockIndex;  //Atribui como rock
                }
                count++;
                this.rooms.splice(i, 1);
            }
        }
        //console.log("rooms after removing: " + this.rooms.length);
        this.toggleMaps();
        if(count === 0){
            break;
        }
    }
    for(let i = 0; i < this.rooms.length; i++){                         //Reorder the numbers of the rooms
        this.rooms[i].number = i + 1;                                   //Initiate with number 1
    }

    this.toggleMaps();
    this.countRooms();
}

GeracaoWFC.prototype.getRandomInt = function(min, max){
    return this.seedGen.getRandomIntMethod_1(min, max);
}

GeracaoWFC.prototype.visitCells = function(auxMatrix, mapx, y, x, tp, d = 1, indexArea){   //visita as celulas visinhas de maneira recursiva e atribui o código da sala correspondente
    /*********************************************
     *
     * Algoritmo Flood fill:
     * https://en.wikipedia.org/wiki/Flood_fill
     *
    ***********************************************/

    if(auxMatrix[y][x] === indexArea){  //Célula com a "cor" ou "indice da sala" correspondente ao indexArea
        return;
    }
    if(auxMatrix[y][x] === -1){         //Não mapeado ainda
        auxMatrix[y][x] = indexArea;    //Set cell is visited
    }
    else{                               //Ou foi mapeado ou a celula é Wall/Rock
        return;
    }
    if(y - 1 >= 0){
        this.visitCells(auxMatrix, mapx, y - 1, x, tp, d, indexArea);
    }
    if(y + 1 < this.HS){
        this.visitCells(auxMatrix, mapx, y + 1, x, tp, d, indexArea);
    }
    if(x - 1 >= 0){
        this.visitCells(auxMatrix, mapx, y, x - 1, tp, d, indexArea);
    }
    if(x + 1 < this.WS){
        this.visitCells(auxMatrix, mapx, y, x + 1, tp, d, indexArea);
    }
}

GeracaoWFC.prototype.toggleMaps = function(){
    this.map = JSON.parse(JSON.stringify(this.map2));   //Copia matriz
}

GeracaoWFC.prototype.toggleRooms = function(rooms){
    rooms = JSON.parse(JSON.stringify(this.rooms));  //Copia matriz
}

GeracaoWFC.prototype.initMap = function(L, C, v) {
    let mapx = [];
    for (let l = 0; l < L; l++) {
        mapx[l] = [];
        for (let c = 0; c < C; c++) {
            mapx[l][c] = v;
        }
    }
    return mapx;
}

/**
 * Condição inicial do artigo: Randomiza walls em volta do mapa
 * e depois aplica os automatos
 */

GeracaoWFC.prototype.start = function (wfc){
    this.map = wfc;
    this.map2 = wfc;
}
