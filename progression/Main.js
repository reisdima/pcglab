import AssetManager from "../js/AssetManager.js";
import CenaFase1 from "../js/CenaFase1.js";
import Mixer from "../js/Mixer.js";
import InputManager from "../js/InputManager.js";
import Game from "../js/Game.js";
import CenaInicio from "../js/CenaInicio.js";
import CenaMapaGrid from "../js/CenaMapaGrid.js";
import Cena1 from "./numbersGetBigger/Cena1.js";

const input = new InputManager();
const mixer = new Mixer(10);
const assets = new AssetManager(mixer);

const canvas = document.querySelector("canvas");
canvas.width = 12 * 60;
canvas.height = 8 * 48;

input.configurarTeclado({
  ArrowLeft: "MOVE_ESQUERDA",
  ArrowRight: "MOVE_DIREITA",
  ArrowUp: "MOVE_CIMA",
  ArrowDown: "MOVE_BAIXO",
  h: "MOSTRA_HITBOX",
  t: "CENA_CAMINHO_SPRITE",
  r: "CENA_CAMINHO_GRID",
  d: "VER_DISTANCIAS",
  m: "MENU",
  s: "VER_MATRIZ",
  a: "ATIVAR_LAYER",
  n: "MOSTRAR_CAMINHO",
  " ": "MAKE_POINT",
  1: "A",
  2: "B",
  3: "C",
});

const game = new Game(canvas, assets, input);

// const cena1 = new CenaFase1();
// const cena2 = new CenaMapaGrid();
// const cenaInicio = new CenaInicio();
// game.adicionarCena("inicio", cenaInicio);
// game.adicionarCena("fase1", cena1);
// game.adicionarCena("fase2", cena2);

const cena1 = new Cena1();
game.adicionarCena("cena1", cena1);

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
});
