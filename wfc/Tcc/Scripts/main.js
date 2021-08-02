
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


var worker;
var canvas;
var scene;
var camera;
var renderer;
var root;

function wfcDemo(tilesetName){

  if (worker){
    worker.terminate();
  }

  var tool = new ferramentaWfc();

  tilesets[tilesetName](tool);

  var viewport;
  var wave;

  var workerCode = function(){
    var viewport;
    var wfc;
    var aspectRatio;
    var size;
    var increment;
    var multiply;

    console.log("connect")

    onmessage = function(e) {
      console.log(e)
      if (e.data.op == "init"){
        wfc = new WFC(e.data.wfcInput);
        aspectRatio = e.data.aspectRatio;
        size = e.data.initialSize;
        increment = e.data.increment;
        multiply = e.data.multiply
        main();
      }
    }

    function main(){
      setTimeout(main,1);
      if (!wfc){
        return
      }
      if (wfc.step()){
        viewport = {x:-size,y:-Math.round(size*aspectRatio),w:size*2,h:Math.round(size*2*aspectRatio)}
        wfc.expand([viewport.y,viewport.x],[viewport.y+viewport.h,viewport.x+viewport.w]);
        size=Math.ceil((size+increment)*multiply);
      }
      postMessage({viewport,wave:wfc.readout(/*false*/)})
    }
  }

  console.log(tool.getTileFormulae())

  worker =new Worker(URL.createObjectURL(new Blob(["var WFC="+WFC.toString()+';('+workerCode.toString()+')()'])));// new Worker('worker.js');

  worker.postMessage({
    op:'init',
    wfcInput:tool.generateWFCInput(),
    aspectRatio:window.innerHeight/window.innerWidth,
    initialSize:10,
    increment:0,
    multiply:1.2,
  })

  worker.onmessage = function(e){
    viewport = e.data.viewport;
    wave = e.data.wave;
  }

  if (renderer){
    renderer.domElement.style.display="none";
  }

  if (!canvas){
    canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "absolute";
    canvas.style.left = "0px";
    canvas.style.top = "0px";
    document.body.appendChild(canvas);
  }else{
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }

  canvas.style.display="block";

  function main(){
    requestAnimationFrame(main)
    // tool.clearPlotCache();
    if (viewport && wave){
      tool.plotWFCOutput(canvas,viewport,wave)
    }
  }
  main();
}


var menubar = document.createElement("div");
var title = document.createElement("span"); menubar.appendChild(title);
title.innerHTML = "<b>WFC:</b> <i>Wave Function Collapse testing</i>"
title.style.display="inline-block";
title.style.marginTop="4px";
menubar.style.zIndex="1000"
menubar.style.position="absolute";
menubar.style.left="0px";
menubar.style.top="0px";
menubar.style.background="rgba(0,0,0,0.6)"
menubar.style.color="white";
menubar.style.padding="10px"
menubar.style.fontFamily="sans-serif";
menubar.style.width=window.innerWidth+"px";
menubar.style.fontSize="20px"

var selbox = document.createElement("span"); menubar.appendChild(selbox);
selbox.innerHTML = "Tileset = "
selbox.style.marginRight="30px";
selbox.style.float="right";
// selbox.style.border="1px solid rgba(255,255,255,0.8)";
selbox.style.padding="5px";
selbox.style.fontSize="16px"

var select = document.createElement("select");
for (var k in tilesets){
  var option = document.createElement("option");
  option.value = k;
  option.innerHTML = k;
  select.appendChild(option);
}

select.style.background="rgba(0,0,0,0)";
select.style.color="white"
select.style.fontSize="16px"
select.onchange = function(){
	wfcDemo(select.value);
}

selbox.appendChild(select);


document.body.appendChild(menubar)

select.value="salas"
wfcDemo('salas');
