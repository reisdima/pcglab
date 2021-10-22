import Cena from "./Cena.js";
import Sprite from "../../js/Sprite.js";
import Button from "../../js/utils/Button.js";
import getXY from "../../js/utils/getXY.js";
import MaisBarato from "./heuristicas/MaisBarato.js";
import CustoBeneficio from "./heuristicas/CustoBeneficio.js";

export default class CenaInicial extends Cena {
  constructor(canvas = null, assets = null) {
    super(canvas, assets);
  }

  desenhar() {
    super.desenhar();
  }

  quadro(t) {
    super.quadro(t);
  }

  controle() { }

  quandoColidir(a, b) { }

  preparar() {
    super.preparar();
    this.createAreas();
    this.canvas.onmousedown = (e) => {
      this.mousedown(e);
    };
    this.canvas.onmousemove = (e) => {
      this.mousemove(e);
    };
    this.canvas.onclick = (e) => {
      this.click(e);
    };
  }

  createAreas() {
    this.newGame = this.adicionarBotao(new Button(
      0.5 * this.canvas.width,
      0.6 * this.canvas.height,
      0.25 * this.canvas.width,
      0.07 * this.canvas.height,
      "New Game"
    ));
    this.heuristicaCheaperFirst = this.adicionarBotao(new Button(
      0.5 * this.canvas.width,
      0.7 * this.canvas.height,
      0.25 * this.canvas.width,
      0.07 * this.canvas.height,
      "Heurística mais barato"
    ));
    this.heuristicaCustoBeneficio = this.adicionarBotao(new Button(
      0.5 * this.canvas.width,
      0.8 * this.canvas.height,
      0.25 * this.canvas.width,
      0.07 * this.canvas.height,
      "Heurística custo benefício"
    ));
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
      this.game.selecionaCena("cena1");
      this.game.adicionarHeuristica(new MaisBarato(this.canvas))
    }
    if (this.heuristicaCustoBeneficio.hasPoint({ x, y })) {
      this.game.selecionaCena("cena1");
      this.game.adicionarHeuristica(new CustoBeneficio(this.canvas))
    }
  }

  click(e) {
    this.mousedown(e);
  }

  mousemove(e) {
    super.mousemove(e);
  }

  desenharHud() { }
}
