import Cena from "./Cena.js";
import Sprite from "../../js/Sprite.js";
import Button from "../../js/utils/Button.js";
import getXY from "../../js/utils/getXY.js";
import CheaperFirst from "./heuristicas/CheaperFirst.js";

export default class StartScene extends Cena {
  constructor(canvas = null, assets = null) {
    super(canvas, assets);
  }

  desenhar() {
    super.desenhar();
    this.newGame.draw(this.ctx);
    this.heuristicaCheaperFirst.draw(this.ctx);
  }

  quadro(t) {
    super.quadro(t);
  }

  controle() { }

  quandoColidir(a, b) { }

  preparar() {
    super.preparar();
  }

  createAreas() {
    this.newGame = new Button(
      0.5 * this.canvas.width,
      0.6 * this.canvas.height,
      0.25 * this.canvas.width,
      0.07 * this.canvas.height,
      "New Game"
    );
    this.heuristicaCheaperFirst = new Button(
      0.5 * this.canvas.width,
      0.7 * this.canvas.height,
      0.25 * this.canvas.width,
      0.07 * this.canvas.height,
      "Heurística mais barato"
    );
  }

  preparar() {
    super.preparar();
    this.createAreas();
    this.canvas.onmousedown = (e) => {
      this.mousedown(e);
    };
    this.canvas.onclick = (e) => {
      this.click(e);
    };
  }

  mousedown(e) {
    if (this.assets.progresso() < 100.0 || this.expire > 0) {
      return;
    }
    const [x, y] = getXY(e, this.canvas);
    if (this.newGame.hasPoint({ x, y })) {
      this.game.selecionaCena("cena1");
    }
    if (this.heuristicaCheaperFirst.hasPoint({ x, y })) {
      this.game.adicionarHeuristica(new CheaperFirst())
      this.game.selecionaCena("cena1");
    }
  }
  click(e) {
    this.mousedown(e);
  }

  desenharHud() { }
}
