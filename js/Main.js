import AssetManager from "./AssetManager.js";
import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Mixer from "./Mixer.js";
import Sprite from "./Sprite.js";
import modeloMapa1 from "../maps/mapa1.js";
import modeloMapa2 from "../maps/mapa2.js";
//console.log("Hello World!");

const mixer = new Mixer(10);
const assets = new AssetManager(mixer);

assets.carregaImagem("garota", "assets/garota.png");
assets.carregaImagem("esqueleto", "assets/skelly.png");
assets.carregaImagem("orc", "assets/orc.png");
assets.carregaImagem("parede", "assets/parede.png");
assets.carregaImagem("grama", "assets/grama.png");
assets.carregaAudio("moeda", "assets/coin.wav");
assets.carregaAudio("boom", "assets/boom.wav");
assets.carregaAudio("bruh", "assets/bruh.mp3");

const canvas = document.querySelector("canvas");
canvas.width = 20*32;
canvas.height = 20*32;
console.log(canvas);

const cena1 = new Cena(canvas, assets);

/*const mapa1 = new Mapa(10, 14, 32);
mapa1.carregaMapa(modeloMapa1);
cena1.configuraMapa(mapa1);*/

const mapa2 = new Mapa(10, 14, 32, cena1);
mapa2.carregaMapa(modeloMapa2);
cena1.configuraMapa(mapa2);

/*const pc = new Sprite({x:50, y :150, vx:20, h: 50});
const en1 = new Sprite({x:160, vx: -10, color:"red"});

cena1.adicionar(pc);
cena1.adicionar(en1);
cena1.adicionar(new Sprite({x: 115, y:70, vy:10, color:"red"}));
cena1.adicionar(new Sprite({x: 115, y:160, vy:-10, color:"red"}));*/

// Adiciona sprites mais fortes ("Protagonistas")
cena1.adicionar(new Sprite({x: randValue(43, canvas.width - 43), y: randValue(43, canvas.height - 43), w:20, h:20,
                            vy: randValue(-100, 100), vx: randValue(-100,100), color:"yellow", vida: 1000}));
cena1.adicionar(new Sprite({x: randValue(43, canvas.width - 43), y: randValue(43, canvas.height - 43), w:20, h:20,
                            vy: randValue(-100, 100), vx: randValue(-100,100), color:"#4B0082", vida: 1000}));
cena1.adicionar(new Sprite({x: randValue(43, canvas.width - 43), y: randValue(43, canvas.height - 43), w:20, h:20,
                            vy: randValue(-100, 100), vx: randValue(-100,100), color:"#008B8B", vida: 1000}));
cena1.adicionar(new Sprite({x: randValue(43, canvas.width - 43), y: randValue(43, canvas.height - 43), w:20, h:20,
                            vy: randValue(-100, 100), vx: randValue(-100,100), color:"#00FFFF", vida: 1000}));

// Adiciona sprites "inimigos" a cada 4000 ms (4 segundos)
setInterval(() => {
    cena1.adicionar(new Sprite({x: randValue(43, canvas.width - 43), y: randValue(43, canvas.height - 43),
                                vy: randValue(-100, 100), vx: randValue(-100,100), color:"red"}));
}, 4000);

cena1.iniciar();

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "s":
            cena1.iniciar(); 
            break;
        case "S":
            cena1.parar(); 
            break;
        case "c":
            assets.play("moeda"); 
            break;
        case "b":
            assets.play("boom"); 
            break;
    }
})

function randValue(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
