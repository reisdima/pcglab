import Cena from "./Cena.js";
import Sprite from "../../js/Sprite.js";
import Button from "../../js/utils/Button.js";
import getXY from "../../js/utils/getXY.js";

export default class Cena1 extends Cena {
  constructor(canvas = null, assets = null) {
    super(canvas, assets);
    this.resources = [
      {
        label: "A",
        quantity: 0,
        currentCost: 15,
        initialCost: 15,
        currentIncome: 0,
        income: 0.1,
      },
      {
        label: "B",
        quantity: 0,
        currentCost: 100,
        initialCost: 100,
        currentIncome: 0,
        income: 0.5,
      },
      {
        label: "C",
        quantity: 0,
        currentCost: 500,
        initialCost: 500,
        currentIncome: 0,
        income: 4,
      },
      {
        label: "D",
        quantity: 0,
        currentCost: 3000,
        initialCost: 3000,
        currentIncome: 0,
        income: 10,
      },
      {
        label: "E",
        quantity: 0,
        currentCost: 40000,
        initialCost: 40000,
        currentIncome: 0,
        income: 40,
      },
    ];
    this.scoreRate = 0;
    this.scoreSpent = 0;
    this.currentScore = 15;
    this.counter = 0;
    this.spacePressed = false;
    this.createAreas();
  }

  desenhar() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = "20px Times";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "left";
    this.ctx.fillText("Poder: ", 50, 50);
    this.ctx.fillText(this.currentScore, 125, 50);
    this.ctx.fillText("Taxa: ", 50, 75);
    this.ctx.fillText(this.scoreRate, 125, 75);
    this.ctx.fillText("Gasto: ", 50, 100);
    this.ctx.fillText(this.scoreSpent, 125, 100);
    this.desenharTabela();
    this.newGame.draw(this.ctx);
  }

  desenharTabela() {
    let startX = 20;
    let startY = 150;
    let offsetX = 150;
    let offsetY = 50;
    // this.ctx.textAlign = "center";
    this.ctx.fillText("Recurso", startX, startY);
    this.ctx.fillText("Incremento", startX + offsetX, startY);
    this.ctx.fillText("Incremento total", startX + 2 * offsetX, startY);
    this.ctx.fillText("Quantidade", startX + 3 * offsetX, startY);
    this.ctx.fillText("Custo", startX + 4 * offsetX, startY);
    startY += offsetY;
    this.resources.forEach((resource) => {
      this.ctx.fillText(resource.label, startX, startY);
      this.ctx.fillText(resource.income, startX + offsetX, startY);
      this.ctx.fillText(
        parseFloat((resource.income * resource.quantity).toFixed(10)),
        startX + 2 * offsetX,
        startY
      );
      this.ctx.fillText(resource.quantity, startX + 3 * offsetX, startY);
      this.ctx.fillText(resource.currentCost, startX + 4 * offsetX, startY);
      startY += offsetY;
    });
  }

  createAreas() {
    this.newGame = new Button(
      0.7 * this.canvas.width,
      0.2 * this.canvas.height,
      0.2 * this.canvas.width,
      0.07 * this.canvas.height,
      "Click me"
    );
  }

  quadro(t) {
    super.quadro(t);
    this.counter += this.dt;
    this.controle();
    this.currentScore = parseFloat(
      (this.currentScore + this.scoreRate*this.dt).toFixed(10)
    );
    if (this.counter >= 1) {
      this.counter = 0;
    }
  }

  controle() {
    for (let i = 0; i < this.resources.length; i++) {
      const element = this.resources[i];
      if (this.input.comandos.get(element.label)) {
        if (this.currentScore >= element.currentCost) {
          this.currentScore = parseFloat(
            (this.currentScore - element.currentCost).toFixed(10)
          );
          this.scoreSpent += parseFloat(
            element.currentCost.toFixed(10)
          );
          element.quantity++;
          element.currentCost = Math.round(
            element.initialCost * Math.pow(1.15, element.quantity)
          );
          this.scoreRate = parseFloat(
            (this.scoreRate + element.income).toFixed(10)
          );
        }
        return;
      }
    }
    if (this.input.comandos.get("MAKE_POINT")) {
      if (!this.spacePressed) {
        this.spacePressed = true;
        // this.currentScore = parseFloat(
        //   (
        //     this.currentScore +
        //     1 +
        //     this.resources[0].quantity * this.resources[0].income
        //   ).toFixed(10)
        // );
      }
    } else {
      this.spacePressed = false;
    }
  }

  quandoColidir(a, b) {
    // if(a.tags.has("pc") && b.tags.has("coin")){
    //     if(!this.aRemover.includes(b)){
    //         this.aRemover.push(b);
    //         a.distancias.clear();
    //     }
    //     this.game.moedas += 1;
    // }
    // if(a.tags.has("pc") && b.tags.has("exit")){ // Se pc colidir com saída, remove os dois e reinicia a cena
    //     if(!this.aRemover.includes(a)){
    //         this.aRemover.push(a);
    //     }
    //     if(!this.aRemover.includes(b)){
    //         this.aRemover.push(b);
    //     }
    //     this.game.selecionaCena("fase1");
    // }
  }

  preparar() {
    super.preparar();
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

  mousedown(e) {
    if (this.assets.progresso() < 100.0 || this.expire > 0) {
      return;
    }
  }

  mousemove(e){
    const [x, y] = getXY(e, this.canvas);
    if (this.newGame.hasPoint({ x, y })) {
      this.canvas.style.cursor = 'pointer'
    } else {
      this.canvas.style.cursor = 'default'
    }
  }

  click(e) {
    this.mousedown(e);
    const [x, y] = getXY(e, this.canvas);
    if (this.newGame.hasPoint({ x, y })) {
      this.currentScore = parseFloat(
        (
          this.currentScore +
          1 +
          this.resources[0].quantity * this.resources[0].income
        ).toFixed(10)
      );
    }
  }

  desenharHud() {
    // Fase
    this.ctx.font = "15px Arial";
    this.ctx.textAlign = "left";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("Moedas coletadas: " + this.game.moedas, 10, 20);
    this.ctx.fillText("Sprites na tela: " + this.sprites.length, 10, 40);
  }
}
