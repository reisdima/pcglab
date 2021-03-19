import AssetManager from "./AssetManager.js";
import CenaFase1 from "./CenaFase1.js";
import CenaFase2 from "./CenaFase2.js";
import Mixer from "./Mixer.js";
import InputManager from "./InputManager.js";
import Game from "./Game.js";
import CenaCarregando from "./CenaCarregando.js";
import CenaFim from "./CenaFim.js";
import CenaVitoria from "./CenaVitoria.js";

const input = new InputManager();
const mixer = new Mixer(10);
const assets = new AssetManager(mixer);

assets.carregaImagem("garota", "assets/garota.png");
assets.carregaImagem("esqueleto", "assets/skelly.png");
assets.carregaImagem("orc", "assets/orc.png");
assets.carregaImagem("moeda", "assets/moeda.png");
assets.carregaImagem("porta", "assets/porta.png");
assets.carregaImagem("parede", "assets/parede.png");
assets.carregaImagem("grama", "assets/grama.png");
assets.carregaAudio("moeda", "assets/coin.wav");
assets.carregaAudio("boom", "assets/boom.wav");
assets.carregaAudio("bruh", "assets/bruh.mp3");

const canvas = document.querySelector("canvas");
canvas.width = 16*48;
canvas.height = 12*48;

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
const cena2 = new CenaFase2();
const cenaFim = new CenaFim();
const cenaVitoria = new CenaVitoria();
game.adicionarCena("carregando", cena0);
game.adicionarCena("fase1", cena1);
game.adicionarCena("fase2", cena2);
game.adicionarCena("fim", cenaFim);
game.adicionarCena("win", cenaVitoria);

game.iniciar();

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "i":
            game.iniciar(); 
            break;
        case "p":
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