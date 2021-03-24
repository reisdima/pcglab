import AssetManager from "./AssetManager.js";
import CenaFase1 from "./CenaFase1.js";
import CenaFase2 from "./CenaFase2.js";
import Mixer from "./Mixer.js";
import InputManager from "./InputManager.js";
import Game from "./Game.js";
import CenaCarregando from "./CenaCarregando.js";
import CenaFim from "./CenaFim.js";
import CenaVitoria from "./CenaVitoria.js";
import CenaTutorial from "./CenaTutorial.js";

const input = new InputManager();
const mixer = new Mixer(10);
const assets = new AssetManager(mixer);

assets.carregaImagem("skelly", "assets/skelly2.png"); // 32x50
assets.carregaImagem("guerreiro", "assets/guerreiro.png"); // 30x54
assets.carregaImagem("moeda", "assets/moeda.png"); // 32x32
assets.carregaImagem("alavanca", "assets/alavanca.png"); // 32x32
assets.carregaImagem("porta", "assets/porta.png"); // 32x48
assets.carregaImagem("ghost", "assets/ghost.png"); // 64x64
assets.carregaImagem("parede", "assets/parede.png"); //64x64
assets.carregaImagem("grama", "assets/grama.png"); //64x64
assets.carregaImagem("rocha", "assets/rochaNegra.png"); //64x64
assets.carregaImagem("background", "assets/background.png"); //816x624
assets.carregaImagem("escudo", "assets/escudo.png"); //32x32

assets.carregaAudio("moeda2", "assets/coin2.wav");
assets.carregaAudio("porta", "assets/porta.wav");
assets.carregaAudio("click", "assets/click.wav");
assets.carregaAudio("ossos", "assets/ossos.wav");
assets.carregaAudio("conquista", "assets/conquista.wav");
assets.carregaAudio("hurt", "assets/hurt.mp3");
assets.carregaAudio("bruh", "assets/bruh.mp3");

const canvas = document.querySelector("canvas");
canvas.width = 17*48;
canvas.height = 13*48;

input.configurarTeclado({
    ArrowLeft: "MOVE_ESQUERDA",
    ArrowRight: "MOVE_DIREITA",
    ArrowUp: "MOVE_CIMA",
    ArrowDown: "MOVE_BAIXO",
    " ": "PROXIMA_CENA",
    h: "MOSTRA_HITBOX",
    t: "CENA_TUTORIAL"
});

const game = new Game(canvas, assets, input);

const cena0 = new CenaCarregando();
const cena1 = new CenaFase1();
const cena2 = new CenaFase2();
const cenaFim = new CenaFim();
const cenaVitoria = new CenaVitoria();
const cenaTutorial = new CenaTutorial();
game.adicionarCena("carregando", cena0);
game.adicionarCena("fase1", cena1);
game.adicionarCena("fase2", cena2);
game.adicionarCena("fim", cenaFim);
game.adicionarCena("win", cenaVitoria);
game.adicionarCena("tutorial", cenaTutorial);

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