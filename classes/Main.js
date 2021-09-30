import AssetsManager from "./AssetsManager.js";
// import Mixer from "./Mixer.js";
import InputManager from "./InputManager.js";
import Game from "./Game.js";
import CenaJogo from './Cenas/CenaJogo.js'
import CenaMenu from './Cenas/CenaMenu.js'

const input = new InputManager();
// const mixer = new Mixer(10);
const assets = new AssetsManager();

// assets.loadImage("parede", "assets/parede.png"); //64x64
// assets.loadImage("grama", "assets/grama.png"); //64x64
// assets.loadImage("rocha", "assets/rochaNegra.png"); //64x64
// assets.loadImage("moeda", "assets/moeda.png"); // 32x32
// assets.loadImage("setaL", "assets/setaL.png"); // 512x512
// assets.loadImage("setaO", "assets/setaO.png"); // 512x512
// assets.loadImage("setaN", "assets/setaN.png"); // 512x512
// assets.loadImage("setaS", "assets/setaS.png"); // 512x512

const canvas = document.getElementById("canvas");
    
// Ocupa a janela toda
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
canvas.widthOld = 600;
canvas.heightOld = 350;

input.configurarTeclado({
    ArrowLeft: "MOVE_ESQUERDA",
    ArrowRight: "MOVE_DIREITA",
    ArrowUp: "MOVE_CIMA",
    ArrowDown: "MOVE_BAIXO",
    " ": "ALTERNAR_EXIBICAO",
    h: "MOSTRA_HITBOX",
    t: "CENA_CAMINHO_SPRITE",
    r: "CENA_CAMINHO_GRID",
    d: "VER_DISTANCIAS",
    m: "MENU",
    s: "VER_MATRIZ",
    a: "ATIVAR_LAYER",
    n: "MOSTRAR_CAMINHO",
    Enter: "ENTER"
});

const game = new Game(canvas, assets, input);

const cenaMenu = new CenaMenu(canvas);
const cenaJogo = new CenaJogo(canvas);
game.adicionarCena("menu", cenaMenu);
game.adicionarCena("jogo", cenaJogo);

game.iniciar();

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "i":
            game.iniciar(); 
            break;
        case "p":
            game.parar(); 
            break;
    }
})