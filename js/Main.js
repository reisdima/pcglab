import AssetManager from "./AssetManager.js";
import CenaFase1 from "./CenaFase1.js";
import Mixer from "./Mixer.js";
import InputManager from "./InputManager.js";
import Game from "./Game.js";
import CenaCarregando from "./CenaCarregando.js";
import CenaFim from "./CenaFim.js";

const input = new InputManager();
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
canvas.width = 16*32;
canvas.height = 12*32;

input.configurarTeclado({
    ArrowLeft: "MOVE_ESQUERDA",
    ArrowRight: "MOVE_DIREITA",
    ArrowUp: "MOVE_CIMA",
    ArrowDown: "MOVE_BAIXO",
    " ": "PROXIMA_CENA",
});

const game = new Game(canvas, assets, input);

const cena0 = new CenaCarregando();
const cena1 = new CenaFase1();
const cena2 = new CenaFim();
game.adicionarCena("carregando", cena0);
game.adicionarCena("jogo", cena1);
game.adicionarCena("fim", cena2);

/*const mapa2 = new Mapa(10, 14, 32, cena1);
mapa2.carregaMapa(modeloMapa2);
cena1.configuraMapa(mapa2);*/

// Adiciona sprites mais fortes ("Protagonistas")
/*cena1.adicionar(new Sprite({x: randValue(43, canvas.width - 43), y: randValue(43, canvas.height - 43), w:20, h:20,
                            vy: randValue(-200, 200), vx: randValue(-200,200), color:"yellow", vida: 1000}));
cena1.adicionar(new Sprite({x: randValue(43, canvas.width - 43), y: randValue(43, canvas.height - 43), w:20, h:20,
                            vy: randValue(-200, 200), vx: randValue(-200,200), color:"#BA55D3", vida: 1000}));
cena1.adicionar(new Sprite({x: randValue(43, canvas.width - 43), y: randValue(43, canvas.height - 43), w:20, h:20,
                            vy: randValue(-200, 200), vx: randValue(-200,200), color:"white", vida: 1000}));
cena1.adicionar(new Sprite({x: randValue(43, canvas.width - 43), y: randValue(43, canvas.height - 43), w:20, h:20,
                            vy: randValue(-200, 200), vx: randValue(-200,200), color:"#00FFFF", vida: 1000}));

// Adiciona sprites "inimigos" a cada 4000 ms (4 segundos)
setInterval(() => {
    cena1.adicionar(new Sprite({x: randValue(43, canvas.width - 43), y: randValue(43, canvas.height - 43),
                                vy: randValue(-100, 100), vx: randValue(-100,100), color:"red"}));
}, 4000);
*/

game.iniciar();

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "s":
            game.iniciar(); 
            break;
        case "S":
            game.parar(); 
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
