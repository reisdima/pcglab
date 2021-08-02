var tilesets = {
salas: function(tool){

tool.addTile(`\
22222
22222
22222
22222
22222`,{weight:3})

tool.addTile(`\
00000
00000
00000
00000
00000`,{weight:1})

tool.addTile(`\
00012
00012
00012
00012
00012`)

tool.addTile(`\
22222
11112
00012
00012
00012`)

tool.addTile(`\
21000
21000
11000
00000
00000`)

tool.addColor("0", [244,164,96])
tool.addColor("1", [0,0,0])
tool.addColor("2", [139,69,19])
},


labirinto: function(tool){

tool.addTile(`\
22222
22222
22222
22222
22222`,{weight:3})

tool.addTile(`\
21012
21012
21012
21012
21012`)

tool.addTile(`\
22222
11111
00000
11111
22222`)

tool.addTile(`\
21012
11011
00000
11011
21012`)

tool.addTile(`\
21012
21011
21000
21111
22222`)

tool.addColor("0", [244,164,96])
tool.addColor("1", [0,0,0])
tool.addColor("2", [139,69,19])
},


corredores: function(tool){

tool.addTile(`\
22222
22222
22222
22222
22222`,{weight:3})

tool.addTile(`\
22222
21112
21012
21012
21012`)

tool.addTile(`\
22222
21111
21000
21011
21012`)

tool.addColor("0", [244,164,96])
tool.addColor("1", [0,0,0])
tool.addColor("2", [139,69,19])
},

salasConectadas: function(tool){

tool.addTile(`\
22222
22222
22222
22222
22222`,{weight:3})

tool.addTile(`\
00000
00000
00000
00000
00000`,{weight:1})

tool.addTile(`\
00012
00012
00012
00012
00012`)

tool.addTile(`\
22222
11112
00012
00012
00012`)

tool.addTile(`\
21000
21000
11000
00000
00000`)


tool.addTile(`\
21012
11012
00012
00012
00012`)

tool.addTile(`\
21012
21012
21012
21012
21012`)

tool.addColor("0", [244,164,96])
tool.addColor("1", [0,0,0])
tool.addColor("2", [139,69,19])
},

}


function generateWFC(metode) {

  var tool = new ferramentaWfc();
  tilesets[metode](tool);
  var tamanho = 24
  wfcInput = tool.generateWFCInput();
  wfc = new WFC(wfcInput);
  wfc.step();
  wfc.expand([0,0],[tamanho,tamanho])
  var tentativas = 0;
  console.log("start");
  while(!wfc.step()){
    tentativas++;
    //console.log("creating");
    if(tentativas>100000){
      console.log("fail");
      break;
    }
  };

  wfc.onda = wfc.getOnda();
  tool.tiles = tool.getTiles();

  var arrayform = [];

  for(var i = 0; i<tamanho;i++){

    for(var k = 0; k<tool.tiles[0].length; k++){
      arrayform.push([]);
    }
    for(var j = 0; j<tamanho;j++){
      var tile = wfc.onda[i+","+j];
      for(var k = 0; k<tool.tiles[0].length; k++){
        for(var l = 0; l<tool.tiles[0].length; l++){
          arrayform[(5*i)+k].push(parseInt(tool.tiles[tile][k][l]));
        }
      }
    }
  }
  return arrayform;
}

function drawTile(tile){


}



//console.log(arrayform);
